/**
 * Punjabi names for public authorities.
 *
 * Same drop-in pattern as `subjects.hi.ts`: keyed by authority id from
 * `src/data/authorities.ts`. `name` translates the authority's `name`; the ten
 * `st-*` State entries additionally carry `redirectLabel` and `redirectNote`,
 * translating `redirect.label` and `redirect.note`. Anything missing falls
 * back to English at render time.
 */
export const AUTHORITY_NAMES_PA: Record<
  string,
  { name: string; redirectLabel?: string; redirectNote?: string }
> = {
  dopt: { name: "ਕਾਰਮਿਕ ਅਤੇ ਸਿਖਲਾਈ ਵਿਭਾਗ" },
  mha: { name: "ਗ੍ਰਹਿ ਮੰਤਰਾਲਾ" },
  mea: { name: "ਵਿਦੇਸ਼ ਮੰਤਰਾਲਾ" },
  morth: { name: "ਸੜਕ ਆਵਾਜਾਈ ਅਤੇ ਰਾਜਮਾਰਗ ਮੰਤਰਾਲਾ" },
  railways: { name: "ਰੇਲ ਮੰਤਰਾਲਾ" },
  "mof-revenue": { name: "ਮਾਲ ਵਿਭਾਗ" },
  "mof-expenditure": { name: "ਖ਼ਰਚ ਵਿਭਾਗ" },
  dfs: { name: "ਵਿੱਤੀ ਸੇਵਾਵਾਂ ਵਿਭਾਗ" },
  health: { name: "ਸਿਹਤ ਅਤੇ ਪਰਿਵਾਰ ਭਲਾਈ ਮੰਤਰਾਲਾ" },
  "education-school": { name: "ਸਕੂਲ ਸਿੱਖਿਆ ਅਤੇ ਸਾਖ਼ਰਤਾ ਵਿਭਾਗ" },
  "education-higher": { name: "ਉੱਚ ਸਿੱਖਿਆ ਵਿਭਾਗ" },
  rural: { name: "ਪੇਂਡੂ ਵਿਕਾਸ ਮੰਤਰਾਲਾ" },
  agri: { name: "ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਵਿਭਾਗ" },
  food: { name: "ਖੁਰਾਕ ਅਤੇ ਜਨਤਕ ਵੰਡ ਵਿਭਾਗ" },
  consumer: { name: "ਖਪਤਕਾਰ ਮਾਮਲੇ ਵਿਭਾਗ" },
  labour: { name: "ਕਿਰਤ ਅਤੇ ਰੁਜ਼ਗਾਰ ਮੰਤਰਾਲਾ" },
  wcd: { name: "ਮਹਿਲਾ ਅਤੇ ਬਾਲ ਵਿਕਾਸ ਮੰਤਰਾਲਾ" },
  sj: { name: "ਸਮਾਜਿਕ ਨਿਆਂ ਅਤੇ ਅਧਿਕਾਰਤਾ ਵਿਭਾਗ" },
  tribal: { name: "ਕਬਾਇਲੀ ਮਾਮਲੇ ਮੰਤਰਾਲਾ" },
  housing: { name: "ਰਿਹਾਇਸ਼ ਅਤੇ ਸ਼ਹਿਰੀ ਮਾਮਲੇ ਮੰਤਰਾਲਾ" },
  jal: { name: "ਪੇਅਜਲ ਅਤੇ ਸਫ਼ਾਈ ਵਿਭਾਗ" },
  power: { name: "ਬਿਜਲੀ ਮੰਤਰਾਲਾ" },
  petroleum: { name: "ਪੈਟਰੋਲੀਅਮ ਅਤੇ ਕੁਦਰਤੀ ਗੈਸ ਮੰਤਰਾਲਾ" },
  telecom: { name: "ਦੂਰਸੰਚਾਰ ਵਿਭਾਗ" },
  meity: { name: "ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਅਤੇ ਸੂਚਨਾ ਤਕਨਾਲੋਜੀ ਮੰਤਰਾਲਾ" },
  defence: { name: "ਰੱਖਿਆ ਮੰਤਰਾਲਾ" },
  environment: { name: "ਵਾਤਾਵਰਨ, ਵਣ ਅਤੇ ਜਲਵਾਯੂ ਪਰਿਵਰਤਨ ਮੰਤਰਾਲਾ" },
  coal: { name: "ਕੋਲਾ ਮੰਤਰਾਲਾ" },
  msme: { name: "ਸੂਖ਼ਮ, ਲਘੂ ਅਤੇ ਦਰਮਿਆਨੇ ਉੱਦਮ ਮੰਤਰਾਲਾ" },
  commerce: { name: "ਵਣਜ ਵਿਭਾਗ" },
  civilaviation: { name: "ਨਾਗਰਿਕ ਹਵਾਬਾਜ਼ੀ ਮੰਤਰਾਲਾ" },
  shipping: { name: "ਬੰਦਰਗਾਹ, ਜਹਾਜ਼ਰਾਨੀ ਅਤੇ ਜਲ ਮਾਰਗ ਮੰਤਰਾਲਾ" },
  textiles: { name: "ਕਪੜਾ ਮੰਤਰਾਲਾ" },
  youth: { name: "ਯੁਵਾ ਮਾਮਲੇ ਅਤੇ ਖੇਡ ਮੰਤਰਾਲਾ" },
  culture: { name: "ਸੱਭਿਆਚਾਰ ਮੰਤਰਾਲਾ" },
  statistics: { name: "ਅੰਕੜਾ ਅਤੇ ਪ੍ਰੋਗਰਾਮ ਲਾਗੂਕਰਨ ਮੰਤਰਾਲਾ" },
  cic: { name: "ਕੇਂਦਰੀ ਸੂਚਨਾ ਕਮਿਸ਼ਨ" },
  "cbdt-cpc": { name: "ਕੇਂਦਰੀ ਸਿੱਧੇ ਕਰ ਬੋਰਡ" },
  nhai: { name: "ਭਾਰਤੀ ਕੌਮੀ ਸ਼ਾਹਰਾਹ ਅਥਾਰਟੀ" },
  "epfo-org": { name: "ਕਰਮਚਾਰੀ ਭਵਿੱਖ ਨਿਧੀ ਸੰਗਠਨ" },
  "st-revenue": {
    name: "ਜ਼ਿਲ੍ਹਾ ਕੁਲੈਕਟਰ / ਮਾਲ ਵਿਭਾਗ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਜ਼ਮੀਨ ਅਤੇ ਮਾਲ ਰਿਕਾਰਡ ਤੁਹਾਡੇ ਸੂਬੇ ਦੇ ਮਾਲ ਵਿਭਾਗ ਕੋਲ ਹਨ। ਕੋਈ ਕੇਂਦਰੀ ਪੋਰਟਲ ਉਨ੍ਹਾਂ ਨੂੰ ਪ੍ਰਾਪਤ ਨਹੀਂ ਕਰ ਸਕਦਾ।",
  },
  "st-police": {
    name: "ਸੂਬਾ ਪੁਲਿਸ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਅਮਨ-ਕਾਨੂੰਨ ਸੂਬੇ ਦਾ ਵਿਸ਼ਾ ਹੈ। ਐੱਫ਼ਆਈਆਰ ਅਤੇ ਥਾਣੇ ਦਾ ਰਿਕਾਰਡ ਤੁਹਾਡੀ ਸੂਬਾ ਪੁਲਿਸ ਕੋਲ ਹੀ ਹੈ।",
  },
  "st-municipal": {
    name: "ਨਗਰ ਨਿਗਮ / ਸ਼ਹਿਰੀ ਸਥਾਨਕ ਸੰਸਥਾ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਨਗਰਪਾਲਿਕਾ ਸੇਵਾਵਾਂ ਸੂਬਾ ਕਾਨੂੰਨ ਤਹਿਤ ਤੁਹਾਡੀ ਸ਼ਹਿਰੀ ਜਾਂ ਕਸਬਾ ਸੰਸਥਾ ਚਲਾਉਂਦੀ ਹੈ।",
  },
  "st-transport": {
    name: "ਸੂਬਾ ਟਰਾਂਸਪੋਰਟ ਅਥਾਰਟੀ / ਆਰਟੀਓ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਡਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ ਅਤੇ ਗੱਡੀਆਂ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤੁਹਾਡਾ ਸੂਬਾ ਆਰਟੀਓ ਜਾਰੀ ਕਰਦਾ ਹੈ।",
  },
  "st-ration": {
    name: "ਸੂਬਾ ਖੁਰਾਕ ਅਤੇ ਸਿਵਲ ਸਪਲਾਈ / ਰਾਸ਼ਨ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਕੇਂਦਰ ਸਰਕਾਰ ਅਨਾਜ ਅਲਾਟ ਕਰਦੀ ਹੈ; ਰਾਸ਼ਨ ਕਾਰਡ ਤੁਹਾਡਾ ਸੂਬਾ ਜਾਰੀ ਕਰਦਾ ਹੈ ਅਤੇ ਦੁਕਾਨਾਂ ਚਲਾਉਂਦਾ ਹੈ।",
  },
  "st-electricity": {
    name: "ਸੂਬਾ ਬਿਜਲੀ ਬੋਰਡ / ਡਿਸਕਾਮ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਤੁਹਾਡੀ ਬਿਜਲੀ ਵੰਡ ਕੰਪਨੀ ਇੱਕ ਸੂਬਾ ਉੱਦਮ ਹੈ।",
  },
  "st-school": {
    name: "ਸੂਬਾ ਸਕੂਲ ਸਿੱਖਿਆ ਵਿਭਾਗ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਸੂਬੇ ਵੱਲੋਂ ਚਲਾਏ ਜਾਂਦੇ ਸਕੂਲ ਅਤੇ ਸੂਬਾ ਬੋਰਡ ਤੁਹਾਡੇ ਸੂਬਾ ਸਿੱਖਿਆ ਵਿਭਾਗ ਅਧੀਨ ਹਨ।",
  },
  "st-health": {
    name: "ਸੂਬਾ ਸਿਹਤ ਵਿਭਾਗ / ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਜਨਤਕ ਸਿਹਤ ਸੇਵਾਵਾਂ ਸੂਬੇ ਦਾ ਵਿਸ਼ਾ ਹਨ; ਜ਼ਿਲ੍ਹੇ ਦੀਆਂ ਸਹੂਲਤਾਂ ਸੂਬਾ ਹੀ ਚਲਾਉਂਦਾ ਹੈ।",
  },
  "st-panchayat": {
    name: "ਗ੍ਰਾਮ ਪੰਚਾਇਤ / ਪੇਂਡੂ ਸਥਾਨਕ ਸੰਸਥਾ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਪੰਚਾਇਤ ਰਿਕਾਰਡ ਤੁਹਾਡੇ ਸੂਬੇ ਦੇ ਪੰਚਾਇਤੀ ਰਾਜ ਵਿਭਾਗ ਅਧੀਨ ਸਥਾਨਕ ਤੌਰ ’ਤੇ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  "st-irrigation": {
    name: "ਸੂਬਾ ਸਿੰਚਾਈ / ਲੋਕ ਨਿਰਮਾਣ ਵਿਭਾਗ (ਸੂਬਾ)",
    redirectLabel: "ਤੁਹਾਡਾ ਸੂਬਾ ਸੂਚਨਾ ਕਮਿਸ਼ਨ ਜਾਂ ਸੂਬਾ ਆਰਟੀਆਈ ਪੋਰਟਲ",
    redirectNote: "ਸੂਬੇ ਦੀਆਂ ਸੜਕਾਂ, ਨਹਿਰਾਂ ਅਤੇ ਪੀਡਬਲਿਊਡੀ ਕੰਮ ਤੁਹਾਡੀ ਸੂਬਾ ਸਰਕਾਰ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਹਨ।",
  },
};
