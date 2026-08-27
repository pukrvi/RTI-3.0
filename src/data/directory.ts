/**
 * The public-authority directory.
 *
 * This is the official list — 94 ministries, departments and constitutional
 * bodies, and the 2,487 public authorities under them — imported from a copy of
 * the portal's own "Public Authorities available in portal" page that was saved
 * by hand and supplied to this repository. Nothing here fetches it: rule 2 of
 * the project is that the live portal is never touched by this codebase. See
 * `scripts/import-authorities.mjs`.
 *
 * On the live portal these 2,581 entries are an alphabetical expand-and-collapse
 * accordion with no search box, no filter, and no indication of how many
 * authorities sit under a heading. That is the page a citizen is expected to use
 * to avoid the ₹10-and-returned failure.
 *
 * State bodies are deliberately absent, because they are absent from the portal:
 * it covers Central Government only. The router still recognises State subjects
 * — that is what the pre-payment stop is for — it simply never offers them as
 * somewhere to file.
 */
import {
  DIRECTORY_IMPORTED,
  IMPORTED_CHILDREN,
  IMPORTED_PARENTS,
} from "./directory.generated";
import { AUTHORITIES } from "./authorities";

export interface DirectoryEntry {
  name: string;
  children: string[];
  /** id in `authorities.ts`, when the router knows this body by subject. */
  routes?: string;
  /**
   * The name with its leading form of address removed. Sixty of the ninety-four
   * headings begin "Department of" or "Ministry of", so an A–Z built on the
   * first letter of the full name puts two thirds of the list under D and M and
   * is no use to anybody. This is what the index is built on.
   */
  sortKey: string;
}

const LEADERS = [
  "Ministry of the ",
  "Ministry of ",
  "Department of the ",
  "Department of ",
  "Office of the ",
  "Office of ",
  "The ",
];

function sortKeyFor(name: string): string {
  for (const leader of LEADERS) {
    if (name.toLowerCase().startsWith(leader.toLowerCase())) {
      return name.slice(leader.length).trim();
    }
  }
  return name;
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const ROUTABLE = new Map(AUTHORITIES.filter((a) => a.scope === "central").map((a) => [normalise(a.name), a.id]));

export const DIRECTORY: DirectoryEntry[] = DIRECTORY_IMPORTED.map((entry) => ({
  name: entry.name,
  children: entry.children,
  routes: ROUTABLE.get(normalise(entry.name)),
  sortKey: sortKeyFor(entry.name),
})).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

export const TOTAL_PARENTS = IMPORTED_PARENTS;
export const TOTAL_CHILDREN = IMPORTED_CHILDREN;
export const TOTAL_BODIES = IMPORTED_PARENTS + IMPORTED_CHILDREN;

/** Subject keywords for a heading the router knows, for search and display. */
export function subjectsFor(entry: DirectoryEntry): string[] {
  if (!entry.routes) return [];
  return AUTHORITIES.find((a) => a.id === entry.routes)?.subjects ?? [];
}
