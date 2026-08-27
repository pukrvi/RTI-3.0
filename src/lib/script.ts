/**
 * Which writing systems the citizen actually used.
 *
 * Shown back to them on the preview screen as a plain statement that their script
 * was accepted unchanged. The live portal restricts the request body to
 * `A-Z a-z 0-9` and a handful of punctuation marks, which excludes every Indian
 * script — including Hindi, in which the portal offers its own interface.
 *
 * Nothing here validates or rejects. It only observes.
 */

/** i18n key suffix → detector. Names live in the dictionaries, not here. */
const DETECTORS: Array<[string, RegExp]> = [
  ["devanagari", /\p{Script=Devanagari}/u],
  ["bengali", /\p{Script=Bengali}/u],
  ["tamil", /\p{Script=Tamil}/u],
  ["telugu", /\p{Script=Telugu}/u],
  ["kannada", /\p{Script=Kannada}/u],
  ["malayalam", /\p{Script=Malayalam}/u],
  ["gujarati", /\p{Script=Gujarati}/u],
  ["gurmukhi", /\p{Script=Gurmukhi}/u],
  ["oriya", /\p{Script=Oriya}/u],
  ["arabic", /\p{Script=Arabic}/u],
  ["latin", /\p{Script=Latin}/u],
];

/** i18n keys for every script present in the text, most distinctive first. */
export function detectScripts(text: string): string[] {
  return DETECTORS.filter(([, re]) => re.test(text)).map(([name]) => `script.${name}`);
}

/** True when the text contains anything the live portal's allowlist would reject. */
export function hasNonLatinScript(text: string): boolean {
  return DETECTORS.some(([name, re]) => name !== "latin" && re.test(text));
}
