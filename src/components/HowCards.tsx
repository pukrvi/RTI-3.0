"use client";

import { useState } from "react";

/**
 * The three-step explainer on the homepage.
 *
 * Opening any card opens all three, so the whole procedure reads as one
 * continuous answer rather than three boxes to click through. One shared
 * `expanded` state drives every card; a card's own toggle propagates to the
 * others.
 *
 * With JavaScript disabled the cards fall back to native <details>
 * behaviour — each opens on its own — so the content is never unreachable.
 */
export default function HowCards({
  items,
}: {
  items: { title: string; bodies: string[] }[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="how-grid">
      {items.map((item, i) => (
        <details
          className="how"
          key={item.title}
          open={expanded}
          onToggle={(e) => {
            const open = (e.currentTarget as HTMLDetailsElement).open;
            setExpanded((prev) => (open === prev ? prev : open));
          }}
        >
          <summary>
            <span className="n" aria-hidden="true">
              {i + 1}
            </span>
            <span className="t">{item.title}</span>
          </summary>
          <div className="body">
            {item.bodies.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
