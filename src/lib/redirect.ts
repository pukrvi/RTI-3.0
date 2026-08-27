/**
 * Where a form is allowed to send the citizen back to.
 *
 * The preference forms carry a `next` field so that changing text size returns
 * you to the page you were reading. That field is attacker-controllable, so it
 * has to be treated as such: a browser normalises backslashes to forward
 * slashes in a URL, which makes `/\evil.example` a scheme-relative link to
 * another site. Anything that is not plainly a path on this site is discarded.
 */
export function safeNext(value: string, locale: string): string {
  const fallback = `/${locale}`;
  if (!value.startsWith("/")) return fallback;
  // `//host`, `/\host` and `/\/host` all leave this site once normalised.
  if (/^\/[/\\]/.test(value)) return fallback;
  if (value.includes("\\")) return fallback;
  return value;
}

/** A demo clock offset, in days. Bounded so no arithmetic downstream can blow up. */
export function safeOffset(value: string, max = 365): number {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, -max), max);
}
