/**
 * Per-locale names for public authorities.
 *
 * The base list lives in `src/data/authorities.ts` (English `name`, Hindi
 * `nameHi`, English `redirect` plus Hindi `labelHi`/`noteHi`). Each translated
 * language adds one `authority-names.<code>.ts` file in the same drop-in
 * pattern as `subjects.hi.ts`: keyed by authority id, carrying the translated
 * `name`, and for the ten `st-*` State entries the translated `redirectLabel`
 * and `redirectNote`. Anything missing falls back to English at render time,
 * so a half-filled file is safe to ship.
 */
import { AUTHORITY_NAMES_BN } from "./authority-names.bn";
import { AUTHORITY_NAMES_GU } from "./authority-names.gu";
import { AUTHORITY_NAMES_KN } from "./authority-names.kn";
import { AUTHORITY_NAMES_ML } from "./authority-names.ml";
import { AUTHORITY_NAMES_MR } from "./authority-names.mr";
import { AUTHORITY_NAMES_OR } from "./authority-names.or";
import { AUTHORITY_NAMES_TA } from "./authority-names.ta";
import { AUTHORITY_NAMES_TE } from "./authority-names.te";
import { AUTHORITY_NAMES_UR } from "./authority-names.ur";

export interface AuthorityLocaleText {
  name: string;
  redirectLabel?: string;
  redirectNote?: string;
}

export const AUTHORITY_NAMES: Record<string, Record<string, AuthorityLocaleText>> = {
  bn: AUTHORITY_NAMES_BN,
  gu: AUTHORITY_NAMES_GU,
  kn: AUTHORITY_NAMES_KN,
  ml: AUTHORITY_NAMES_ML,
  mr: AUTHORITY_NAMES_MR,
  or: AUTHORITY_NAMES_OR,
  ta: AUTHORITY_NAMES_TA,
  te: AUTHORITY_NAMES_TE,
  ur: AUTHORITY_NAMES_UR,
};
