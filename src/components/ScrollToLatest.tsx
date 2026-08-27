"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement, nothing more: open the conversation on the latest
 * turn instead of the oldest. Renders no markup and holds no state, so with
 * scripting switched off the transcript simply starts at the top and every
 * control still works. `turn` changes whenever a new message arrives, which
 * re-runs the scroll after a server action re-renders the thread.
 */
export default function ScrollToLatest({ turn }: { turn: number }) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [turn]);
  return null;
}
