"use client";

import { useEffect, useState } from "react";

/**
 * The live portal offers "Print RTI Application" and "Print Status", and it is
 * right to: in this context a paper trail still has legal weight. Print styles
 * live in globals.css, so Ctrl-P works with scripting off.
 *
 * The button only appears once the component has mounted, so a citizen with
 * JavaScript disabled is never shown a control that cannot do anything.
 */
export default function PrintButton({ label }: { label: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      type="button"
      className="btn btn-quiet no-print"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
