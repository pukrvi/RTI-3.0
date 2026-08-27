/**
 * Import the official public-authority list into the directory.
 *
 * This codebase never fetches that page. Rule 2 of the project is that the live
 * government portal is not touched by anything here — no requests, no scraping.
 * A person opens it in a browser, saves the text, and drops it in `data-in/`.
 * That is what happened: `data-in/public-authorities.txt` is a saved copy,
 * supplied by hand.
 *
 *   node scripts/import-authorities.mjs [path]
 *
 * The saved text is indented: one tab for a ministry or department, three tabs
 * for a public authority under it. That is the whole format.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const INPUT = process.argv[2] ?? "data-in/public-authorities.txt";
const OUTPUT = "src/data/directory.generated.ts";

if (!existsSync(INPUT)) {
  console.error(`No ${INPUT}. Save the official list there first — see this file's header.`);
  process.exit(1);
}

const clean = (s) =>
  s
    .replace(/ /g, " ")   // the page is full of non-breaking spaces
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();

const entries = [];
for (const line of readFileSync(INPUT, "utf8").split("\n")) {
  if (!line.trim()) continue;
  // Count tabs only: a heading is "\t Name", a child is "\t\t\tName".
  const depth = line.length - line.replace(/^\t+/, "").length;
  const name = clean(line);
  if (!name || name.startsWith("Title:") || name.startsWith("URL:") || name.startsWith("*")) {
    continue;
  }
  if (depth === 1) entries.push({ name, children: [] });
  else if (depth >= 2 && entries.length) entries.at(-1).children.push(name);
}

if (!entries.length) {
  console.error("Parsed nothing — the saved file does not look like the official list.");
  process.exit(1);
}

const children = entries.reduce((n, e) => n + e.children.length, 0);

writeFileSync(
  OUTPUT,
  `/**
 * GENERATED — do not edit by hand.
 *
 * Imported by scripts/import-authorities.mjs from a locally saved copy of the
 * official "Public Authorities available in portal" list. Nothing in this
 * repository fetches that page; the copy was supplied by hand.
 *
 * ${entries.length} ministries and departments, ${children} public authorities under them.
 */
export interface ImportedEntry {
  name: string;
  children: string[];
}

export const DIRECTORY_IMPORTED: ImportedEntry[] = ${JSON.stringify(entries, null, 2)};

export const IMPORTED_PARENTS = ${entries.length};
export const IMPORTED_CHILDREN = ${children};
`,
);

console.log(
  `${entries.length} ministries/departments, ${children} authorities under them → ${OUTPUT}`,
);
