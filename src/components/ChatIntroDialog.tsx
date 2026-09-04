"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The old /ask intro page, as a first-visit pop-up over the chat.
 *
 * Server-rendered chat passes the already-translated strings in; this client
 * shell only decides whether to show them. Seen state lives in localStorage
 * (`rti-chat-intro-seen`), so returning visitors land straight in the
 * conversation. `?intro=1` forces it open again, for demos and tests.
 *
 * Bold comes from `**markers**` inside the dictionary strings themselves
 * (see `wiz.p1`–`wiz.p3` in `src/i18n/en.json`): translators move the markers
 * with the words, and a language without markers simply renders unbolded.
 * To reword what is emphasised, move the `**` in the JSON — no code change.
 */

const SEEN_KEY = "rti-chat-intro-seen";
export const INTRO_EVENT = "rti:show-intro";

/** `**bold**` → <strong>. Unmarked text passes through untouched. */
export function renderRich(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-${i}`}>{part}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    ),
  );
}

export function ChatIntroTrigger({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="intro-trigger"
      onClick={() => window.dispatchEvent(new CustomEvent(INTRO_EVENT))}
    >
      {label}
    </button>
  );
}

export default function ChatIntroDialog({
  title,
  paragraphs,
  time,
  beginLabel,
  closeLabel,
  forceOpen = false,
}: {
  title: string;
  paragraphs: string[];
  time: string;
  beginLabel: string;
  closeLabel: string;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const beginRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: the dialog simply shows again next visit */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    const forced =
      forceOpen ||
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("intro") === "1");
    if (forced || !seen) setOpen(true);
  }, [forceOpen]);

  // Reopen from the "What does this do?" trigger under the welcome text.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(INTRO_EVENT, show);
    return () => window.removeEventListener(INTRO_EVENT, show);
  }, []);

  // Close on Escape, and put focus on the primary action when it appears.
  useEffect(() => {
    if (!open) return;
    beginRef.current?.focus();
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
        className="intro-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="intro-x"
          onClick={dismiss}
          aria-label={closeLabel}
        >
          <span aria-hidden="true">×</span>
        </button>
        <h2 id="intro-title">{title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i}>{renderRich(p, `intro-p${i}`)}</p>
        ))}
        <p className="muted">{time}</p>
        <p className="intro-actions">
          <button type="button" className="btn" onClick={dismiss} ref={beginRef}>
            {beginLabel}
          </button>
        </p>
      </div>
    </div>
  );
}
