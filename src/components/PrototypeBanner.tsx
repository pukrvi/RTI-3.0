"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * One line, at the very top of every page, closeable.
 *
 * Closing it is deliberately not durable: it hides the strip for the page you
 * are on, and it comes back on the next load and on the homepage. A disclosure
 * that a visitor can switch off permanently on their first click is not really
 * a disclosure, and this one has to hold — the closer the prototype gets to
 * looking like a real government service, the more work that line does.
 *
 * The full disclosure is in the footer of every page and on /about regardless,
 * and neither can be dismissed at all.
 */
export default function PrototypeBanner({
  locale,
  tag,
  text,
  moreLabel,
  closeLabel,
}: {
  locale: string;
  tag: string;
  text: string;
  moreLabel: string;
  closeLabel: string;
}) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div className="proto-line">
      <div className="page">
        <p>
          <b>{tag}</b>
          {text} <Link href={`/${locale}/about`}>{moreLabel}</Link>
        </p>
        <button
          type="button"
          className="proto-close"
          onClick={() => setClosed(true)}
        >
          <span aria-hidden="true">✕</span>
          <span className="visually-hidden">{closeLabel}</span>
        </button>
      </div>
    </div>
  );
}
