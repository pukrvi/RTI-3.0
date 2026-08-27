/**
 * Display preferences, held in one cookie and applied on the server.
 *
 * GIGW asks government sites to offer text resizing and a high-contrast mode.
 * Almost every implementation does it in JavaScript, which means the citizen who
 * most needs larger text — an old phone, a slow connection, a script blocker —
 * is the one who does not get it. Here the controls are plain form buttons, the
 * preference is a cookie, and the server stamps the setting onto <html>. It
 * works with scripting off and survives every navigation.
 */
import { cookies } from "next/headers";

export const PREFS_COOKIE = "rti_prefs";

export type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
export type Contrast = "normal" | "high";

export interface Prefs {
  text: TextSize;
  contrast: Contrast;
}

export const DEFAULT_PREFS: Prefs = {
  text: "base",
  contrast: "normal",
};

const TEXT_SIZES: TextSize[] = ["xs", "sm", "base", "lg", "xl"];

export function parsePrefs(raw: string | undefined): Prefs {
  if (!raw) return DEFAULT_PREFS;
  const parts = Object.fromEntries(
    raw.split(";").map((p) => p.split("=").map((s) => s.trim())),
  );
  return {
    text: TEXT_SIZES.includes(parts.t as TextSize) ? (parts.t as TextSize) : "base",
    contrast: parts.c === "high" ? "high" : "normal",
  };
}

export function serialisePrefs(prefs: Prefs): string {
  return `t=${prefs.text};c=${prefs.contrast}`;
}

export async function readPrefs(): Promise<Prefs> {
  return parsePrefs((await cookies()).get(PREFS_COOKIE)?.value);
}

export async function writePrefs(prefs: Prefs): Promise<void> {
  (await cookies()).set(PREFS_COOKIE, serialisePrefs(prefs), {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
    httpOnly: false,
  });
}
