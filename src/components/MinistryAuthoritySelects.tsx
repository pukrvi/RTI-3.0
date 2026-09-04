"use client";

import { useState } from "react";

/**
 * The two filing dropdowns: apex ministry/department first, then the public
 * authority under it — the apex body itself first, then its listed
 * authorities.
 *
 * Server-rendered with the current draft's values, so the form is complete
 * with scripting off. With scripting on, changing the ministry swaps the
 * second list in place. If the two ever disagree on submit (a no-JS ministry
 * change leaves the old authority list on screen), the server action
 * re-derives the parent from the authority name, so nothing is lost.
 */
export interface MinistryEntry {
  name: string;
  children: string[];
}

export default function MinistryAuthoritySelects({
  entries,
  initialMinistry,
  initialAuthority,
  ministryLabel,
  ministryHint,
  authorityLabel,
  authorityHint,
  ministryError,
  authorityError,
}: {
  entries: MinistryEntry[];
  initialMinistry: string;
  initialAuthority: string;
  ministryLabel: string;
  ministryHint: string;
  authorityLabel: string;
  authorityHint: string;
  ministryError?: string;
  authorityError?: string;
}) {
  const [ministry, setMinistry] = useState(initialMinistry);
  const active =
    entries.find((e) => e.name === ministry) ??
    entries.find((e) => e.name === initialMinistry);

  return (
    <>
      <div className={`field ${ministryError ? "field-error" : ""}`}>
        <label htmlFor="ministry-select">{ministryLabel}</label>
        <span className="hint" id="ministry-select-hint">
          {ministryHint}
        </span>
        <select
          id="ministry-select"
          name="ministry"
          value={ministry}
          onChange={(e) => setMinistry(e.target.value)}
          aria-describedby={`ministry-select-hint${ministryError ? " ministry-select-error" : ""}`}
          aria-invalid={Boolean(ministryError) || undefined}
          required
        >
          <option value="" disabled>
            —
          </option>
          {entries.map((e) => (
            <option key={e.name} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
        {ministryError && (
          <p className="error-text" id="ministry-select-error">
            {ministryError}
          </p>
        )}
      </div>

      <div className={`field ${authorityError ? "field-error" : ""}`}>
        <label htmlFor="authority-select">{authorityLabel}</label>
        <span className="hint" id="authority-select-hint">
          {authorityHint}
        </span>
        <select
          id="authority-select"
          name="authorityText"
          // Re-mount when the ministry changes: the option list is replaced
          // and any stale choice is dropped rather than silently filed.
          key={active?.name ?? ""}
          defaultValue={
            active && initialAuthority && (active.name === initialAuthority || active.children.includes(initialAuthority))
              ? initialAuthority
              : ""
          }
          aria-describedby={`authority-select-hint${authorityError ? " authority-select-error" : ""}`}
          aria-invalid={Boolean(authorityError) || undefined}
          required
          disabled={!active}
        >
          <option value="" disabled>
            —
          </option>
          {active && (
            <>
              <option value={active.name}>{active.name}</option>
              {active.children.map((child) => (
                <option key={child} value={child}>
                  {child}
                </option>
              ))}
            </>
          )}
        </select>
        {authorityError && (
          <p className="error-text" id="authority-select-error">
            {authorityError}
          </p>
        )}
      </div>
    </>
  );
}
