/**
 * Locale registry.
 *
 * Adding an Eighth Schedule language is a two-line change: drop `ta.json` in beside
 * `en.json` with the same keys, and register it below. No component imports a
 * dictionary directly, and no component knows which languages exist — exactly the
 * drop-in principle used for the routing keyword packs in `src/data/subjects.ts`.
 */
import en from "./en.json";
import hi from "./hi.json";
import bn from "./bn.json";
import mr from "./mr.json";
import te from "./te.json";
import ta from "./ta.json";
import gu from "./gu.json";
import ur from "./ur.json";
import kn from "./kn.json";
import or from "./or.json";
import ml from "./ml.json";
import { EIGHTH_SCHEDULE, RTL_LANGUAGES } from "./languages";

export { EIGHTH_SCHEDULE, RTL_LANGUAGES } from "./languages";
export type { Language } from "./languages";

export const DICTIONARIES: Record<string, Record<string, string>> = {
  en,
  hi,
  bn,
  mr,
  // Home-page-first dictionaries: every key they carry is translated, anything
  // deeper into the journey falls back to English in getT until extended.
  te,
  ta,
  gu,
  ur,
  kn,
  or,
  ml,
};

/** Native names, shown in the language switcher in the language's own script. */
export const LOCALE_NAMES: Record<string, string> = Object.fromEntries(
  EIGHTH_SCHEDULE.map((l) => [l.code, l.native]),
);

/** Every Eighth Schedule language, with the two that are actually translated flagged. */
export function languageMenu(): Array<{
  code: string;
  native: string;
  english: string;
  available: boolean;
}> {
  return EIGHTH_SCHEDULE.map((l) => ({ ...l, available: l.code in DICTIONARIES }));
}

export function isRtl(locale: string): boolean {
  return RTL_LANGUAGES.has(locale);
}

/** BCP-47 tags for `Intl` and the `lang` attribute. */
export const LOCALE_TAGS: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  mr: "mr-IN",
  or: "or-IN",
  ta: "ta-IN",
  te: "te-IN",
  ur: "ur-IN",
};

export function localeTag(locale: string): string {
  return LOCALE_TAGS[locale] ?? `${locale}-IN`;
}

export const LOCALES = Object.keys(DICTIONARIES);
export const DEFAULT_LOCALE = "en";

export type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function isLocale(value: string | undefined): boolean {
  return !!value && LOCALES.includes(value);
}

export function normaliseLocale(value: string | undefined): string {
  return isLocale(value) ? (value as string) : DEFAULT_LOCALE;
}

/**
 * Returns a translate function for a locale. Falls back to English for a key a
 * newly added language has not translated yet, and to the key itself if nothing
 * has it — a missing string is then visible in the UI rather than silently blank.
 */
export function getT(locale: string): Translate {
  const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
  const fallback = DICTIONARIES[DEFAULT_LOCALE];
  return (key, vars) => {
    const raw = dict[key] ?? fallback[key] ?? key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (m, name) =>
      name in vars ? String(vars[name]) : m,
    );
  };
}

/** Date shown to a citizen: "22 August 2026" / "22 अगस्त 2026". */
export function formatDate(iso: string, locale: string): string {
  const tag = LOCALE_TAGS[locale] ?? "en-IN";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}
