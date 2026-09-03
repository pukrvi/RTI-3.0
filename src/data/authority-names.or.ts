/**
 * Odia names for public authorities.
 *
 * Same drop-in pattern as `subjects.hi.ts`: keyed by authority id from
 * `src/data/authorities.ts`. `name` translates the authority's `name`; the ten
 * `st-*` State entries additionally carry `redirectLabel` and `redirectNote`,
 * translating `redirect.label` and `redirect.note`. Anything missing falls
 * back to English at render time.
 */
export const AUTHORITY_NAMES_OR: Record<
  string,
  { name: string; redirectLabel?: string; redirectNote?: string }
> = {
  dopt: { name: "କାର୍ମିକ ଓ ପ୍ରଶିକ୍ଷଣ ବିଭାଗ" },
  mha: { name: "ଗୃହ ମନ୍ତ୍ରାଳୟ" },
  mea: { name: "ବୈଦେଶିକ ମନ୍ତ୍ରାଳୟ" },
  morth: { name: "ସଡ଼କ ପରିବହନ ଓ ରାଜପଥ ମନ୍ତ୍ରାଳୟ" },
  railways: { name: "ରେଳ ମନ୍ତ୍ରାଳୟ" },
  "mof-revenue": { name: "ରାଜସ୍ୱ ବିଭାଗ" },
  "mof-expenditure": { name: "ବ୍ୟୟ ବିଭାଗ" },
  dfs: { name: "ଆର୍ଥିକ ସେବା ବିଭାଗ" },
  health: { name: "ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ମନ୍ତ୍ରାଳୟ" },
  "education-school": { name: "ବିଦ୍ୟାଳୟ ଶିକ୍ଷା ଓ ସାକ୍ଷରତା ବିଭାଗ" },
  "education-higher": { name: "ଉଚ୍ଚ ଶିକ୍ଷା ବିଭାଗ" },
  rural: { name: "ଗ୍ରାମୀଣ ବିକାଶ ମନ୍ତ୍ରାଳୟ" },
  agri: { name: "କୃଷି ଓ କୃଷକ କଲ୍ୟାଣ ବିଭାଗ" },
  food: { name: "ଖାଦ୍ୟ ଓ ସାର୍ବଜନୀନ ବଣ୍ଟନ ବିଭାଗ" },
  consumer: { name: "ଉପଭୋକ୍ତା ବ୍ୟାପାର ବିଭାଗ" },
  labour: { name: "ଶ୍ରମ ଓ ନିଯୁକ୍ତି ମନ୍ତ୍ରାଳୟ" },
  wcd: { name: "ମହିଳା ଓ ଶିଶୁ ବିକାଶ ମନ୍ତ୍ରାଳୟ" },
  sj: { name: "ସାମାଜିକ ନ୍ୟାୟ ଓ ସଶକ୍ତିକରଣ ବିଭାଗ" },
  tribal: { name: "ଆଦିବାସୀ ବ୍ୟାପାର ମନ୍ତ୍ରାଳୟ" },
  housing: { name: "ଗୃହ ଓ ନଗର ବ୍ୟାପାର ମନ୍ତ୍ରାଳୟ" },
  jal: { name: "ପେୟ ଜଳ ଓ ସ୍ୱଚ୍ଛତା ବିଭାଗ" },
  power: { name: "ବିଦ୍ୟୁତ୍ ମନ୍ତ୍ରାଳୟ" },
  petroleum: { name: "ପେଟ୍ରୋଲିୟମ ଓ ପ୍ରାକୃତିକ ଗ୍ୟାସ ମନ୍ତ୍ରାଳୟ" },
  telecom: { name: "ଦୂରସଞ୍ଚାର ବିଭାଗ" },
  meity: { name: "ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଓ ସୂଚନା ପ୍ରଯୁକ୍ତି ମନ୍ତ୍ରାଳୟ" },
  defence: { name: "ପ୍ରତିରକ୍ଷା ମନ୍ତ୍ରାଳୟ" },
  environment: { name: "ପରିବେଶ, ଜଙ୍ଗଲ ଓ ଜଳବାୟୁ ପରିବର୍ତ୍ତନ ମନ୍ତ୍ରାଳୟ" },
  coal: { name: "କୋଇଲା ମନ୍ତ୍ରାଳୟ" },
  msme: { name: "ଅତି କ୍ଷୁଦ୍ର, କ୍ଷୁଦ୍ର ଓ ମଧ୍ୟମ ଉଦ୍ୟୋଗ ମନ୍ତ୍ରାଳୟ" },
  commerce: { name: "ବାଣିଜ୍ୟ ବିଭାଗ" },
  civilaviation: { name: "ବେସାମରିକ ବିମାନ ଚଳାଚଳ ମନ୍ତ୍ରାଳୟ" },
  shipping: { name: "ବନ୍ଦର, ଜାହାଜ ଚଳାଚଳ ଓ ଜଳପଥ ମନ୍ତ୍ରାଳୟ" },
  textiles: { name: "ବସ୍ତ୍ର ମନ୍ତ୍ରାଳୟ" },
  youth: { name: "ଯୁବ ବ୍ୟାପାର ଓ କ୍ରୀଡ଼ା ମନ୍ତ୍ରାଳୟ" },
  culture: { name: "ସଂସ୍କୃତି ମନ୍ତ୍ରାଳୟ" },
  statistics: { name: "ପରିସଂଖ୍ୟାନ ଓ କାର୍ଯ୍ୟକ୍ରମ କାର୍ଯ୍ୟାନ୍ୱୟନ ମନ୍ତ୍ରାଳୟ" },
  cic: { name: "କେନ୍ଦ୍ରୀୟ ସୂଚନା ଆୟୋଗ" },
  "cbdt-cpc": { name: "କେନ୍ଦ୍ରୀୟ ପ୍ରତ୍ୟକ୍ଷ କର ବୋର୍ଡ" },
  nhai: { name: "ଭାରତୀୟ ଜାତୀୟ ରାଜପଥ ପ୍ରାଧିକରଣ" },
  "epfo-org": { name: "କର୍ମଚାରୀ ଭବିଷ୍ୟନିଧି ପାଣ୍ଠି ସଂଗଠନ" },
  "st-revenue": {
    name: "ଜିଲ୍ଲାପାଳ / ରାଜସ୍ୱ ବିଭାଗ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ଜମି ଓ ରାଜସ୍ୱ ରେକର୍ଡ ଆପଣଙ୍କ ରାଜ୍ୟ ରାଜସ୍ୱ ବିଭାଗ ପାଖରେ ଥାଏ। କୌଣସି କେନ୍ଦ୍ରୀୟ ପୋର୍ଟାଲ ତାହା ପାଇପାରିବ ନାହିଁ।",
  },
  "st-police": {
    name: "ରାଜ୍ୟ ପୋଲିସ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ଆଇନ-ଶୃଙ୍ଖଳା ରାଜ୍ୟର ବିଷୟ। FIR ଓ ଥାନା ରେକର୍ଡ ଆପଣଙ୍କ ରାଜ୍ୟ ପୋଲିସ ପାଖରେ ଥାଏ।",
  },
  "st-municipal": {
    name: "ନଗର ନିଗମ / ସହରାଞ୍ଚଳ ସ୍ଥାନୀୟ ନିକାୟ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ନଗରପାଳିକା ସେବା ରାଜ୍ୟ ଆଇନ ଅଧୀନରେ ଆପଣଙ୍କ ସହର ବା ସହରତଳି ନିକାୟ ଚଳାଏ।",
  },
  "st-transport": {
    name: "ରାଜ୍ୟ ପରିବହନ ପ୍ରାଧିକରଣ / RTO (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ଡ୍ରାଇଭିଂ ଲାଇସେନ୍ସ ଓ ଯାନ ପଞ୍ଜୀକରଣ ଆପଣଙ୍କ ରାଜ୍ୟ RTO ଦିଏ।",
  },
  "st-ration": {
    name: "ରାଜ୍ୟ ଖାଦ୍ୟ ଓ ଅସାମରିକ ଯୋଗାଣ / ରେସନ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "କେନ୍ଦ୍ର ସରକାର ଖାଦ୍ୟଶସ୍ୟ ଆବଣ୍ଟନ କରେ; ରେସନ କାର୍ଡ ଦିଏ ଓ ଦୋକାନ ଚଳାଏ ଆପଣଙ୍କ ରାଜ୍ୟ।",
  },
  "st-electricity": {
    name: "ରାଜ୍ୟ ବିଦ୍ୟୁତ୍ ବୋର୍ଡ / ଡିସକମ୍ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ଆପଣଙ୍କ ବିଦ୍ୟୁତ୍ ବଣ୍ଟନ କମ୍ପାନି ଏକ ରାଜ୍ୟ ଉଦ୍ୟୋଗ।",
  },
  "st-school": {
    name: "ରାଜ୍ୟ ବିଦ୍ୟାଳୟ ଶିକ୍ଷା ବିଭାଗ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ରାଜ୍ୟ-ଚାଳିତ ବିଦ୍ୟାଳୟ ଓ ରାଜ୍ୟ ବୋର୍ଡ ଆପଣଙ୍କ ରାଜ୍ୟ ଶିକ୍ଷା ବିଭାଗ ଅଧୀନରେ।",
  },
  "st-health": {
    name: "ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ / ଜିଲ୍ଲା ଡାକ୍ତରଖାନା (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ଜନସ୍ୱାସ୍ଥ୍ୟ ସେବା ରାଜ୍ୟର ବିଷୟ; ଜିଲ୍ଲା ସୁବିଧା ରାଜ୍ୟ ଚଳାଏ।",
  },
  "st-panchayat": {
    name: "ଗ୍ରାମ ପଞ୍ଚାୟତ / ଗ୍ରାମୀଣ ସ୍ଥାନୀୟ ନିକାୟ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ପଞ୍ଚାୟତ ରେକର୍ଡ ଆପଣଙ୍କ ରାଜ୍ୟ ପଞ୍ଚାୟତିରାଜ ବିଭାଗ ଅଧୀନରେ ସ୍ଥାନୀୟ ସ୍ତରରେ ରଖାଯାଏ।",
  },
  "st-irrigation": {
    name: "ରାଜ୍ୟ ଜଳସେଚନ / ପୂର୍ତ୍ତ ବିଭାଗ (ରାଜ୍ୟ)",
    redirectLabel: "ଆପଣଙ୍କ ରାଜ୍ୟ ସୂଚନା ଆୟୋଗ ବା ରାଜ୍ୟ ଆରଟିଆଇ ପୋର୍ଟାଲ",
    redirectNote: "ରାଜ୍ୟ ସଡ଼କ, କେନାଲ ଓ ପୂର୍ତ୍ତ କାମ ଆପଣଙ୍କ ରାଜ୍ୟ ସରକାରଙ୍କ ଦାୟିତ୍ୱ।",
  },
};
