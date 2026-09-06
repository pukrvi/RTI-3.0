"use client";

import { useEffect } from "react";

/**
 * Preset topics fill the composer instead of sending.
 *
 * Each topic card is a real submit form, so with scripting off it still asks
 * directly. When the script arrives, clicking one only copies its preset
 * question into the box and focuses it — the citizen edits first, then sends,
 * and the normal paced flow runs from there.
 */
export default function TopicFill() {
  useEffect(() => {
    const onClick = (e: Event) => {
      const button = (e.target as HTMLElement | null)?.closest?.(".topic-card");
      if (!button) return;
      const form = button.closest("form");
      const preset = form?.querySelector<HTMLInputElement>('input[name="question"]')?.value;
      const box = document.getElementById("question") as HTMLTextAreaElement | null;
      // No box to fill (should not happen): let the native submit go through.
      if (!form || !preset || !box) return;
      e.preventDefault();
      box.value = preset;
      box.dispatchEvent(new Event("input", { bubbles: true }));
      box.focus();
      try {
        box.setSelectionRange(box.value.length, box.value.length);
      } catch {
        /* older engines: focus alone is enough */
      }
      box.scrollIntoView({ block: "nearest" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
