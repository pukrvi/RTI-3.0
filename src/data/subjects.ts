/**
 * Language registry for routing keywords.
 *
 * Adding an Eighth Schedule language is a two-line change here plus one data file.
 * The matcher never needs to know which languages exist.
 */
import { SUBJECTS_HI } from "./subjects.hi";
import { PUBLISHED_HI } from "./published.hi";

export const SUBJECT_PACKS: Record<string, Record<string, string[]>> = {
  hi: SUBJECTS_HI,
  // ta: SUBJECTS_TA,   ← drop in and register
  // bn: SUBJECTS_BN,
};

/** All routing keywords for an authority, across every registered language. */
export function allSubjects(authorityId: string, baseSubjects: string[]): string[] {
  const extra = Object.values(SUBJECT_PACKS).flatMap((pack) => pack[authorityId] ?? []);
  return [...baseSubjects, ...extra];
}

/** Languages we currently have routing keywords for, beyond the English base. */
export const ROUTING_LANGUAGES = ["en", ...Object.keys(SUBJECT_PACKS)];

export const PUBLISHED_PACKS: Record<string, Record<string, string[]>> = {
  hi: PUBLISHED_HI,
};

/** All prior-art keywords for a published record, across every registered language. */
export function allKeywords(recordId: string, base: string[]): string[] {
  const extra = Object.values(PUBLISHED_PACKS).flatMap((pack) => pack[recordId] ?? []);
  return [...base, ...extra];
}
