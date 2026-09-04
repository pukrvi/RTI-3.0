"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";

/**
 * The authority finder.
 *
 * The live portal's version of this page is 2,581 bodies in an alphabetical
 * accordion with no search at all: the only way to find out what is inside a
 * heading is to open it, ninety-four times.
 *
 * Here the whole index is in the page, so filtering happens as you type with no
 * round trip — which is the point, on a connection where a round trip per
 * keystroke would be unusable. The index costs about 25 KB compressed, once,
 * on the one page whose entire purpose is search.
 *
 * With scripting off the same input is a plain GET form: press Enter and the
 * server filters instead. Nothing here is the only way to do the job.
 */
export interface FinderEntry {
  name: string;
  children: string[];
  subjects: string[];
}

export interface FinderLabels {
  searchLabel: string;
  placeholder: string;
  submit: string;
  headings: string;
  under: string;
  total: string;
  empty: string;
  covers: string;
  childCount: string;
  showAll: string;
  fileWith: string;
  noChildren: string;
}

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\p{M}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const PREVIEW = 20;

export default function AuthorityFinder({
  locale,
  entries,
  labels,
  initialQuery,
  totalBodies,
}: {
  locale: string;
  entries: FinderEntry[];
  labels: FinderLabels;
  initialQuery: string;
  totalBodies: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  // Keeps typing responsive while the list re-filters behind it.
  const deferred = useDeferredValue(query);

  const index = useMemo(
    () =>
      entries.map((entry) => ({
        entry,
        haystack: norm([entry.name, ...entry.subjects].join(" ")),
        childHay: entry.children.map(norm),
      })),
    [entries],
  );

  const results = useMemo(() => {
    const terms = norm(deferred).split(" ").filter(Boolean);
    if (!terms.length) {
      return index.map(({ entry }) => ({
        entry,
        children: entry.children,
        open: false,
        matchedInside: false,
      }));
    }
    const out = [];
    for (const { entry, haystack, childHay } of index) {
      const headingMatch = terms.every((t) => haystack.includes(t));
      const children = headingMatch
        ? entry.children
        : entry.children.filter((_, i) => terms.every((t) => childHay[i].includes(t)));
      if (headingMatch || children.length) {
        out.push({ entry, children, open: true, matchedInside: !headingMatch });
      }
    }
    // Heading matches first: they are what someone typing a ministry name wants.
    return out.sort((a, b) => Number(a.matchedInside) - Number(b.matchedInside));
  }, [index, deferred]);

  const shownChildren = results.reduce((n, r) => n + r.children.length, 0);
  const stale = query !== deferred;

  return (
    <>
      {/* One search box: the button sits inside it. Enter submits too, so the
          plain GET form still filters server-side with scripting off. */}
      <form className="card finder-search finder-single" action={`/${locale}/authorities`} role="search">
        <div className="field mb-0">
          <label htmlFor="q">{labels.searchLabel}</label>
          <div className="finder-searchbox">
            <input
              type="search"
              id="q"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.placeholder}
              autoComplete="off"
              lang={locale}
            />
            <button type="submit" className="btn">
              {labels.submit}
            </button>
          </div>
        </div>
      </form>

      <div aria-live="polite" aria-busy={stale} className="visually-hidden">
        <p className="mb-0">
          <strong>
            {fill(labels.headings, { n: results.length, total: entries.length })}
          </strong>
        </p>
        <p className="small muted">
          {fill(labels.under, { n: shownChildren })} ·{" "}
          {fill(labels.total, { total: totalBodies })}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="callout callout-warn">
          <p className="mb-0">{labels.empty}</p>
        </div>
      ) : (
        <div className="card" style={{ padding: "0.25rem 1rem" }}>
          {results.map(({ entry, children, open }) => {
            const capped = children.slice(0, PREVIEW);

            // A department with nothing under it is a row, not a disclosure.
            // Nothing to expand, so no expander and no trailing action —
            // a row of links down the right edge reads as noise, and the
            // first such row at the top of the list reads as a header.
            if (!entry.children.length) {
              return (
                <div className="dir-row" key={entry.name}>
                  <span className="nm" lang="en">
                    {entry.name}
                  </span>
                </div>
              );
            }

            return (
              <details className="dir-item" key={entry.name} open={open}>
                <summary>
                  <span className="nm" lang="en">
                    {entry.name}
                  </span>
                  <span className="smaller muted nowrap">
                    {fill(labels.childCount, { n: children.length })}
                  </span>
                </summary>
                <div className="dir-body">
                  {entry.subjects.length > 0 && (
                    <p className="small">
                      <span className="muted">{labels.covers}: </span>
                      {entry.subjects.slice(0, 8).join(" · ")}
                    </p>
                  )}
                  <ul className="dir-children">
                    {capped.map((child, i) => (
                      <li key={`${child}-${i}`} lang="en">
                        {child}
                      </li>
                    ))}
                  </ul>
                  {children.length > capped.length && (
                    <p className="small">
                      <Link
                        href={`/${locale}/authorities?dept=${encodeURIComponent(entry.name)}`}
                      >
                        {fill(labels.showAll, { n: children.length })}
                      </Link>
                    </p>
                  )}
                  <p className="small mb-0">
                    <Link href={`/${locale}/chat`}>{labels.fileWith}</Link>
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </>
  );
}
