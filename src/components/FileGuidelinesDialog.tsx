"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { renderRich } from "./ChatIntroDialog";

/**
 * Guidelines and Disclaimer, shown when the filing page loads — whichever flow
 * the citizen arrived from — and dismissible to the form underneath. A "read
 * the guidelines" trigger beside the heading reopens it.
 *
 * Once agreed, it stays dismissed for the rest of the tab session
 * (sessionStorage): otherwise every form round-trip — a validation error, a
 * trip to payment and back — would nag again. A fresh visit starts unagreed.
 *
 * Reuses the intro overlay/dialog styles; the content is server-translated
 * strings passed in, so this shell only decides visibility.
 */
export const GUIDELINES_EVENT = "rti:show-guidelines";

const SEEN_KEY = "rti-file-guidelines-seen";

export interface GuideSection {
  heading: string;
  items: string[];
}

export function GuidelinesTrigger({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="intro-trigger"
      onClick={() => window.dispatchEvent(new CustomEvent(GUIDELINES_EVENT))}
    >
      {label}
    </button>
  );
}

export default function FileGuidelinesDialog({
  title,
  sections,
  closeLabel,
}: {
  title: string;
  sections: GuideSection[];
  closeLabel: string;
}) {
  // Client-only, like the chat intro: server-rendered closed so the form stays
  // usable with scripting off, opened on mount when the script arrives —
  // unless this tab session already agreed, so post-submit round-trips and
  // reloads never nag twice.
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: the dialog simply shows again next visit */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(GUIDELINES_EVENT, show);
    return () => window.removeEventListener(GUIDELINES_EVENT, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Focus lands on the dialog itself — at the top — so the guidelines open
    // on the first line and the citizen scrolls down to the confirm button.
    // Focusing the confirm button instead (as before) pulled the scroll
    // container down to it, which read as the dialog skipping its own text.
    dialogRef.current?.scrollTo(0, 0);
    dialogRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="intro-overlay" onClick={dismiss}>
      <div
        className="intro-dialog guide-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 id="guide-title" className="guide-title">{title}</h1>
        {sections.map((section) => (
          <section key={section.heading} className="guide-sec">
            <h3>{section.heading}</h3>
            <ul className="list-tight guide-list">
              {section.items.map((item, i) => (
                <li key={i}>{renderRich(item, `${section.heading}-${i}`)}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="intro-actions">
          <button
            type="button"
            className="btn"
            onClick={dismiss}
          >
            {closeLabel}
          </button>
        </p>
      </div>
    </div>
  );
}
