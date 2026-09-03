/**
 * Per-locale text for the synthetic already-public corpus.
 *
 * `src/data/published.ts` and `src/data/replies.ts` carry English plus Hindi
 * (`titleHi`, `summaryHi`, `questionHi`, `answerHi`). Each further language
 * adds one `locale-text.<code>.ts` file keyed by record id. Anything missing
 * falls back to English at render time.
 */
import type { PublishedRecord } from "./published";
import type { ReleasedReply } from "./replies";
import { PUBLISHED_TEXT_BN, REPLY_TEXT_BN } from "./locale-text.bn";
import { PUBLISHED_TEXT_GU, REPLY_TEXT_GU } from "./locale-text.gu";
import { PUBLISHED_TEXT_KN, REPLY_TEXT_KN } from "./locale-text.kn";
import { PUBLISHED_TEXT_ML, REPLY_TEXT_ML } from "./locale-text.ml";
import { PUBLISHED_TEXT_MR, REPLY_TEXT_MR } from "./locale-text.mr";
import { PUBLISHED_TEXT_OR, REPLY_TEXT_OR } from "./locale-text.or";
import { PUBLISHED_TEXT_TA, REPLY_TEXT_TA } from "./locale-text.ta";
import { PUBLISHED_TEXT_TE, REPLY_TEXT_TE } from "./locale-text.te";
import { PUBLISHED_TEXT_UR, REPLY_TEXT_UR } from "./locale-text.ur";

export const PUBLISHED_TEXT: Record<string, Record<string, { title: string; summary: string }>> = {
  bn: PUBLISHED_TEXT_BN,
  gu: PUBLISHED_TEXT_GU,
  kn: PUBLISHED_TEXT_KN,
  ml: PUBLISHED_TEXT_ML,
  mr: PUBLISHED_TEXT_MR,
  or: PUBLISHED_TEXT_OR,
  ta: PUBLISHED_TEXT_TA,
  te: PUBLISHED_TEXT_TE,
  ur: PUBLISHED_TEXT_UR,
};

export const REPLY_TEXT: Record<string, Record<string, { question: string; answer: string }>> = {
  bn: REPLY_TEXT_BN,
  gu: REPLY_TEXT_GU,
  kn: REPLY_TEXT_KN,
  ml: REPLY_TEXT_ML,
  mr: REPLY_TEXT_MR,
  or: REPLY_TEXT_OR,
  ta: REPLY_TEXT_TA,
  te: REPLY_TEXT_TE,
  ur: REPLY_TEXT_UR,
};

export function publishedTitle(p: PublishedRecord, locale: string): string {
  if (locale === "hi") return p.titleHi;
  return PUBLISHED_TEXT[locale]?.[p.id]?.title || p.title;
}

export function publishedSummary(p: PublishedRecord, locale: string): string {
  if (locale === "hi") return p.summaryHi;
  return PUBLISHED_TEXT[locale]?.[p.id]?.summary || p.summary;
}

export function replyQuestion(r: ReleasedReply, locale: string): string {
  if (locale === "hi") return r.questionHi;
  return REPLY_TEXT[locale]?.[r.id]?.question || r.question;
}

export function replyAnswer(r: ReleasedReply, locale: string): string {
  if (locale === "hi") return r.answerHi;
  return REPLY_TEXT[locale]?.[r.id]?.answer || r.answer;
}

/** Every known variant of a record's text, for the search haystack. */
export function publishedVariants(p: PublishedRecord): string[] {
  const out = [p.title, p.titleHi, p.summary, p.summaryHi];
  for (const pack of Object.values(PUBLISHED_TEXT)) {
    const t = pack[p.id];
    if (t) out.push(t.title, t.summary);
  }
  return [...new Set(out.filter(Boolean))];
}

/** Every known variant of a reply's text, for the search haystack. */
export function replyVariants(r: ReleasedReply): string[] {
  const out = [r.question, r.questionHi, r.answer, r.answerHi];
  for (const pack of Object.values(REPLY_TEXT)) {
    const t = pack[r.id];
    if (t) out.push(t.question, t.answer);
  }
  return [...new Set(out.filter(Boolean))];
}
