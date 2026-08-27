/**
 * Mock registration numbers.
 *
 * Shape taken from the portal's own user manual: `AAAAA/B/C/DD/EEEEE` — authority
 * code, R for request or A for appeal, E for an online receipt, two-digit year,
 * five-digit serial. Getting the shape right matters because a citizen has to
 * transcribe this string, and because it is the only handle they ever have on
 * their case.
 *
 * These numbers are generated locally and mean nothing outside this prototype.
 * On the live portal the number does not exist until payment has been reconciled,
 * 24 to 48 working hours later — the citizen holds a bank debit and nothing else
 * in the meantime. Every screen here that shows one says it is a mock.
 */

/** Deterministic 5-digit serial, so the same case always shows the same number. */
function serial(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return String((h >>> 0) % 100000).padStart(5, "0");
}

function authoritySegment(code: string): string {
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, 5).padEnd(5, "X");
}

export type RefKind = "R" | "A";

export function makeRef(
  authorityCode: string,
  kind: RefKind,
  isoDate: string,
  seed: string,
): string {
  const yy = new Date(isoDate).getUTCFullYear().toString().slice(-2);
  return [
    authoritySegment(authorityCode),
    kind,
    "E",
    yy,
    serial(`${seed}:${kind}`),
  ].join("/");
}
