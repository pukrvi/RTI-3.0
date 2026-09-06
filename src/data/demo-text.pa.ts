/**
 * Punjabi renderings of the demo account's filed content, keyed by seed id
 * from `src/data/demo-account.ts` (`demo-r1-nh48` through `demo-r8-dopt`).
 * Same drop-in pattern as the locale-text files: the seeds are filed once,
 * in English, and the viewing locale's pack overlays the filed text.
 * `appealText` appears only for `demo-r7-toll`, the one seed that appealed.
 * All records are invented for this prototype.
 *
 * Bodies stay in formal RTI-application register. Proper nouns (Delhi,
 * M/s Brightline Traders Pvt. Ltd., PAN AAFCB0000A) and the period ranges
 * are kept as filed; section references follow the established Punjabi legal
 * rendering used across the locale pack (ਆਰਟੀਆਈ ਐਕਟ 2005 ਦੀ ਧਾਰਾ 6(3)).
 */
import type { DemoSeedText } from "./demo-account";

const PERIOD_5Y = "1 April 2021 to 31 March 2026";
const PERIOD_FY = "1 April 2025 to 31 March 2026";

/** Point 3 of every seed body, verbatim across seeds as in the English. */
const TRANSFER =
  "3. ਜੇ ਇਸ ਜਾਣਕਾਰੀ ਦਾ ਕੋਈ ਹਿੱਸਾ ਕਿਸੇ ਹੋਰ ਲੋਕ ਅਥਾਰਟੀ ਕੋਲ ਹੈ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਉਸ ਹਿੱਸੇ ਨੂੰ ਆਰਟੀਆਈ ਐਕਟ 2005 ਦੀ ਧਾਰਾ 6(3) ਤਹਿਤ ਤਬਦੀਲ ਕਰੋ ਅਤੇ ਮੈਨੂੰ ਸੂਚਿਤ ਕਰੋ।";

const ELECTRONIC =
  "4. ਕਿਰਪਾ ਕਰਕੇ ਜਾਣਕਾਰੀ ਉੱਪਰ ਦਿੱਤੇ ਈਮੇਲ ਪਤੇ ’ਤੇ ਇਲੈਕਟ੍ਰਾਨਿਕ ਰੂਪ ਵਿੱਚ ਭੇਜੋ।";

export const DEMO_TEXT_PA: Record<string, DemoSeedText> = {
  "demo-r1-nh48": {
    question:
      "ਪਿਛਲੇ ਪੰਜ ਸਾਲਾਂ ਵਿੱਚ NH-48 ਦੇ Delhi–Jaipur ਹਿੱਸੇ ’ਤੇ ਸੜਕ ਨਿਰਮਾਣ ਦੇ ਠੇਕੇ ਕਿਨ੍ਹਾਂ ਫਰਮਾਂ ਨੂੰ ਮਿਲੇ, ਅਤੇ ਕਿਸ ਲਾਗਤ ’ਤੇ?",
    subject: "NH-48 ਦੇ Delhi–Jaipur ਹਿੱਸੇ ’ਤੇ ਦਿੱਤੇ ਗਏ ਸੜਕ ਠੇਕੇ, 2021–2026",
    body: [
      `1. ${PERIOD_5Y} ਦੀ ਮਿਆਦ ਵਿੱਚ NH-48 ਦੇ Delhi–Jaipur ਹਿੱਸੇ ਲਈ ਦਿੱਤੇ ਗਏ ਸਾਰੇ ਸੜਕ ਨਿਰਮਾਣ ਅਤੇ ਰੱਖ-ਰਖਾਅ ਠੇਕਿਆਂ ਦੀ ਸੂਚੀ, ਹਰ ਠੇਕੇ ਲਈ ਠੇਕੇਦਾਰ ਦਾ ਨਾਂ, ਹਿੱਸੇ ਦੀ ਲੰਬਾਈ ਅਤੇ ਮਨਜ਼ੂਰ ਲਾਗਤ ਸਮੇਤ।`,
      "2. ਉਪਰੋਕਤ ਹਰ ਠੇਕੇ ਲਈ ਦੇਣ ਦੀ ਮਿਤੀ, ਮੁਕੰਮਲ ਹੋਣ ਦੀ ਨਿਰਧਾਰਤ ਮਿਤੀ, ਅਤੇ ਮੁਕੰਮਲ ਹੋਣ ਦੀ ਅਸਲ ਮਿਤੀ ਜਾਂ ਮੌਜੂਦਾ ਭੌਤਿਕ ਪ੍ਰਗਤੀ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r2-railrefund": {
    question: "ਪਿਛਲੇ ਵਿੱਤੀ ਸਾਲ ਵਿੱਚ ਰੱਦ ਟਰੇਨਾਂ ਦੇ ਯਾਤਰੀਆਂ ਨੂੰ ਕਿੰਨੀ ਰਕਮ ਵਾਪਸ ਕੀਤੀ ਗਈ?",
    subject: "2025–26 ਵਿੱਚ ਰੱਦ ਟਰੇਨਾਂ ਲਈ ਅਦਾ ਕੀਤੇ ਗਏ ਰਿਫੰਡ",
    body: [
      `1. ${PERIOD_FY} ਦੀ ਮਿਆਦ ਵਿੱਚ ਰੱਦ ਟਰੇਨਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਅਤੇ ਯਾਤਰੀਆਂ ਨੂੰ ਵਾਪਸ ਕੀਤੀ ਗਈ ਕੁੱਲ ਰਕਮ, ਜ਼ੋਨ-ਵਾਰ।`,
      "2. ਇਸੇ ਮਿਆਦ ਵਿੱਚ ਈ-ਟਿਕਟਾਂ ਅਤੇ ਕਾਊਂਟਰ ਟਿਕਟਾਂ ਦੇ ਰਿਫੰਡ ਜਮ੍ਹਾਂ ਹੋਣ ਵਿੱਚ ਲੱਗੇ ਔਸਤ ਦਿਨ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r3-pmkisan": {
    question:
      "2024–25 ਅਤੇ 2025–26 ਵਿੱਚ Maharashtra ਦੇ Nashik ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਕਿੰਨੇ PM-KISAN ਲਾਭਪਾਤਰੀ ਹਟਾਏ ਗਏ, ਅਤੇ ਕਿਸ ਆਧਾਰ ’ਤੇ?",
    subject: "Maharashtra ਦੇ Nashik ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਹਟਾਏ ਗਏ PM-KISAN ਲਾਭਪਾਤਰੀ, 2024–2026",
    body: [
      "1. 1 April 2024 to 31 March 2026 ਦੀ ਮਿਆਦ ਵਿੱਚ ਹਰ ਸਾਲ Maharashtra ਦੇ Nashik ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਲਾਭਪਾਤਰੀ ਸੂਚੀ ਵਿੱਚੋਂ ਹਟਾਏ ਗਏ PM-KISAN ਲਾਭਪਾਤਰੀਆਂ ਦੀ ਗਿਣਤੀ, ਹਰ ਮਾਮਲੇ ਵਿੱਚ ਹਟਾਉਣ ਦਾ ਦਰਜ ਆਧਾਰ ਸਮੇਤ (ਆਮਦਨ-ਕਰਦਾਤਾ, ਜ਼ਮੀਨ ਰਿਕਾਰਡ ਵਿੱਚ ਅੰਤਰ, ਦੋਹਰੀ ਆਧਾਰ ਸੀਡਿੰਗ ਜਾਂ ਹੋਰ)।",
      "2. ਇਸੇ ਮਿਆਦ ਵਿੱਚ ਇਨ੍ਹਾਂ ਹਟਾਉਣਾਂ ਕਾਰਨ ਰੋਕੀਆਂ ਗਈਆਂ ਕਿਸ਼ਤਾਂ ਦੀ ਗਿਣਤੀ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r4-epfo": {
    question:
      "Delhi ਦੇ EPFO ਖੇਤਰੀ ਦਫ਼ਤਰ ਵਿੱਚ Jan–Mar 2026 ਵਿੱਚ PF ਕਢਵਾਉਣ ਦੇ ਦਾਅਵਿਆਂ ਦੇ ਨਿਪਟਾਰੇ ਵਿੱਚ ਔਸਤ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਾ?",
    subject: "Delhi ਦੇ EPFO ਖੇਤਰੀ ਦਫ਼ਤਰ ਵਿੱਚ PF ਕਢਵਾਉਣ ਦੇ ਦਾਅਵਿਆਂ ਦੇ ਨਿਪਟਾਰੇ ਵਿੱਚ ਲੱਗਾ ਸਮਾਂ, Jan–Mar 2026",
    body: [
      "1. 1 January 2026 to 31 March 2026 ਦੀ ਤਿਮਾਹੀ ਵਿੱਚ Delhi ਦੇ EPFO ਖੇਤਰੀ ਦਫ਼ਤਰ ਵਿੱਚ ਆਨਲਾਈਨ PF ਕਢਵਾਉਣ ਦੇ ਦਾਅਵਿਆਂ ਅਤੇ ਕਾਗਜ਼ੀ PF ਕਢਵਾਉਣ ਦੇ ਦਾਅਵਿਆਂ ਦੇ ਨਿਪਟਾਰੇ ਵਿੱਚ ਲੱਗੇ ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਦੀ ਮੱਧਿਕਾ।",
      "2. ਇਸੇ ਦਫ਼ਤਰ ਵਿੱਚ ਇਸੇ ਤਿਮਾਹੀ ਵਿੱਚ ਰੱਦ ਕੀਤੇ ਗਏ PF ਕਢਵਾਉਣ ਦੇ ਦਾਅਵਿਆਂ ਦੀ ਗਿਣਤੀ, ਰੱਦ ਕਰਨ ਦੇ ਤਿੰਨ ਸਭ ਤੋਂ ਆਮ ਆਧਾਰਾਂ ਸਮੇਤ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r5-mgnrega": {
    question:
      "31 March 2026 ਤੱਕ Bihar ਦੇ Gaya ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਮਨਰੇਗਾ ਦੀ ਕਿੰਨੀ ਮਜ਼ਦੂਰੀ ਬਕਾਇਆ ਸੀ, ਅਤੇ 2025–26 ਵਿੱਚ ਕਿੰਨਾ ਦੇਰੀ-ਮੁਆਵਜ਼ਾ ਦਿੱਤਾ ਗਿਆ?",
    subject: "Bihar ਦੇ Gaya ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਬਕਾਇਆ ਮਨਰੇਗਾ ਮਜ਼ਦੂਰੀ ਅਤੇ ਦੇਰੀ-ਮੁਆਵਜ਼ਾ",
    body: [
      "1. 31 March 2026 ਤੱਕ Bihar ਦੇ Gaya ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਬਕਾਇਆ ਮਨਰੇਗਾ ਮਜ਼ਦੂਰੀ ਦੀ ਕੁੱਲ ਰਕਮ, ਪ੍ਰਭਾਵਿਤ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ਸਮੇਤ।",
      "2. ਇਸੇ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ 2025–26 ਵਿੱਚ ਜਿਨ੍ਹਾਂ ਮਜ਼ਦੂਰਾਂ ਦੀ ਮਜ਼ਦੂਰੀ 15 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਦੇਰੀ ਨਾਲ ਦਿੱਤੀ ਗਈ, ਉਨ੍ਹਾਂ ਦਾ ਮਸਟਰ-ਰੋਲ-ਵਾਰ ਵੇਰਵਾ, ਹਰ ਮਾਮਲੇ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਦੇਰੀ-ਮੁਆਵਜ਼ੇ ਸਮੇਤ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r6-cbdt": {
    question: "ਪਿਛਲੇ ਪੰਜ ਸਾਲਾਂ ਵਿੱਚ ਇੱਕ ਨਾਂ-ਲਿਖਤ ਨਿੱਜੀ ਫਰਮ ਦੇ ਆਮਦਨ-ਕਰ ਰਿਟਰਨ ਅਤੇ ਰਿਫੰਡ ਵੇਰਵੇ",
    subject: "M/s Brightline Traders Pvt. Ltd. ਦੇ ਆਮਦਨ-ਕਰ ਰਿਟਰਨ ਅਤੇ ਰਿਫੰਡ, 2021–2026",
    body: [
      `1. ${PERIOD_5Y} ਦੀ ਮਿਆਦ ਲਈ M/s Brightline Traders Pvt. Ltd. (PAN AAFCB0000A) ਵੱਲੋਂ ਦਾਖ਼ਲ ਆਮਦਨ-ਕਰ ਰਿਟਰਨਾਂ ਦੀਆਂ ਪ੍ਰਮਾਣਿਤ ਨਕਲਾਂ।`,
      "2. ਇਸੇ ਮਿਆਦ ਵਿੱਚ ਉਕਤ ਫਰਮ ਨੂੰ ਜਾਰੀ ਸਾਰੇ ਆਮਦਨ-ਕਰ ਰਿਫੰਡਾਂ ਦੇ ਵੇਰਵੇ, ਜਾਰੀ ਕਰਨ ਦੀਆਂ ਮਿਤੀਆਂ ਸਮੇਤ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r7-toll": {
    question:
      "Delhi–Meerut Expressway ਦੇ ਹਰ ਪਲਾਜ਼ਾ ’ਤੇ ਕਿੰਨਾ ਟੋਲ ਵਸੂਲਿਆ ਗਿਆ, ਅਤੇ ਉਸ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ?",
    subject: "Delhi–Meerut Expressway ’ਤੇ ਵਸੂਲਿਆ ਗਿਆ ਟੋਲ ਅਤੇ ਉਸ ਦੀ ਵਰਤੋਂ, 2021–2026",
    body: [
      `1. ${PERIOD_5Y} ਦੀ ਮਿਆਦ ਵਿੱਚ ਹਰ ਸਾਲ Delhi–Meerut Expressway ਦੇ ਹਰ ਟੋਲ ਪਲਾਜ਼ਾ ’ਤੇ ਵਸੂਲੇ ਗਏ ਟੋਲ ਦੀ ਰਕਮ।`,
      "2. ਇਸੇ ਮਿਆਦ ਵਿੱਚ ਟੋਲ ਦਰਾਂ ਦੀ ਸੋਧ ਬਾਰੇ ਕੰਸੈਸ਼ਨਰ ਨਾਲ ਹੋਏ ਪੱਤਰ-ਵਿਹਾਰ ਦੀਆਂ ਨਕਲਾਂ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
    appealText:
      "CPIO ਨੇ ਟੋਲ ਵਸੂਲੀ ਦੇ ਅੰਕੜੇ ਦੇ ਦਿੱਤੇ ਹਨ, ਪਰ ਕੰਸੈਸ਼ਨਰ ਨਾਲ ਪੱਤਰ-ਵਿਹਾਰ ਆਰਟੀਆਈ ਐਕਟ 2005 ਦੀ ਧਾਰਾ 8(1)(ਘ) ਤਹਿਤ ਦੇਣ ਤੋਂ ਇਨਕਾਰ ਕਰ ਦਿੱਤਾ ਹੈ। ਇਹ ਪੱਤਰ-ਵਿਹਾਰ ਜਨਤਾ ਤੋਂ ਵਸੂਲੀਆਂ ਜਾਂਦੀਆਂ ਟੋਲ ਦਰਾਂ ਦੀ ਸੋਧ ਬਾਰੇ ਹੈ, ਅਤੇ ਵਿਆਪਕ ਜਨਹਿੱਤ ਵਿੱਚ ਉਸ ਦਾ ਖੁਲਾਸਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਪਹਿਲੇ ਅਪੀਲ ਅਧਿਕਾਰੀ ਨੂੰ ਬੇਨਤੀ ਹੈ ਕਿ ਇਨਕਾਰ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾਵੇ ਅਤੇ ਬਾਕੀ ਜਾਣਕਾਰੀ ਦੇਣ ਲਈ CPIO ਨੂੰ ਨਿਰਦੇਸ਼ ਦਿੱਤਾ ਜਾਵੇ।",
  },
  "demo-r8-dopt": {
    question: "ਪਿਛਲੇ ਸਾਲ ਵਿਭਾਗ ਨੂੰ ਕਿੰਨੀਆਂ ਆਰਟੀਆਈ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ ਅਤੇ ਕਿੰਨੀਆਂ ਨਿਪਟਾਈਆਂ ਗਈਆਂ?",
    subject: "2025–26 ਵਿੱਚ ਵਿਭਾਗ ਨੂੰ ਮਿਲੀਆਂ ਅਤੇ ਨਿਪਟਾਈਆਂ ਗਈਆਂ ਆਰਟੀਆਈ ਬੇਨਤੀਆਂ",
    body: [
      `1. ${PERIOD_FY} ਦੀ ਮਿਆਦ ਵਿੱਚ ਵਿਭਾਗ ਨੂੰ ਮਿਲੀਆਂ, ਨਿਪਟਾਈਆਂ ਗਈਆਂ, ਰੱਦ ਕੀਤੀਆਂ ਗਈਆਂ (ਹਰ ਰੱਦ ਕਰਨ ਵਿੱਚ ਹਵਾਲਾ ਦਿੱਤੀ ਧਾਰਾ ਸਮੇਤ) ਅਤੇ ਅਗਲੀ ਮਿਆਦ ਵਿੱਚ ਲਿਜਾਈਆਂ ਗਈਆਂ ਆਰਟੀਆਈ ਬੇਨਤੀਆਂ ਦੀ ਗਿਣਤੀ।`,
      "2. ਇਸੇ ਮਿਆਦ ਵਿੱਚ ਮਿਲੀਆਂ ਅਤੇ ਫ਼ੈਸਲਾ ਕੀਤੀਆਂ ਗਈਆਂ ਪਹਿਲੀਆਂ ਅਪੀਲਾਂ ਦੀ ਗਿਣਤੀ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
};

/** The mock Aadhaar handoff's street line, in Punjabi. Proper nouns stay. */
export const DEMO_AADHAAR_ADDR2_PA = "ਜ਼ਿਲ੍ਹਾ ਅਦਾਲਤ ਨੇੜੇ";
