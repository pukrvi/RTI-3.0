/**
 * Telugu renderings of the demo account's filed content, keyed by seed id
 * from `src/data/demo-account.ts` (`demo-r1-nh48` through `demo-r8-dopt`).
 * Same drop-in pattern as the locale-text files: the seeds are filed once,
 * in English, and the viewing locale's pack overlays the filed text.
 * `appealText` appears only for `demo-r7-toll`, the one seed that appealed.
 * All records are invented for this prototype.
 *
 * Bodies stay in formal RTI-application register. Proper nouns (place and
 * company names, PAN AAFCB0000A), Latin date ranges and section references
 * follow the existing te.json precedent (సమాచార హక్కు చట్టం, 2005లోని
 * సెక్షన్ 6(3)); person names stay in Latin as filed.
 */
import type { DemoSeedText } from "./demo-account";

/** Point 3 of every seed body, verbatim across seeds as in the English. */
const TRANSFER =
  "3. ఈ సమాచారంలో ఏ భాగమైనా మరో ప్రజా అధికార సంస్థ వద్ద ఉంటే, సమాచార హక్కు చట్టం, 2005లోని సెక్షన్ 6(3) కింద ఆ భాగాన్ని బదిలీ చేసి నాకు తెలియజేయగలరు.";

const ELECTRONIC =
  "4. సమాచారాన్ని పైన ఇచ్చిన ఈమెయిల్ చిరునామాకు ఎలక్ట్రానిక్ రూపంలో పంపగలరు.";

export const DEMO_TEXT_TE: Record<string, DemoSeedText> = {
  "demo-r1-nh48": {
    question:
      "గత ఐదేళ్లలో NH-48 Delhi–Jaipur విస్తరణలో రోడ్డు నిర్మాణ కాంట్రాక్టులు ఏ సంస్థలకు అప్పగించారు, ఏ వ్యయంతో?",
    subject: "NH-48 Delhi–Jaipur విస్తరణలో అప్పగించిన రోడ్డు కాంట్రాక్టులు, 2021–2026",
    body: [
      "1. 1 April 2021 to 31 March 2026 కాలంలో NH-48 Delhi–Jaipur విస్తరణకు అప్పగించిన అన్ని రోడ్డు నిర్మాణ, నిర్వహణ కాంట్రాక్టుల జాబితా — ప్రతి కాంట్రాక్టుకు కాంట్రాక్టర్ పేరు, విస్తరణ పొడవు, మంజూరు వ్యయంతో.",
      "2. పై ప్రతి కాంట్రాక్టుకు అప్పగించిన తేదీ, పూర్తికి నిర్ణీత తేదీ, వాస్తవ పూర్తి తేదీ లేదా ప్రస్తుత భౌతిక పురోగతి.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r2-railrefund": {
    question:
      "గత ఆర్థిక సంవత్సరంలో రద్దైన రైళ్ల ప్రయాణికులకు ఎంత డబ్బు వాపసు చేశారు?",
    subject: "2025–26లో రద్దైన రైళ్లకు చెల్లించిన వాపసు",
    body: [
      "1. 1 April 2025 to 31 March 2026 కాలంలో రద్దైన రైళ్ల మొత్తం సంఖ్య, ప్రయాణికులకు వాపసు చేసిన మొత్తం — జోన్ వారీగా.",
      "2. అదే కాలంలో ఈ-టికెట్లు, కౌంటర్ టికెట్ల వాపసు జమకు పట్టిన సగటు రోజులు.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r3-pmkisan": {
    question:
      "2024–25, 2025–26లో Maharashtraలో Nashik జిల్లాలో ఎంతమంది PM-KISAN లబ్ధిదారులను తొలగించారు, ఏ ప్రాతిపదికన?",
    subject: "Maharashtraలో Nashik జిల్లాలో తొలగించిన PM-KISAN లబ్ధిదారులు, 2024–2026",
    body: [
      "1. 1 April 2024 to 31 March 2026 కాలంలో ప్రతి ఏడాది Maharashtraలో Nashik జిల్లాలో లబ్ధిదారుల జాబితా నుంచి తొలగించిన PM-KISAN లబ్ధిదారుల సంఖ్య — ప్రతి తొలగింపుకు నమోదైన ప్రాతిపదికతో (ఆదాయపు పన్ను చెల్లింపుదారు, భూ రికార్డు తేడా, రెట్టింపు ఆధార్ అనుసంధానం లేదా ఇతర).",
      "2. అదే కాలంలో ఇలాంటి తొలగింపుల వల్ల నిలిపిన విడతల సంఖ్య.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r4-epfo": {
    question:
      "Jan–Mar 2026లో Delhiలో EPFO ప్రాంతీయ కార్యాలయంలో PF విత్‌డ్రా క్లెయిముల పరిష్కారానికి మధ్యగత కాలం ఎంత?",
    subject:
      "Delhiలో EPFO ప్రాంతీయ కార్యాలయంలో PF విత్‌డ్రా క్లెయిముల పరిష్కారానికి పట్టిన కాలం, Jan–Mar 2026",
    body: [
      "1. 1 January 2026 to 31 March 2026 త్రైమాసికంలో Delhiలో EPFO ప్రాంతీయ కార్యాలయంలో ఆన్‌లైన్ PF విత్‌డ్రా క్లెయిములు, భౌతిక PF విత్‌డ్రా క్లెయిముల పరిష్కారానికి పట్టిన మధ్యగత పని దినాలు.",
      "2. అదే కార్యాలయంలో అదే త్రైమాసికంలో తిరస్కరించిన PF విత్‌డ్రా క్లెయిముల సంఖ్య — అత్యంత సాధారణ మూడు తిరస్కరణ కారణాలతో.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r5-mgnrega": {
    question:
      "31 March 2026 నాటికి Biharలో Gaya జిల్లాలో MGNREGA కూలీ డబ్బు ఎంత పెండింగ్‌లో ఉంది, 2025–26లో ఎంత ఆలస్య పరిహారం చెల్లించారు?",
    subject: "Biharలో Gaya జిల్లాలో పెండింగ్ MGNREGA కూలీ చెల్లింపులు, ఆలస్య పరిహారం",
    body: [
      "1. 31 March 2026 నాటికి Biharలో Gaya జిల్లాలో పెండింగ్‌లో ఉన్న మొత్తం MGNREGA కూలీ మొత్తం — ప్రభావిత కార్మికుల సంఖ్యతో.",
      "2. 2025–26లో అదే జిల్లాలో 15 రోజులు దాటి కూలీ ఆలస్యమైన కార్మికుల మస్టర్-రోల్ వారీ వివరాలు — ప్రతి కేసులో చెల్లించిన ఆలస్య పరిహారంతో.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r6-cbdt": {
    question:
      "గత ఐదేళ్లలో పేర్కొన్న ప్రైవేట్ సంస్థ ఆదాయపు పన్ను రిటర్నులు, వాపసు వివరాలు",
    subject: "M/s Brightline Traders Pvt. Ltd. ఆదాయపు పన్ను రిటర్నులు, వాపసులు, 2021–2026",
    body: [
      "1. 1 April 2021 to 31 March 2026 కాలానికి M/s Brightline Traders Pvt. Ltd. (PAN AAFCB0000A) దాఖలు చేసిన ఆదాయపు పన్ను రిటర్నుల ధృవీకృత నకళ్లు.",
      "2. అదే కాలంలో పై సంస్థకు జారీ చేసిన అన్ని ఆదాయపు పన్ను వాపసుల వివరాలు — జారీ తేదీలతో.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r7-toll": {
    question:
      "Delhi–Meerut Expresswayలో ప్రతి ప్లాజా వద్ద ఎంత టోల్ వసూలు చేశారు, దాన్ని ఎలా వాడుతున్నారు?",
    subject: "Delhi–Meerut Expresswayపై వసూలైన టోల్, దాని వినియోగం, 2021–2026",
    body: [
      "1. 1 April 2021 to 31 March 2026 కాలంలో ప్రతి ఏడాది Delhi–Meerut Expresswayలో ప్రతి టోల్ ప్లాజా వద్ద వసూలైన టోల్ మొత్తం.",
      "2. అదే కాలంలో టోల్ రేట్ల సవరణపై కన్సెషనర్‌తో ఉత్తర ప్రత్యుత్తరాల నకళ్లు.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
    appealText:
      "CPIO టోల్ వసూళ్ల అంకెలు ఇచ్చారు, కానీ కన్సెషనర్ ఉత్తర ప్రత్యుత్తరాలను సమాచార హక్కు చట్టం, 2005లోని సెక్షన్ 8(1)(d) కింద నిరాకరించారు. ఆ ఉత్తర ప్రత్యుత్తరాలు ప్రజల నుంచి వసూలు చేసే టోల్ రేట్ల సవరణకు సంబంధించినవి; విస్తృత ప్రజా ప్రయోజనం వాటి వెల్లడిని కోరుతోంది. తిరస్కరణను పరిశీలించి, మిగిలిన సమాచారం ఇవ్వాలని CPIOను ఆదేశించవలసిందిగా మొదటి అపీలు అధికారిని కోరుతున్నాను.",
  },
  "demo-r8-dopt": {
    question: "గత ఏడాది శాఖకు ఎన్ని సమాచార హక్కు అర్జీలు అందాయి, ఎన్ని పరిష్కరించారు?",
    subject: "2025–26లో శాఖకు అందిన, పరిష్కరించిన సమాచార హక్కు అర్జీలు",
    body: [
      "1. 1 April 2025 to 31 March 2026 కాలంలో శాఖకు అందిన, పరిష్కరించిన, తిరస్కరించిన (ప్రతి తిరస్కరణకు ఉదహరించిన సెక్షన్‌తో), ముందుకు తీసుకెళ్లిన సమాచార హక్కు అర్జీల సంఖ్య.",
      "2. అదే కాలంలో అందిన, నిర్ణయించిన మొదటి అపీళ్ల సంఖ్య.",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
};

/** The mock Aadhaar handoff's street line in Telugu. Proper nouns stay. */
export const DEMO_AADHAAR_ADDR2_TE = "జిల్లా న్యాయస్థానం దగ్గర";
