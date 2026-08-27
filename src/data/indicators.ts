/**
 * SYNTHETIC service indicators.
 *
 * ⚠ Every figure here is INVENTED for this prototype. The live portal publishes
 * no dashboard of this kind, and we have no usage data — asking for it is one of
 * the open questions in the audit. The numbers are plausible in shape and wrong
 * in fact, and the interface says so wherever they appear.
 *
 * They are here because a public service should say how it is doing. Both
 * benchmark portals publish something like this; the RTI portal publishes
 * nothing, so a citizen cannot tell whether requests like theirs get answered.
 */
export interface Indicator {
  value: string;
  labelKey: string;
  asOfKey: string;
}

/** The date every figure is stated as of. */
export const INDICATORS_AS_OF = "2026-07-31";

export const INDICATORS: Indicator[] = [
  { value: "14,82,600", labelKey: "ind.filed", asOfKey: "ind.asOfYear" },
  { value: "81%", labelKey: "ind.onTime", asOfKey: "ind.asOfYear" },
  { value: "26 days", labelKey: "ind.median", asOfKey: "ind.asOfYear" },
  { value: "1,08,720", labelKey: "ind.appeals", asOfKey: "ind.asOfYear" },
];
