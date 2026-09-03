/**
 * Bengali names for public authorities.
 *
 * Same drop-in pattern as `subjects.hi.ts`: keyed by authority id from
 * `src/data/authorities.ts`. `name` translates the authority's `name`; the ten
 * `st-*` State entries additionally carry `redirectLabel` and `redirectNote`,
 * translating `redirect.label` and `redirect.note`. Anything missing falls
 * back to English at render time.
 */
export const AUTHORITY_NAMES_BN: Record<
  string,
  { name: string; redirectLabel?: string; redirectNote?: string }
> = {
  dopt: { name: "কর্মী ও প্রশিক্ষণ বিভাগ" },
  mha: { name: "স্বরাষ্ট্র মন্ত্রক" },
  mea: { name: "পররাষ্ট্র মন্ত্রক" },
  morth: { name: "সড়ক পরিবহণ ও মহাসড়ক মন্ত্রক" },
  railways: { name: "রেল মন্ত্রক" },
  "mof-revenue": { name: "রাজস্ব বিভাগ" },
  "mof-expenditure": { name: "ব্যয় বিভাগ" },
  dfs: { name: "আর্থিক পরিষেবা বিভাগ" },
  health: { name: "স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রক" },
  "education-school": { name: "বিদ্যালয় শিক্ষা ও সাক্ষরতা বিভাগ" },
  "education-higher": { name: "উচ্চশিক্ষা বিভাগ" },
  rural: { name: "গ্রামোন্নয়ন মন্ত্রক" },
  agri: { name: "কৃষি ও কৃষক কল্যাণ বিভাগ" },
  food: { name: "খাদ্য ও গণবণ্টন বিভাগ" },
  consumer: { name: "ভোক্তা বিষয়ক বিভাগ" },
  labour: { name: "শ্রম ও কর্মসংস্থান মন্ত্রক" },
  wcd: { name: "নারী ও শিশু উন্নয়ন মন্ত্রক" },
  sj: { name: "সামাজিক ন্যায় ও ক্ষমতায়ন বিভাগ" },
  tribal: { name: "উপজাতি বিষয়ক মন্ত্রক" },
  housing: { name: "গৃহায়ণ ও নগর বিষয়ক মন্ত্রক" },
  jal: { name: "পানীয় জল ও স্বচ্ছতা বিভাগ" },
  power: { name: "বিদ্যুৎ মন্ত্রক" },
  petroleum: { name: "পেট্রোলিয়াম ও প্রাকৃতিক গ্যাস মন্ত্রক" },
  telecom: { name: "টেলিযোগাযোগ বিভাগ" },
  meity: { name: "ইলেকট্রনিক্স ও তথ্যপ্রযুক্তি মন্ত্রক" },
  defence: { name: "প্রতিরক্ষা মন্ত্রক" },
  environment: { name: "পরিবেশ, বন ও জলবায়ু পরিবর্তন মন্ত্রক" },
  coal: { name: "কয়লা মন্ত্রক" },
  msme: { name: "অতি ক্ষুদ্র, ক্ষুদ্র ও মাঝারি উদ্যোগ মন্ত্রক" },
  commerce: { name: "বাণিজ্য বিভাগ" },
  civilaviation: { name: "বেসামরিক বিমান চলাচল মন্ত্রক" },
  shipping: { name: "বন্দর, জাহাজ চলাচল ও জলপথ মন্ত্রক" },
  textiles: { name: "বস্ত্র মন্ত্রক" },
  youth: { name: "যুব বিষয়ক ও ক্রীড়া মন্ত্রক" },
  culture: { name: "সংস্কৃতি মন্ত্রক" },
  statistics: { name: "পরিসংখ্যান ও কর্মসূচি বাস্তবায়ন মন্ত্রক" },
  cic: { name: "কেন্দ্রীয় তথ্য কমিশন" },
  "cbdt-cpc": { name: "কেন্দ্রীয় প্রত্যক্ষ কর বোর্ড" },
  nhai: { name: "ভারতীয় জাতীয় মহাসড়ক কর্তৃপক্ষ" },
  "epfo-org": { name: "কর্মচারী ভবিষ্যৎ তহবিল সংস্থা" },
  "st-revenue": {
    name: "জেলা কালেক্টর / রাজস্ব বিভাগ (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "জমি ও রাজস্ব নথি আপনার রাজ্যের রাজস্ব বিভাগের কাছে থাকে। কোনো কেন্দ্রীয় পোর্টাল তা সংগ্রহ করতে পারে না।",
  },
  "st-police": {
    name: "রাজ্য পুলিশ (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "আইনশৃঙ্খলা রাজ্যের বিষয়। এফআইআর ও থানার নথি আপনার রাজ্য পুলিশের কাছেই থাকে।",
  },
  "st-municipal": {
    name: "পৌর নিগম / শহুরে স্থানীয় সংস্থা (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "পৌর পরিষেবা রাজ্য আইনের অধীনে আপনার শহর বা শহরতলির সংস্থা চালায়।",
  },
  "st-transport": {
    name: "রাজ্য পরিবহণ কর্তৃপক্ষ / আরটিও (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "ড্রাইভিং লাইসেন্স ও যানবাহন নিবন্ধন আপনার রাজ্যের আরটিও দেয়।",
  },
  "st-ration": {
    name: "রাজ্য খাদ্য ও গণবণ্টন / রেশন (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "কেন্দ্র সরকার খাদ্যশস্য বরাদ্দ করে; রেশন কার্ড দেয় ও দোকান চালায় আপনার রাজ্য।",
  },
  "st-electricity": {
    name: "রাজ্য বিদ্যুৎ পর্ষদ / ডিসকম (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "আপনার বিদ্যুৎ বণ্টন সংস্থা একটি রাজ্য উদ্যোগ।",
  },
  "st-school": {
    name: "রাজ্য বিদ্যালয় শিক্ষা বিভাগ (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "রাজ্য-চালিত স্কুল ও রাজ্য বোর্ড আপনার রাজ্য শিক্ষা বিভাগের অধীন।",
  },
  "st-health": {
    name: "রাজ্য স্বাস্থ্য বিভাগ / জেলা হাসপাতাল (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "জনস্বাস্থ্য পরিষেবা রাজ্যের বিষয়; জেলার সুবিধাগুলো রাজ্যই চালায়।",
  },
  "st-panchayat": {
    name: "গ্রাম পঞ্চায়েত / গ্রামীণ স্থানীয় সংস্থা (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "পঞ্চায়েত নথি আপনার রাজ্যের পঞ্চায়েতি রাজ বিভাগের অধীনে স্থানীয়ভাবে রাখা হয়।",
  },
  "st-irrigation": {
    name: "রাজ্য সেচ / পূর্ত বিভাগ (রাজ্য)",
    redirectLabel: "আপনার রাজ্য তথ্য কমিশন বা রাজ্য আরটিআই পোর্টাল",
    redirectNote: "রাজ্যের সড়ক, খাল ও পূর্ত কাজ আপনার রাজ্য সরকারের দায়িত্ব।",
  },
};
