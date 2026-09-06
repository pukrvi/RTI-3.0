/**
 * SYNTHETIC demo account — vish@abc.com / Rti@2026.
 *
 * ⚠ Every record here is INVENTED for this prototype: the name of the account
 * holder is real (Puneet Vishnawat, who asked for this demo), and everything
 * else — the questions, replies, dates, registration numbers, address and
 * phone number — is fabricated. No real reply is reproduced, no real person
 * besides the account holder is named, and no live system was queried.
 *
 * Why it exists: the prototype stores drafts in a temporary key-value store
 * (24-hour TTL) or in process memory, so a fresh clone has an empty account.
 * These records ship with the code, so that signing in with the demo contact
 * always shows a lived-in account — dashboard, track status, history, appeals
 * and payments — with zero setup and no database.
 *
 * How it works: `src/lib/store.ts` falls back to these records when the
 * contact matches {@link DEMO_CONTACT} (case-insensitive) and no stored
 * record shadows them. Anything the visitor files themselves is stored
 * normally and appears alongside the seeds. Seeded records are read-only:
 * the demo clock / reply controls require the browser cookie that filed the
 * case, which a seed never has, so the track page hides them for seeds.
 *
 * Dates are relative to load time (`daysAgo`), so the demo never goes stale:
 * the waiting request is always waiting, the overdue one always overdue, and
 * the appeal windows always read the way the comments below describe. Mock
 * registration numbers are generated with the same `makeRef` helper the
 * filing flow uses, so their shape and year always match their filing date.
 */

import { byId } from "@/data/authorities";
import { DEMO_AADHAAR_IDENTITY } from "@/lib/signup";
import { DEMO_TEXT_HI, DEMO_AADHAAR_ADDR2_HI } from "./demo-text.hi";
import { DEMO_TEXT_BN, DEMO_AADHAAR_ADDR2_BN } from "./demo-text.bn";
import { DEMO_TEXT_GU, DEMO_AADHAAR_ADDR2_GU } from "./demo-text.gu";
import { DEMO_TEXT_KN, DEMO_AADHAAR_ADDR2_KN } from "./demo-text.kn";
import { DEMO_TEXT_ML, DEMO_AADHAAR_ADDR2_ML } from "./demo-text.ml";
import { DEMO_TEXT_MR, DEMO_AADHAAR_ADDR2_MR } from "./demo-text.mr";
import { DEMO_TEXT_OR, DEMO_AADHAAR_ADDR2_OR } from "./demo-text.or";
import { DEMO_TEXT_TA, DEMO_AADHAAR_ADDR2_TA } from "./demo-text.ta";
import { DEMO_TEXT_TE, DEMO_AADHAAR_ADDR2_TE } from "./demo-text.te";
import { DEMO_TEXT_UR, DEMO_AADHAAR_ADDR2_UR } from "./demo-text.ur";
import { DEMO_TEXT_PA, DEMO_AADHAAR_ADDR2_PA } from "./demo-text.pa";
import { DEMO_TEXT_AS, DEMO_AADHAAR_ADDR2_AS } from "./demo-text.as";
import { makeRef } from "@/lib/ref";
import type { CaseFile, Profile } from "@/lib/store";

/** The demo login shown on the sign-in card. */
export const DEMO_CONTACT = "vish@abc.com";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(n: number): string {
  return new Date(Date.now() - n * DAY_MS).toISOString();
}

function code(authorityId: string): string {
  const found = byId(authorityId);
  if (!found) throw new Error(`demo-account: unknown authority ${authorityId}`);
  return found.code;
}

/** Personal details for the demo holder. Name, gender, BPL, habitation and
 *  education are as requested; the address and phone number are invented. */
export const DEMO_PROFILE: Profile = {
  name: "Puneet Vishnawat",
  email: DEMO_CONTACT,
  mobile: "98110 45623",
  phone: "",
  gender: "male",
  addr1: "B-42, Second Floor, Lajpat Nagar II",
  addr2: "New Delhi",
  addr3: "",
  pin: "110024",
  country: "india",
  state: "Delhi",
  habitation: "urban",
  education: "illiterate",
  citizenship: "indian",
  bpl: "no",
  bplCard: "",
  bplYear: "",
  bplAuthority: "",
  updatedAt: daysAgo(12),
};

interface Seed {
  id: string;
  authorityId: string;
  question: string;
  subject: string;
  body: string;
  /** Days ago the request was filed. */
  filedDaysAgo: number;
  /** Days ago the CPIO replied, if they did. */
  repliedDaysAgo?: number;
  replyKind?: "full" | "partial-refusal" | "refused";
  /** Days ago the first appeal was filed, if one was. */
  appealDaysAgo?: number;
  appealGround?: string;
  appealText?: string;
  /** Days ago the applicant withdrew the request, if they did. */
  deletedDaysAgo?: number;
  deletedNote?: string;
}

const APPLICANT = {
  name: "Puneet Vishnawat",
  email: DEMO_CONTACT,
  addr1: "B-42, Second Floor, Lajpat Nagar II",
  addr2: "New Delhi",
  addr3: "",
  pin: "110024",
};

const PERIOD_5Y = "1 April 2021 to 31 March 2026";
const PERIOD_FY = "1 April 2025 to 31 March 2026";

const SEEDS: Seed[] = [
  {
    // In flight: filed 6 days ago, CPIO still has time. The track page shows
    // the meter running; nothing is appealable yet.
    id: "demo-r1-nh48",
    authorityId: "morth",
    question:
      "Which companies were awarded road construction contracts on the Delhi–Jaipur stretch of NH-48 in the last five years, and at what cost?",
    subject: "Road contracts awarded on the Delhi–Jaipur stretch of NH-48, 2021–2026",
    body: [
      `1. A list of all road construction and maintenance contracts awarded for the Delhi–Jaipur stretch of NH-48 for the period from ${PERIOD_5Y}, showing for each contract the name of the contractor, the length of the stretch, and the sanctioned cost.`,
      "2. For each of the above contracts, the date of award, the scheduled date of completion, and the actual date of completion or the current physical progress.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 6,
  },
  {
    // In flight and running out: filed 26 days ago, 4 days left. Shows the
    // due-soon treatment on track status.
    id: "demo-r2-railrefund",
    authorityId: "railways",
    question:
      "How much money was refunded to passengers for trains cancelled in the last financial year?",
    subject: "Refunds paid for trains cancelled in 2025–26",
    body: [
      `1. The total number of trains cancelled in the period from ${PERIOD_FY} and the total amount refunded to passengers, zone-wise.`,
      "2. The average number of days taken to credit refunds for e-tickets and for counter tickets in the same period.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 26,
  },
  {
    // Overdue with no reply: filed 45 days ago, so 15 days past the 30-day
    // deadline. A deemed refusal — the appeal window is open, and the
    // dashboard, track status and file-appeal pages all say so.
    id: "demo-r3-pmkisan",
    authorityId: "agri",
    question:
      "How many PM-KISAN beneficiaries were removed in Nashik district, Maharashtra in 2024–25 and 2025–26, and on what grounds?",
    subject: "PM-KISAN beneficiaries removed in Nashik district, Maharashtra, 2024–2026",
    body: [
      `1. The number of PM-KISAN beneficiaries removed from the beneficiary list in Nashik district, Maharashtra in each year from 1 April 2024 to 31 March 2026, with the grounds recorded for removal in each case (income-tax payer, land record mismatch, duplicate Aadhaar seeding or other).`,
      "2. The number of instalments withheld on account of such removals in the same period.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 45,
  },
  {
    // Answered in full: filed 70 days ago, replied 48 days ago, so the
    // 30-day appeal window has closed. Disposed, read-only history.
    id: "demo-r4-epfo",
    authorityId: "epfo-org",
    question: "What was the median settlement time for PF withdrawal claims at the EPFO Regional Office, Delhi in Jan–Mar 2026?",
    subject: "Time taken to settle PF withdrawal claims at the EPFO Regional Office, Delhi, Jan–Mar 2026",
    body: [
      `1. The median number of working days taken to settle online PF withdrawal claims and physical PF withdrawal claims at the EPFO Regional Office, Delhi in the quarter from 1 January 2026 to 31 March 2026.`,
      "2. The number of PF withdrawal claims rejected at the same office in the same quarter, with the three most common reasons for rejection.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 70,
    repliedDaysAgo: 48,
    replyKind: "full",
  },
  {
    // Answered in part: point 1 supplied, point 2 refused under section
    // 8(1)(j). Window closed — shows the partial-refusal reply on the track
    // page as settled history.
    id: "demo-r5-mgnrega",
    authorityId: "rural",
    question: "How much MGNREGA wage money was pending in Gaya district, Bihar as on 31 March 2026, and what delay compensation was paid in 2025–26?",
    subject: "Pending MGNREGA wage payments and delay compensation in Gaya district, Bihar",
    body: [
      `1. The total amount of MGNREGA wage payments pending in Gaya district, Bihar as on 31 March 2026, with the number of workers affected.`,
      "2. Muster-roll-wise details of workers in the same district whose wages were delayed beyond 15 days in 2025–26, with the delay compensation paid in each case.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 65,
    repliedDaysAgo: 40,
    replyKind: "partial-refusal",
  },
  {
    // Refused: asks for a named private company's tax returns and refund
    // details — third-party personal information, denied in full under
    // section 8(1)(j). Reply is recent, so the appeal window is still open
    // and this sits in "ready to appeal" beside the overdue PM-KISAN case.
    id: "demo-r6-cbdt",
    authorityId: "cbdt-cpc",
    question:
      "Income-tax returns and refund details of a named private company for the last five years",
    subject: "Income-tax returns and refunds of M/s Brightline Traders Pvt. Ltd., 2021–2026",
    body: [
      `1. Certified copies of the income-tax returns filed by M/s Brightline Traders Pvt. Ltd. (PAN AAFCB0000A) for the period from ${PERIOD_5Y}.`,
      "2. Details of all income-tax refunds issued to the said company in the same period, with the dates of issue.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 34,
    repliedDaysAgo: 12,
    replyKind: "refused",
  },
  {
    // Appealed: partial reply arrived, applicant appealed the refused part.
    // Shows in the appeals "filed" list and carries an appeal registration
    // number in history. No fee — first appeals are free under the Act.
    id: "demo-r7-toll",
    authorityId: "nhai",
    question:
      "How much toll was collected at each plaza on the Delhi–Meerut Expressway and how is it used?",
    subject: "Toll collected on the Delhi–Meerut Expressway and its use, 2021–2026",
    body: [
      `1. The amount of toll collected at each toll plaza on the Delhi–Meerut Expressway in each year from ${PERIOD_5Y}.`,
      "2. Copies of the correspondence with the concessionaire regarding revision of toll rates in the same period.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 80,
    repliedDaysAgo: 55,
    replyKind: "partial-refusal",
    appealDaysAgo: 45,
    appealGround: "incomplete",
    appealText:
      "The CPIO supplied the toll collection figures but refused the concessionaire correspondence under section 8(1)(d). The correspondence concerns the revision of toll rates charged to the public, and larger public interest warrants its disclosure. I request the First Appellate Authority to examine the refusal and direct the CPIO to supply the remaining information.",
  },
  {
    // Answered in full, long settled: filed 90 days ago, replied 65 days ago,
    // so the 30-day appeal window has closed. Read-only history. There is no
    // withdrawal in this product, so no seed exercises a withdrawn state.
    id: "demo-r8-dopt",
    authorityId: "dopt",
    question: "How many RTI applications did the department receive and dispose of last year?",
    subject: "RTI applications received and disposed of by the department in 2025–26",
    body: [
      `1. The number of RTI applications received, disposed of, rejected (with the section cited for each rejection) and carried forward by the department in the period from ${PERIOD_FY}.`,
      "2. The number of first appeals received and decided in the same period.",
      "3. If any part of this information is held by another public authority, please transfer that part under section 6(3) of the RTI Act, 2005 and inform me of the transfer.",
      "4. Please supply the information in electronic form to the email address given above.",
    ].join("\n\n"),
    filedDaysAgo: 90,
    repliedDaysAgo: 65,
    replyKind: "full",
  },
];

function buildCase(seed: Seed): CaseFile {
  const filedAt = daysAgo(seed.filedDaysAgo);
  const filed = { ref: makeRef(code(seed.authorityId), "R", filedAt, seed.id), at: filedAt };
  const reply = seed.repliedDaysAgo
    ? {
        at: daysAgo(seed.repliedDaysAgo),
        kind: (seed.replyKind ?? "full") as NonNullable<CaseFile["reply"]>["kind"],
      }
    : undefined;
  const appeal =
    seed.appealDaysAgo && reply
      ? {
          ref: makeRef(code(seed.authorityId), "A", daysAgo(seed.appealDaysAgo), seed.id),
          at: daysAgo(seed.appealDaysAgo),
          ground: seed.appealGround ?? "other",
          text: seed.appealText ?? "",
        }
      : undefined;
  const deleted = seed.deletedDaysAgo
    ? { at: daysAgo(seed.deletedDaysAgo), note: seed.deletedNote ?? "" }
    : undefined;
  return {
    id: seed.id,
    createdAt: filedAt,
    locale: "en",
    question: seed.question,
    authorityId: seed.authorityId,
    subject: seed.subject,
    body: seed.body,
    ...APPLICANT,
    owner: DEMO_CONTACT,
    filed,
    reply,
    appeal,
    deleted,
    clockOffsetDays: 0,
  };
}

export const DEMO_CASES: CaseFile[] = SEEDS.map(buildCase);

const byIdMap = new Map(DEMO_CASES.map((c) => [c.id, c]));
/**
 * Per-locale renderings of the seeds' filed content.
 *
 * The seeds are filed once, in English. When a citizen browses the demo
 * account in another locale, the viewing locale's pack overlays the filed
 * text -- same drop-in pattern as locale-text files, keyed by seed id
 * (demo-r1-nh48 through demo-r8-dopt). Each pack carries appealText only
 * for demo-r7-toll, the one seed that has appealed.
 */
export interface DemoSeedText {
  question: string;
  subject: string;
  body: string;
  appealText?: string;
}

export const DEMO_TEXT: Record<string, Record<string, DemoSeedText>> = {
  hi: DEMO_TEXT_HI,
  bn: DEMO_TEXT_BN,
  gu: DEMO_TEXT_GU,
  kn: DEMO_TEXT_KN,
  ml: DEMO_TEXT_ML,
  mr: DEMO_TEXT_MR,
  or: DEMO_TEXT_OR,
  ta: DEMO_TEXT_TA,
  te: DEMO_TEXT_TE,
  ur: DEMO_TEXT_UR,
  pa: DEMO_TEXT_PA,
  as: DEMO_TEXT_AS,
};

/** The mock Aadhaar handoff's street line, per locale. Proper nouns stay. */
export const DEMO_AADHAAR_ADDR2: Record<string, string> = {
  hi: DEMO_AADHAAR_ADDR2_HI,
  bn: DEMO_AADHAAR_ADDR2_BN,
  gu: DEMO_AADHAAR_ADDR2_GU,
  kn: DEMO_AADHAAR_ADDR2_KN,
  ml: DEMO_AADHAAR_ADDR2_ML,
  mr: DEMO_AADHAAR_ADDR2_MR,
  or: DEMO_AADHAAR_ADDR2_OR,
  ta: DEMO_AADHAAR_ADDR2_TA,
  te: DEMO_AADHAAR_ADDR2_TE,
  ur: DEMO_AADHAAR_ADDR2_UR,
  pa: DEMO_AADHAAR_ADDR2_PA,
  as: DEMO_AADHAAR_ADDR2_AS,
};

/** Overlay a demo case's filed text with the viewing locale's rendering. */
export function localizeDemoCase(file: CaseFile, locale: string): CaseFile {
  const pack = DEMO_TEXT[locale]?.[file.id];
  if (!pack) return file;
  return {
    ...file,
    question: pack.question,
    subject: pack.subject,
    body: pack.body,
    appeal:
      file.appeal && pack.appealText ? { ...file.appeal, text: pack.appealText } : file.appeal,
  };
}

/** Localised street line for the simulated Aadhaar identity. */
export function demoAadhaarAddr2(locale: string): string {
  return DEMO_AADHAAR_ADDR2[locale] ?? DEMO_AADHAAR_IDENTITY.addr2;
}


/** Case-insensitive, so Vish@ABC.com sees the same demo. */
export function isDemoContact(contact: string | undefined): boolean {
  return (contact ?? "").trim().toLowerCase() === DEMO_CONTACT;
}

export function isDemoCaseId(id: string | undefined): boolean {
  return !!id && byIdMap.has(id);
}

export function demoCaseById(id: string | undefined): CaseFile | null {
  if (!id) return null;
  return byIdMap.get(id) ?? null;
}

/** Matches request refs and appeal refs, ignoring case and whitespace. */
export function demoCaseByRef(ref: string): CaseFile | null {
  const cleaned = ref.trim().toUpperCase();
  if (!cleaned) return null;
  return (
    DEMO_CASES.find(
      (c) =>
        c.filed?.ref.toUpperCase() === cleaned ||
        (c.appeal && c.appeal.ref.toUpperCase() === cleaned),
    ) ?? null
  );
}
