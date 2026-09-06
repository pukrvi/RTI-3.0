/**
 * Language registry for routing keywords. All ten regional languages plus
 * Hindi are registered below; the matcher never needs to know which
 * languages exist.
 */
import { SUBJECTS_HI } from "./subjects.hi";
import { PUBLISHED_HI } from "./published.hi";
import { SUBJECTS_BN } from "./subjects.bn";
import { SUBJECTS_GU } from "./subjects.gu";
import { SUBJECTS_KN } from "./subjects.kn";
import { SUBJECTS_ML } from "./subjects.ml";
import { SUBJECTS_MR } from "./subjects.mr";
import { SUBJECTS_OR } from "./subjects.or";
import { SUBJECTS_TA } from "./subjects.ta";
import { SUBJECTS_TE } from "./subjects.te";
import { SUBJECTS_UR } from "./subjects.ur";
import { SUBJECTS_PA } from "./subjects.pa";
import { SUBJECTS_AS } from "./subjects.as";
import { PUBLISHED_BN } from "./published.bn";
import { PUBLISHED_GU } from "./published.gu";
import { PUBLISHED_KN } from "./published.kn";
import { PUBLISHED_ML } from "./published.ml";
import { PUBLISHED_MR } from "./published.mr";
import { PUBLISHED_OR } from "./published.or";
import { PUBLISHED_TA } from "./published.ta";
import { PUBLISHED_TE } from "./published.te";
import { PUBLISHED_UR } from "./published.ur";
import { PUBLISHED_PA } from "./published.pa";
import { PUBLISHED_AS } from "./published.as";
import { REPLY_KEYWORDS_HI } from "./reply-keywords.hi";
import { REPLY_KEYWORDS_BN } from "./reply-keywords.bn";
import { REPLY_KEYWORDS_GU } from "./reply-keywords.gu";
import { REPLY_KEYWORDS_KN } from "./reply-keywords.kn";
import { REPLY_KEYWORDS_ML } from "./reply-keywords.ml";
import { REPLY_KEYWORDS_MR } from "./reply-keywords.mr";
import { REPLY_KEYWORDS_OR } from "./reply-keywords.or";
import { REPLY_KEYWORDS_TA } from "./reply-keywords.ta";
import { REPLY_KEYWORDS_TE } from "./reply-keywords.te";
import { REPLY_KEYWORDS_UR } from "./reply-keywords.ur";
import { REPLY_KEYWORDS_PA } from "./reply-keywords.pa";
import { REPLY_KEYWORDS_AS } from "./reply-keywords.as";

export const SUBJECT_PACKS: Record<string, Record<string, string[]>> = {
  hi: SUBJECTS_HI,
  bn: SUBJECTS_BN,
  gu: SUBJECTS_GU,
  kn: SUBJECTS_KN,
  ml: SUBJECTS_ML,
  mr: SUBJECTS_MR,
  or: SUBJECTS_OR,
  ta: SUBJECTS_TA,
  te: SUBJECTS_TE,
  ur: SUBJECTS_UR,
  pa: SUBJECTS_PA,
  as: SUBJECTS_AS,
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
  bn: PUBLISHED_BN,
  gu: PUBLISHED_GU,
  kn: PUBLISHED_KN,
  ml: PUBLISHED_ML,
  mr: PUBLISHED_MR,
  or: PUBLISHED_OR,
  ta: PUBLISHED_TA,
  te: PUBLISHED_TE,
  ur: PUBLISHED_UR,
  pa: PUBLISHED_PA,
  as: PUBLISHED_AS,
};

/** All prior-art keywords for a published record, across every registered language. */
export function allKeywords(recordId: string, base: string[]): string[] {
  const extra = Object.values(PUBLISHED_PACKS).flatMap((pack) => pack[recordId] ?? []);
  return [...base, ...extra];
}

/**
 * Per-language keywords for matching released replies (`matchReplies`),
 * keyed by reply id from `src/data/replies.ts`.
 *
 * Same drop-in pattern: `reply-keywords.<code>.ts` exporting
 * `REPLY_KEYWORDS_<CODE>`, registered below. English `keywords` on the
 * record always apply on top.
 */
export const REPLY_PACKS: Record<string, Record<string, string[]>> = {
  hi: REPLY_KEYWORDS_HI,
  bn: REPLY_KEYWORDS_BN,
  gu: REPLY_KEYWORDS_GU,
  kn: REPLY_KEYWORDS_KN,
  ml: REPLY_KEYWORDS_ML,
  mr: REPLY_KEYWORDS_MR,
  or: REPLY_KEYWORDS_OR,
  ta: REPLY_KEYWORDS_TA,
  te: REPLY_KEYWORDS_TE,
  ur: REPLY_KEYWORDS_UR,
  pa: REPLY_KEYWORDS_PA,
  as: REPLY_KEYWORDS_AS,
};

/** All matching keywords for a released reply, across every registered language. */
export function allReplyKeywords(replyId: string, base: string[]): string[] {
  const extra = Object.values(REPLY_PACKS).flatMap((pack) => pack[replyId] ?? []);
  return [...base, ...extra];
}
