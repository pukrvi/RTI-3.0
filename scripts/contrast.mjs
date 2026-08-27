/**
 * WCAG 2.1 contrast check over every foreground/background pair the design
 * system actually uses. Reads the tokens straight out of globals.css so the
 * check cannot drift from the stylesheet.
 *
 *   node scripts/contrast.mjs
 *
 * AA needs 4.5:1 for body text, 3:1 for large text (>=24px, or >=18.66px bold)
 * and for the boundaries of user-interface components.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`no ${selector} block in globals.css`);
  return css.slice(start, css.indexOf("}", start));
}

const read = (selector) =>
  Object.fromEntries(
    [...block(selector).matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
      m[1],
      m[2],
    ]),
  );

const base = read(":root");
// High contrast only overrides tokens, so it inherits anything it does not name.
const high = { ...base, ...read('html[data-contrast="high"]') };

const srgb = (hex) =>
  [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

const lum = (hex) => {
  const [r, g, b] = srgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** [foreground, background, minimum, where it is used] */
const PAIRS = [
  ["ink", "surface", 4.5, "body text on a card"],
  ["ink", "bg", 4.5, "body text on the page background"],
  ["ink", "surface-2", 4.5, "letter preview, token chips"],
  ["ink", "brand-soft", 4.5, "text inside an info callout"],
  ["ink-muted", "surface", 4.5, "hints and secondary text"],
  ["ink-muted", "surface-2", 4.5, "plain badge, choice meta"],
  ["ink-muted", "bg", 4.5, "secondary text on the page background"],
  ["ink-muted", "brand-soft", 4.5, "meta line inside a selected choice"],
  ["ink-soft", "surface", 4.5, "smallest meta text"],
  ["brand-dark", "surface-2", 4.5, "tile title on a tinted panel"],
  ["brand", "surface", 4.5, "links"],
  ["brand", "surface-2", 4.5, "links on tinted panels"],
  ["brand-dark", "surface", 4.5, "secondary button label"],
  ["brand-dark", "brand-soft", 4.5, "secondary button hover, info badge"],
  ["brand", "brand-soft", 4.5, "wordmark glyph"],
  ["ink-invert", "brand", 4.5, "primary button label"],
  ["ink-invert", "brand-dark", 4.5, "primary button hover"],
  ["ink-invert", "brand-pill", 4.5, "current and hovered navigation item"],
  ["ink-invert", "brand-dark", 4.5, "the wizard's opening screen"],
  ["brand-dark", "brand-soft", 4.5, "the Begin button"],
  ["ink-invert", "ink", 4.5, "footer and skip link"],
  ["ink-invert-muted", "ink", 4.5, "secondary text in the footer"],
  ["ink-invert", "mock-ink", 4.5, "persistent prototype banner"],
  ["ink-invert", "ok-ink", 4.5, "completed step number"],
  ["ok-ink", "ok-bg", 4.5, "success callout and badge"],
  ["ok-ink", "surface-2", 4.5, "completed step label"],
  ["warn-ink", "warn-bg", 4.5, "deadline warning callout and badge"],
  ["stop-ink", "stop-bg", 4.5, "out-of-scope stop callout and badge"],
  ["stop-ink", "surface", 4.5, "field error text, required marker"],
  ["mock-ink", "mock-bg", 4.5, "mock badges and callouts"],
  ["mock-ink", "surface", 4.5, "mock label on a white card"],
  // Non-text: component boundaries and meter fills need 3:1.
  ["line-strong", "surface", 3, "input border, quiet button border"],
  ["line-strong", "surface-2", 3, "input border on tinted panels"],
  ["brand", "surface", 3, "focused control border, meter fill"],
  ["ok-line", "surface", 3, "success border"],
  ["warn-line", "warn-bg", 3, "warning border and meter fill"],
  ["warn-line", "surface", 3, "warning meter fill on a card"],
  ["stop-line", "stop-bg", 3, "stop border"],
  ["stop-line", "surface", 3, "stop meter fill, error field border"],
  ["mock-line", "mock-bg", 3, "mock callout border"],
  ["brand-tint", "brand-soft", 1, "info-callout hairline (decorative, brand carries the edge)"],
  // The focus indicator is a dark outline wrapped in a bright halo. On a light
  // background the outline carries the contrast; on a dark control the halo does.
  // Both rings always contrast with each other, so one of them is always visible.
  ["focus", "surface", 3, "focus outline on a light background"],
  ["focus", "bg", 3, "focus outline on the page background"],
  ["focus-halo", "brand", 3, "focus halo on a primary button"],
  ["focus-halo", "ink", 3, "focus halo on the footer and skip link"],
  ["focus-halo", "mock-ink", 3, "focus halo on the prototype banner"],
  ["focus", "focus-halo", 3, "the two rings against each other"],
];

/**
 * High contrast replaces the two-ring focus indicator with a single offset ring,
 * because every surface in that theme is black and one colour is enough.
 */
const HIGH_ONLY = [["focus", "surface", 3, "focus ring on every surface"]];
/* The wizard's dark opening panel is repainted black in high contrast, so this
   pair only exists in the default theme. */
const DEFAULT_ONLY = [
  ["brand-tint", "brand-dark", 4.5, "the timing line on the opening screen"],
];
const SKIP_IN_HIGH = new Set(["focus-halo"]);

let failed = 0;

function check(tokens, [fg, bg, min, use], theme) {
  const hexFg = tokens[fg];
  const hexBg = tokens[bg];
  if (!hexFg || !hexBg) {
    failed++;
    return `MISSING  ${theme}  --${fg} on --${bg}`;
  }
  const r = ratio(hexFg, hexBg);
  const ok = r >= min;
  if (!ok) failed++;
  return `${ok ? "pass" : "FAIL"}  ${theme.padEnd(9)} ${r.toFixed(2).padStart(6)}:1  (min ${min})  --${fg} on --${bg}  — ${use}`;
}

const basePairs = [...PAIRS, ...DEFAULT_ONLY].map((pair) => check(base, pair, "default"));
const highPairs = [...PAIRS.filter(([fg]) => !SKIP_IN_HIGH.has(fg)), ...HIGH_ONLY].map(
  (pair) => check(high, pair, "contrast"),
);

const total = basePairs.length + highPairs.length;
console.log([...basePairs, "", ...highPairs].join("\n"));
console.log(
  `\n${total - failed}/${total} pairs pass across both themes. ${failed === 0 ? "WCAG 2.1 AA clean." : "FIX THE FAILURES ABOVE."}`,
);
process.exit(failed === 0 ? 0 : 1);
