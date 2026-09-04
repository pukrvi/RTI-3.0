"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Paces the conversation the way a 2026 chat tool feels.
 *
 * The chat posts plain forms to server actions, so without this the reply
 * would land the instant the round trip finishes — no visible working, which
 * reads as canned. Instead every submit runs a fixed sequence before anything
 * is printed:
 *
 *   1. the citizen's own message appears immediately (optimistic);
 *   2. the trace works through its stages, STAGE_MS per stage;
 *   3. only then is the form released to the server, and the real answer
 *      replaces the trace when the new turn lands.
 *
 * One beat per stage, in order — the trace always precedes the answer, never
 * follows it, and a new turn always clears it.
 *
 * FUTURE LLM: when a real model is plugged in, replace the timed release
 * below with "hold the last stage until the first tokens arrive". Everything
 * else — optimistic message, ordered stages, trace-clears-on-answer — stays
 * exactly as is.
 */

const STAGE_MS = 2000;

export default function ChatLive({
  title,
  steps,
  turn,
  youLabel,
  locale,
}: {
  title: string;
  steps: string[];
  turn: number;
  youLabel: string;
  locale: string;
}) {
  const [theater, setTheater] = useState<{ question: string; stage: number } | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const releasedRef = useRef(false);
  const thinking = theater !== null;
  const stage = theater?.stage ?? 0;

  // A new turn means the round trip finished: drop the trace and re-arm for
  // the next question. (Server-action redirects reuse this host, so without
  // this the trace would linger below the fresh reply.)
  useEffect(() => {
    setTheater(null);
    formRef.current = null;
    releasedRef.current = false;
  }, [turn]);

  // Stage the submit: hold it, play the trace, then let it through.
  useEffect(() => {
    const onSubmit = (e: Event) => {
      const form = (e.target as HTMLElement | null)?.closest?.("form");
      if (!form || !form.hasAttribute("data-chat-form")) return;
      if (releasedRef.current) return; // the paced submission going through
      e.preventDefault();
      if (formRef.current) return; // a trace is already running
      const raw = new FormData(form).get("question");
      if (typeof raw !== "string" || !raw.trim()) return;
      formRef.current = form;
      setTheater({ question: raw.trim(), stage: 0 });
    };
    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, []);

  // One stage at a time; the last holds its full beat, then the question is
  // handed to the server and the answer replaces the trace on arrival.
  useEffect(() => {
    if (!theater) return;
    const id = setTimeout(() => {
      if (theater.stage >= steps.length - 1) {
        // Re-enable first: disabled controls are dropped from the submitted
        // FormData, which would arrive question-less and bounce to ?error=empty.
        document
          .querySelectorAll("[data-chat-form] button, [data-chat-form] textarea")
          .forEach((el) => {
            (el as HTMLButtonElement | HTMLTextAreaElement).disabled = false;
          });
        releasedRef.current = true;
        formRef.current?.requestSubmit();
      } else {
        setTheater({ ...theater, stage: theater.stage + 1 });
      }
    }, STAGE_MS);
    return () => clearTimeout(id);
  }, [theater, steps.length]);

  // While the trace runs: mark the thread as staged (welcome and stale
  // actions step aside in CSS), freeze the composer, and keep the latest
  // stage in view.
  useEffect(() => {
    if (!thinking) return;
    const chat = document.querySelector(".chat");
    chat?.classList.add("is-theater");
    document
      .querySelectorAll("[data-chat-form] button, [data-chat-form] textarea")
      .forEach((el) => {
        (el as HTMLButtonElement | HTMLTextAreaElement).disabled = true;
      });
    const el = document.querySelector<HTMLElement>(".chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
    return () => chat?.classList.remove("is-theater");
  }, [thinking, stage]);

  if (!theater) return null;

  return (
    <div className="theater">
      <div className="msg msg-user">
        <div className="bubble">
          <span className="visually-hidden">{youLabel}: </span>
          <p lang={locale}>{theater.question}</p>
        </div>
      </div>
      <div className="thinking" role="status" aria-live="polite">
        <div className="thinking-body">
          <p className="thinking-title">
            {title}
            <span className="dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </p>
          <ol className="thinking-steps">
            {steps.map((step, i) => (
              <li
                key={step}
                className={i < stage ? "is-done" : i === stage ? "is-live" : "is-todo"}
                {...(i === stage ? { "aria-current": "step" as const } : {})}
              >
                {step}
              </li>
            ))}
          </ol>
          <div className="thinking-skeleton" aria-hidden="true">
            <span />
            <span />
            <span className="short" />
          </div>
        </div>
      </div>
    </div>
  );
}
