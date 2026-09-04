/**
 * The current draft, and the cookie that points at it.
 *
 * The cookie holds an opaque id and nothing else: no name, no email, no answers.
 * There is no account and no login — the live portal has none either, and that is
 * one of the few things it gets right. An anonymous handle avoids building an
 * identity record around politically sensitive requests.
 */
import { cookies } from "next/headers";
import { getCase, type CaseFile } from "@/lib/store";
import { AUTHORITIES, type Authority } from "@/data/authorities";
import { AUTHORITY_NAMES } from "@/data/authority-names";

export const CASE_COOKIE = "rti_case";

export async function readCaseId(): Promise<string | undefined> {
  return (await cookies()).get(CASE_COOKIE)?.value;
}

export async function currentCase(): Promise<CaseFile | null> {
  return getCase(await readCaseId());
}

export async function setCaseCookie(id: string): Promise<void> {
  (await cookies()).set(CASE_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearCaseCookie(): Promise<void> {
  (await cookies()).delete(CASE_COOKIE);
}

export function authorityById(id: string | undefined): Authority | undefined {
  return AUTHORITIES.find((a) => a.id === id);
}

/**
 * Display name for the body a filing is addressed to, in the citizen's
 * language where we have one. Directory choices (ministry + authority text)
 * are shown verbatim — they are the portal's own official names.
 */
export function caseAuthorityLabel(
  file: Pick<CaseFile, "authorityId" | "authorityText" | "ministry">,
  locale: string,
): string {
  const known = authorityById(file.authorityId);
  if (known) return authorityName(known, locale);
  return file.authorityText || file.ministry || "—";
}

/**
 * Registration-number segment for a filing. Routable bodies use their real
 * code; anything else derives one from its own name — `makeRef` sanitises it
 * to five characters either way.
 */
export function caseAuthorityCode(
  file: Pick<CaseFile, "authorityId" | "authorityText" | "ministry">,
): string {
  const known = authorityById(file.authorityId);
  if (known) return known.code;
  const raw = file.authorityText || file.ministry || "CENTL";
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, 5) || "CENTL";
}

/**
 * Map a routable authority id to its directory position: the apex
 * ministry/department heading, and the authority text under it. Used to
 * pre-select the two filing dropdowns from a chat suggestion.
 */
export async function suggestDirectory(id: string): Promise<{
  ministry: string;
  authorityText: string;
} | null> {
  const known = authorityById(id);
  if (!known) return null;
  const { DIRECTORY } = await import("@/data/directory");
  const norm = (s: string) =>
    s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
  // The body itself is an apex heading.
  const apex = DIRECTORY.find((e) => e.routes === id);
  if (apex) return { ministry: apex.name, authorityText: apex.name };
  // Otherwise it sits under a heading as a named child.
  const want = norm(known.name);
  for (const entry of DIRECTORY) {
    if (entry.children.some((c) => norm(c) === want)) {
      return { ministry: entry.name, authorityText: known.name };
    }
  }
  return null;
}

/** Find the apex heading a directory authority name sits under, if any. */
export async function directoryParentFor(name: string): Promise<string | null> {
  const { DIRECTORY } = await import("@/data/directory");
  const hit = DIRECTORY.find((e) => e.children.includes(name));
  return hit ? hit.name : null;
}

export function centralAuthorities(): Authority[] {
  return AUTHORITIES.filter((a) => a.scope === "central").sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** The authority's name in the citizen's language, where we have one. */
export function authorityName(authority: Authority, locale: string): string {
  if (locale === "hi" && authority.nameHi) return authority.nameHi;
  return AUTHORITY_NAMES[locale]?.[authority.id]?.name || authority.name;
}

/** The out-of-scope redirect note in the citizen's language, where we have one. */
export function redirectNote(authority: Authority, locale: string): string | undefined {
  if (locale === "hi" && authority.redirect?.noteHi) return authority.redirect.noteHi;
  return AUTHORITY_NAMES[locale]?.[authority.id]?.redirectNote ?? authority.redirect?.note;
}

/** The out-of-scope redirect label in the citizen's language, where we have one. */
export function redirectLabel(authority: Authority, locale: string): string | undefined {
  if (locale === "hi" && authority.redirect?.labelHi) return authority.redirect.labelHi;
  return AUTHORITY_NAMES[locale]?.[authority.id]?.redirectLabel ?? authority.redirect?.label;
}
