/**
 * Routing and prior-art matching.
 *
 * Deliberately transparent, deterministic keyword scoring — no model call, no network.
 * That is a v0 choice, not an end state: a production version would use semantic
 * retrieval over each authority's real subject matter and its section-4 disclosures.
 * Keeping v0 deterministic means the demo behaves identically every time, and every
 * result can be explained to a citizen ("matched on: ration card").
 */

import { AUTHORITIES, type Authority } from "@/data/authorities";
import { PUBLISHED, type PublishedRecord } from "@/data/published";
import { REPLIES, type ReleasedReply } from "@/data/replies";
import { allSubjects, allKeywords } from "@/data/subjects";

/** Strip punctuation, lowercase, drop very short tokens and stopwords. */
const STOP = new Set([
  "the", "and", "for", "with", "from", "what", "which", "how", "many", "much", "about",
  "please", "give", "want", "know", "need", "information", "details", "detail", "data",
  "provide", "under", "rti", "act", "copy", "list", "status", "regarding", "kindly",
  "sir", "madam", "total", "number", "year", "years", "last", "since", "all", "any",
  "मुझे", "जानकारी", "चाहिए", "कृपया", "कितने", "क्या", "कैसे", "के", "की", "का", "में", "है", "हैं",
]);

export function tokens(input: string): string[] {
  return input
    .toLowerCase()
    // \p{M} matters: Devanagari and most Indic scripts write vowels as combining
    // marks. Omitting it shatters "किसान" into fragments and Hindi routing silently
    // returns nothing. This one character is the difference between the portal
    // accepting an Indian language and only appearing to.
    .replace(/[^\p{L}\p{N}\p{M}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export interface Scored<T> {
  item: T;
  score: number;
  /** Which of the citizen's own words caused the match — shown back to them. */
  matched: string[];
}

function scoreAgainst(keywords: string[], toks: string[]): { score: number; matched: string[] } {
  const matched = new Set<string>();
  let score = 0;
  for (const kw of keywords) {
    const kwToks = kw.toLowerCase().split(/\s+/);
    // whole-phrase hit is worth much more than a single word
    if (kwToks.length > 1) {
      const joined = toks.join(" ");
      if (joined.includes(kw.toLowerCase())) {
        score += 6 * kwToks.length;
        kwToks.forEach((t) => matched.add(t));
        continue;
      }
    }
    for (const t of toks) {
      if (t === kw.toLowerCase()) { score += 5; matched.add(t); }
      else if (kw.toLowerCase().includes(t) && t.length >= 4) { score += 2; matched.add(t); }
      else if (t.includes(kw.toLowerCase()) && kw.length >= 4) { score += 2; matched.add(t); }
    }
  }
  return { score, matched: [...matched] };
}

export function matchAuthorities(question: string, limit = 5): Scored<Authority>[] {
  const toks = tokens(question);
  if (!toks.length) return [];
  return AUTHORITIES
    .map((a) => {
      const { score, matched } = scoreAgainst(allSubjects(a.id, a.subjects), toks);
      // a light nudge from the authority's own name
      const n = scoreAgainst(a.name.toLowerCase().split(/\s+/), toks);
      return { item: a, score: score + n.score * 0.5, matched: [...new Set([...matched, ...n.matched])] };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function matchPublished(question: string, limit = 3): Scored<PublishedRecord>[] {
  const toks = tokens(question);
  if (!toks.length) return [];
  return PUBLISHED
    .map((p) => {
      const { score, matched } = scoreAgainst(allKeywords(p.id, p.keywords), toks);
      return { item: p, score, matched };
    })
    // Two independent signals, not one generic word. Stops "pending" or "rejected"
    // dragging in an unrelated record.
    .filter((r) => r.score >= 10 && r.matched.length >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Released RTI replies, matched the same way.
 *
 * Once information has been given out under the Act it is public, so the next
 * person to ask the same question should find the answer rather than pay ₹10
 * and wait thirty days for it a second time. The live portal keeps no archive
 * of replies, which is why every request there starts from zero.
 */
export function matchReplies(question: string, limit = 3): Scored<ReleasedReply>[] {
  const toks = tokens(question);
  if (!toks.length) return [];
  return REPLIES
    .map((r) => {
      const { score, matched } = scoreAgainst(r.keywords, toks);
      return { item: r, score, matched };
    })
    .filter((r) => r.score >= 10 && r.matched.length >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Is the best match an out-of-scope (State) body? Drives the pre-payment stop. */
export function verdict(question: string) {
  const ranked = matchAuthorities(question, 5);
  const best = ranked[0];
  const bestCentral = ranked.find((r) => r.item.scope === "central");
  const bestState = ranked.find((r) => r.item.scope === "state");

  if (!best) return { kind: "unclear" as const, ranked };
  // A State match that clearly beats the best Central match means this portal cannot help.
  if (bestState && (!bestCentral || bestState.score > bestCentral.score * 1.15)) {
    return { kind: "out-of-scope" as const, state: bestState, ranked };
  }
  if (bestCentral) return { kind: "in-scope" as const, central: bestCentral, ranked };
  return { kind: "unclear" as const, ranked };
}
