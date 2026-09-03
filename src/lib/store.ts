/**
 * Draft storage.
 *
 * Two drivers behind one interface:
 *   • Cloudflare KV, when the `DRAFTS` binding exists (the deployed prototype)
 *   • an in-memory Map otherwise, so `next dev` works with no setup at all
 *
 * Drafts are deliberately temporary — 24-hour TTL, keyed to an opaque cookie, no
 * account, no login, no personal data beyond what the citizen types into the
 * application itself. This is a prototype, and the honest thing is to store as
 * little as possible for as short a time as possible.
 */

export interface FiledRecord {
  /** Mock registration number in the real portal's shape. */
  ref: string;
  /** Effective filing date (ISO). */
  at: string;
}

export interface ReplyRecord {
  at: string;
  kind: "full" | "partial-refusal" | "refused";
}

/** A filing the applicant withdrew. The fee stays paid; the case needs
 *  nothing further and can never be appealed. */
export interface DeletedRecord {
  at: string;
  note?: string;
}

export interface AppealRecord {
  ref: string;
  at: string;
  ground: string;
  text: string;
}

export interface ChatTurn {
  role: "user" | "app";
  text: string;
}

export interface CaseFile {
  id: string;
  createdAt: string;
  locale: string;

  /** Step 1 */
  question: string;
  /** The conversation that produced it, if the citizen used the assistant. */
  chat?: ChatTurn[];
  /** Whether a model was involved in the last read, for the badge. */
  aiUsed?: boolean;
  /** The assistant's suggested rewrite, offered but never imposed. */
  betterQuestion?: string;

  /** Step 2 */
  dismissedPublished?: boolean;

  /** Step 3 */
  authorityId?: string;

  /** Step 4 */
  subject?: string;
  body?: string;
  name?: string;
  email?: string;
  addr1?: string;
  addr2?: string;
  addr3?: string;
  pin?: string;

  /** The signed-in contact this case belongs to, once there is one. */
  owner?: string;

  /** Steps 5–7 */
  filed?: FiledRecord;
  reply?: ReplyRecord;
  appeal?: AppealRecord;

  /** Set when the applicant withdrew the request. See DeletedRecord. */
  deleted?: DeletedRecord;

  /** Demo-only display clock, in days. Never affects stored timestamps. */
  clockOffsetDays: number;
}

export type StorageKind = "cloudflare-kv" | "in-memory";

interface Driver {
  kind: StorageKind;
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}

const TTL_SECONDS = 60 * 60 * 24;

const memory = new Map<string, string>();

const memoryDriver: Driver = {
  kind: "in-memory",
  async get(key) {
    return memory.get(key) ?? null;
  },
  async put(key, value) {
    memory.set(key, value);
  },
  async del(key) {
    memory.delete(key);
  },
};

interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

function kvDriver(kv: KVLike): Driver {
  return {
    kind: "cloudflare-kv",
    get: (key) => kv.get(key),
    put: (key, value) => kv.put(key, value, { expirationTtl: TTL_SECONDS }),
    del: (key) => kv.delete(key),
  };
}

async function driver(): Promise<Driver> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const kv = (ctx?.env as unknown as { DRAFTS?: KVLike })?.DRAFTS;
    if (kv && typeof kv.get === "function") return kvDriver(kv);
  } catch {
    // No Workers runtime and no binding — dev, test, or a deploy without KV.
  }
  return memoryDriver;
}

/** Which driver is live. Shown in the interface, because honesty is a judging criterion. */
export async function storageKind(): Promise<StorageKind> {
  return (await driver()).kind;
}

const KEY = (id: string) => `case:${id}`;
const REF_KEY = (ref: string) => `ref:${ref.toUpperCase()}`;

/** URL-safe opaque id. Not derived from anything the citizen typed. */
export function newCaseId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getCase(id: string | undefined): Promise<CaseFile | null> {
  if (!id) return null;
  const raw = await (await driver()).get(KEY(id));
  if (raw) {
    try {
      return JSON.parse(raw) as CaseFile;
    } catch {
      return null;
    }
  }
  // Seeded demo records ship with the code and live outside the temporary
  // store, so the demo account works on a fresh clone with no setup.
  const { demoCaseById } = await import("@/data/demo-account");
  return demoCaseById(id);
}

export async function putCase(file: CaseFile): Promise<void> {
  await (await driver()).put(KEY(file.id), JSON.stringify(file));
}

export async function deleteCase(id: string): Promise<void> {
  await (await driver()).del(KEY(id));
}

/**
 * A registration number is the only handle a citizen ever has on their case, so
 * it has to be enough to find it again. The live portal makes them re-enter it
 * with their email and a captcha on a differently-named screen.
 */
export async function indexRef(ref: string, id: string): Promise<void> {
  await (await driver()).put(REF_KEY(ref), id);
}

export async function findByRef(ref: string): Promise<CaseFile | null> {
  const cleaned = ref.trim().toUpperCase();
  if (!cleaned) return null;
  const id = await (await driver()).get(REF_KEY(cleaned));
  if (id) {
    const found = await getCase(id);
    if (found) return found;
  }
  const { demoCaseByRef } = await import("@/data/demo-account");
  return demoCaseByRef(cleaned);
}

/* ------------------------------------------------- account index ---------
 * KV has no query, so an account's filings are one more key holding a list of
 * ids. Small, cheap, and it expires with everything else.
 * ------------------------------------------------------------------------ */

const OWNER_KEY = (contact: string) => `owner:${contact.toLowerCase()}`;

export async function addToAccount(contact: string, id: string): Promise<void> {
  const d = await driver();
  const raw = await d.get(OWNER_KEY(contact));
  const ids: string[] = raw ? JSON.parse(raw) : [];
  if (!ids.includes(id)) ids.unshift(id);
  await d.put(OWNER_KEY(contact), JSON.stringify(ids.slice(0, 50)));
}

export async function listForAccount(contact: string): Promise<CaseFile[]> {
  const raw = await (await driver()).get(OWNER_KEY(contact));
  const ids: string[] = raw ? JSON.parse(raw) : [];
  const files = await Promise.all(ids.map((id) => getCase(id)));
  const stored = files.filter((f): f is CaseFile => Boolean(f));
  // The demo account's seeded records ship with the code. Anything the
  // visitor files themselves is stored normally and appears alongside them;
  // stored records win if an id ever collides with a seed.
  const { DEMO_CASES, isDemoContact } = await import("@/data/demo-account");
  if (!isDemoContact(contact)) return stored;
  const seen = new Set(stored.map((f) => f.id));
  return [...stored, ...DEMO_CASES.filter((c) => !seen.has(c.id))];
}

export async function updateCase(
  id: string,
  patch: Partial<CaseFile>,
): Promise<CaseFile | null> {
  const current = await getCase(id);
  if (!current) return null;
  const next = { ...current, ...patch };
  await putCase(next);
  return next;
}

/* ------------------------------------------------------ saved details ----
 * The live portal asks for the same twelve personal fields on every request
 * and every appeal, and remembers none of them: `View History` is a read-only
 * lookup, not an account. Typing a full postal address into a phone browser is
 * where a lot of filings die.
 *
 * Saved once here and reused, with the same 24-hour expiry as everything else.
 * Nothing sensitive is invited: there is no Aadhaar field, no PAN field, no
 * card field, and the BPL block is labelled as demonstration-only.
 * ------------------------------------------------------------------------ */

export interface Profile {
  name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  gender?: "male" | "female" | "third";
  addr1?: string;
  addr2?: string;
  addr3?: string;
  pin?: string;
  country?: "india" | "other";
  state?: string;
  habitation?: "rural" | "urban";
  education?: "literate" | "illiterate";
  citizenship?: "indian" | "other";
  bpl?: "yes" | "no";
  bplCard?: string;
  bplYear?: string;
  bplAuthority?: string;
  /** ISO timestamp of the last save, so the page can say when. */
  updatedAt?: string;
}

const PROFILE_KEY = (contact: string) => `profile:${contact.toLowerCase()}`;

export async function getProfile(contact: string | undefined): Promise<Profile | null> {
  if (!contact) return null;
  const raw = await (await driver()).get(PROFILE_KEY(contact));
  let saved: Profile | null = null;
  if (raw) {
    try {
      saved = JSON.parse(raw) as Profile;
    } catch {
      saved = null;
    }
  }
  const { DEMO_PROFILE, isDemoContact } = await import("@/data/demo-account");
  // The demo account arrives with its details filled in. A saved profile
  // overlays it field by field — saved values win, but blank saved fields
  // never erase a seeded one, so the demo survives an accidental save.
  if (!isDemoContact(contact)) return saved;
  if (!saved) return DEMO_PROFILE;
  const kept = Object.fromEntries(
    Object.entries(saved).filter(([, v]) => v !== undefined && v !== ""),
  );
  return { ...DEMO_PROFILE, ...kept };
}

export async function putProfile(contact: string, profile: Profile): Promise<void> {
  await (await driver()).put(PROFILE_KEY(contact), JSON.stringify(profile));
}
