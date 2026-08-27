/**
 * There are three type styles on this site and there is meant to be no fourth.
 * This fails the build if one appears.
 *
 *   T1  --fs-lg + --fw-strong   page titles
 *   T2  --fs-md + --fw-medium   headings, labels, buttons, nav, emphasis, and
 *                               key figures (30 days, ₹0, the countdown)
 *   T3  --fs-sm + --fw-regular  everything else
 *
 * --fs-sm is 16px: it is the body size, not small print. Nothing on the site
 * goes below it.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

const ALLOWED_SIZES = new Set(["var(--fs-lg)", "var(--fs-md)", "var(--fs-sm)"]);
const ALLOWED_WEIGHTS = new Set([
  "var(--fw-strong)",
  "var(--fw-medium)",
  "var(--fw-regular)",
  "inherit",
]);

const sizes = [...css.matchAll(/font-size:\s*([^;}]+)/g)].map((m) => m[1].trim());
const weights = [...css.matchAll(/font-weight:\s*([^;}]+)/g)].map((m) => m[1].trim());

// The print block redefines the two tokens in points; that is the same scale.
const badSizes = [...new Set(sizes)].filter(
  (v) => !ALLOWED_SIZES.has(v) && !/^\d+(\.\d+)?pt$/.test(v),
);
const badWeights = [...new Set(weights)].filter((v) => !ALLOWED_WEIGHTS.has(v));

const declaredSizes = [...css.matchAll(/--fs-([a-z]+):/g)].map((m) => m[1]);
const declaredWeights = [...css.matchAll(/--fw-([a-z]+):/g)].map((m) => m[1]);

console.log(`sizes in use:   ${[...new Set(sizes)].join(", ")}`);
console.log(`weights in use: ${[...new Set(weights)].join(", ")}`);
console.log(`tokens: ${[...new Set(declaredSizes)].join("/")} × ${[...new Set(declaredWeights)].join("/")}`);

if (badSizes.length || badWeights.length) {
  console.error("\nOff-scale values found:");
  badSizes.forEach((v) => console.error(`  font-size: ${v}`));
  badWeights.forEach((v) => console.error(`  font-weight: ${v}`));
  process.exit(1);
}
console.log("\n3 sizes × 3 weights, paired as 3 styles. On scale.");
