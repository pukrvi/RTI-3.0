"use client";

import { useMemo, useState, useDeferredValue } from "react";

/**
 * One archive, two sources.
 *
 * Material a public authority published of its own accord, and material it
 * released because somebody asked — from the citizen's side there is no
 * difference. It is either already answered or it is not, and the live portal
 * indexes neither.
 *
 * Filtering happens as you type. Without JavaScript the same input is a GET
 * form and the server filters instead.
 */
export type ArchiveKind = "disclosure" | "reply";

export interface ArchiveItem {
  id: string;
  kind: ArchiveKind;
  title: string;
  /** Type of document, or who asked and when. */
  meta: string;
  body: string;
  authority: string;
  /** Released replies carry an outcome; disclosures do not. */
  outcome?: { label: string; tone: "ok" | "warn" | "stop" };
  haystack: string;
}

export interface ArchiveLabels {
  searchLabel: string;
  placeholder: string;
  submit: string;
  all: string;
  disclosures: string;
  replies: string;
  count: string;
  empty: string;
}

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

const norm = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s]/gu, " ").replace(/\s+/g, " ").trim();

export default function ArchiveFinder({
  locale,
  items,
  labels,
  initialQuery,
  initialType,
}: {
  locale: string;
  items: ArchiveItem[];
  labels: ArchiveLabels;
  initialQuery: string;
  initialType: "all" | ArchiveKind;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<"all" | ArchiveKind>(initialType);
  const deferred = useDeferredValue(query);

  const results = useMemo(() => {
    const terms = norm(deferred).split(" ").filter(Boolean);
    return items.filter((item) => {
      if (type !== "all" && item.kind !== type) return false;
      if (!terms.length) return true;
      return terms.every((t) => item.haystack.includes(t));
    });
  }, [items, deferred, type]);

  const tabs: Array<{ id: "all" | ArchiveKind; label: string }> = [
    { id: "all", label: labels.all },
    { id: "disclosure", label: labels.disclosures },
    { id: "reply", label: labels.replies },
  ];

  return (
    <>
      <form className="card finder-search" action={`/${locale}/published`} role="search">
        <div className="field mb-0">
          <label htmlFor="q">{labels.searchLabel}</label>
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
        </div>
        <button type="submit" className="visually-hidden">
          {labels.submit}
        </button>
      </form>

      <div className="tabs" role="group" aria-label={labels.searchLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="tab"
            aria-pressed={type === tab.id}
            onClick={() => setType(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="muted">
        {fill(labels.count, { n: results.length, total: items.length })}
      </p>

      {results.length === 0 ? (
        <div className="callout callout-warn">
          <p className="mb-0">{labels.empty}</p>
        </div>
      ) : (
        <ul className="result-list">
          {results.map((item) => (
            <li className="card arch-item" key={item.id}>
              <div className="card-head">
                <h3 className="mb-0">{item.title}</h3>
                {item.outcome && (
                  <span className={`badge badge-${item.outcome.tone}`}>
                    {item.outcome.label}
                  </span>
                )}
              </div>
              <p className="muted">{item.meta}</p>
              <p>{item.body}</p>
              <p className="muted mb-0">{item.authority}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
