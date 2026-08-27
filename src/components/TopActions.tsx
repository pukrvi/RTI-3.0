"use client";

import { usePathname } from "next/navigation";
import { setContrast, setTextSize, switchLanguage } from "@/app/[locale]/actions";
import type { Prefs, TextSize } from "@/lib/prefs";

/**
 * Language and the accessibility controls, top right, on one row.
 *
 * The live portal puts `A+ A A-` and a contrast toggle in a stray strip above
 * the masthead, and the language dropdown in the middle of the crest band. Same
 * three controls, one place, sized to be tapped.
 *
 * All of them are plain form submissions to server actions, so they work with
 * scripting off. The client hook only keeps "send me back to this page" current
 * as you move around: Next preserves a shared layout across client navigation
 * and does not re-render it.
 */


export interface Labels {
  language: string;
  languageGo: string;
  unavailable: string;
  textSize: string;
  smaller: string;
  normal: string;
  larger: string;
  status: string;
  sizeNames: Record<TextSize, string>;
  contrastOn: string;
  contrastOff: string;
}

export default function TopActions({
  locale,
  languages,
  prefs,
  labels,
}: {
  locale: string;
  languages: Array<{ code: string; native: string; english: string; available: boolean }>;
  prefs: Prefs;
  labels: Labels;
}) {
  const pathname = usePathname() || `/${locale}`;
  const hidden = (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={pathname} />
    </>
  );

  const live = languages.filter((l) => l.available);
  const rest = languages.filter((l) => !l.available);

  return (
    <div className="topbar-actions">
      <form className="hgroup" action={switchLanguage}>
        {hidden}
        <label className="visually-hidden" htmlFor="lang-select">
          {labels.language}
        </label>
        <select
          id="lang-select"
          name="code"
          defaultValue={locale}
          // Choosing a language is the whole action; there is nothing to confirm.
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        >
          {live.map((l) => (
            <option key={l.code} value={l.code} lang={l.code}>
              {l.native}
            </option>
          ))}
          <optgroup label={labels.unavailable}>
            {rest.map((l) => (
              <option key={l.code} value={l.code} lang={l.code} disabled>
                {l.native} — {l.english}
              </option>
            ))}
          </optgroup>
        </select>
        {/* Kept for the browser that never ran the script: pressing Enter in
            the select submits, and this gives the form an explicit control. */}
        <button type="submit" className="visually-hidden">
          {labels.languageGo}
        </button>
      </form>

      <div className="hgroup" role="group" aria-label={labels.textSize}>
        <form action={setTextSize}>
          {hidden}
          <input type="hidden" name="value" value="smaller" />
          <button type="submit" className="icon-btn" disabled={prefs.text === "xs"}>
            <span className="a" aria-hidden="true">
              A−
            </span>
            <span className="visually-hidden">{labels.smaller}</span>
          </button>
        </form>
        <form action={setTextSize}>
          {hidden}
          <input type="hidden" name="value" value="reset" />
          <button type="submit" className="icon-btn" disabled={prefs.text === "base"}>
            <span className="a" aria-hidden="true">
              A
            </span>
            <span className="visually-hidden">{labels.normal}</span>
          </button>
        </form>
        <form action={setTextSize}>
          {hidden}
          <input type="hidden" name="value" value="larger" />
          <button type="submit" className="icon-btn" disabled={prefs.text === "xl"}>
            <span className="a" aria-hidden="true">
              A+
            </span>
            <span className="visually-hidden">{labels.larger}</span>
          </button>
        </form>
        <span className="visually-hidden" aria-live="polite">
          {labels.status.replace("{size}", labels.sizeNames[prefs.text])}
        </span>
        <form action={setContrast}>
          {hidden}
          <input type="hidden" name="value" value={prefs.contrast === "high" ? "normal" : "high"} />
          <button type="submit" className="icon-btn" aria-pressed={prefs.contrast === "high"}>
            <span aria-hidden="true">◐</span>
            <span className="visually-hidden">
              {prefs.contrast === "high" ? labels.contrastOff : labels.contrastOn}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
