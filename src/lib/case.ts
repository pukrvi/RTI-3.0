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
