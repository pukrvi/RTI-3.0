#!/usr/bin/env node
/**
 * Dictionary conformance check.
 *
 * Every locale dictionary must mirror en.json exactly: same keys, same order,
 * same {placeholders}, empty only where English is empty. Placeholders are the
 * silent breaker — a dropped {date} renders a literal in the UI and a renamed
 * one renders nothing at all.
 *
 * Usage: node scripts/check-i18n.mjs [locale ...]   (default: every json beside en.json)
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "i18n");
const en = JSON.parse(readFileSync(join(dir, "en.json"), "utf8"));
const enKeys = Object.keys(en);
const placeholders = (s) => (s.match(/\{\w+\}/g) ?? []).slice().sort().join(",");

const wanted = process.argv.slice(2);
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".json") && f !== "en.json")
  .map((f) => f.replace(/\.json$/, ""))
  .filter((l) => wanted.length === 0 || wanted.includes(l))
  .sort();

let failures = 0;
for (const locale of files) {
  const dict = JSON.parse(readFileSync(join(dir, `${locale}.json`), "utf8"));
  const keys = Object.keys(dict);
  const problems = [];

  // A locale may be a deliberate partial translation (home page first, rest falls
  // back to English in getT). Partial = every key it does have is in en.json
  // order and it never invents a key.
  const missing = enKeys.filter((k) => !(k in dict));
  const extra = keys.filter((k) => !(k in en));
  if (extra.length) problems.push(`extra ${extra.length} keys: ${extra.slice(0, 8).join(", ")}${extra.length > 8 ? "…" : ""}`);

  let lastSeen = -1;
  for (const k of keys) {
    const at = enKeys.indexOf(k);
    if (at !== -1 && at < lastSeen) {
      problems.push("keys out of en.json order (cosmetic, but keeps diffs readable)");
      break;
    }
    lastSeen = Math.max(lastSeen, at);
  }

  const ph = [];
  const empty = [];
  for (const k of enKeys) {
    if (!(k in dict)) continue;
    if (placeholders(en[k]) !== placeholders(dict[k])) ph.push(k);
    if ((en[k] === "") !== (dict[k] === "")) empty.push(k);
  }
  if (ph.length) problems.push(`placeholder mismatch: ${ph.slice(0, 10).join(", ")}`);
  if (empty.length) problems.push(`emptiness mismatch: ${empty.slice(0, 10).join(", ")}`);

  if (problems.length) {
    failures++;
    console.log(`FAIL ${locale}.json`);
    for (const p of problems) console.log(`     - ${p}`);
  } else {
    const note = missing.length ? ` — partial, ${keys.length}/${enKeys.length} keys, rest falls back to en` : "";
    console.log(`ok   ${locale}.json (${keys.length} keys)${note}`);
  }
}
process.exit(failures ? 1 : 0);
