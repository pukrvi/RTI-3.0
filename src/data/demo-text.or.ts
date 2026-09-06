/**
 * Odia renderings of the demo seeds' filed content.
 *
 * Same drop-in pattern as the locale-text files: keyed by seed id
 * (demo-r1-nh48 through demo-r8-dopt) from `demo-account.ts`. The seeds are
 * filed once, in English; the viewing locale's pack overlays the filed text.
 * `appealText` is carried only for demo-r7-toll, the one seed that has
 * appealed. Proper nouns (place and company names, PAN), Latin dates and
 * period ranges stay Latin; section references follow the existing or.json
 * precedent (ଧାରା 6(3), ଧାରା 8(1)(ଘ)). Formal RTI-application register.
 * All records are invented for this prototype.
 */
import type { DemoSeedText } from "./demo-account";

/** Point 3 of every seed body, verbatim from or.json scaffold.line3. */
const TRANSFER =
  "3. ଏହି ସୂଚନାର କୌଣସି ଅଂଶ ଅନ୍ୟ ଲୋକ ପ୍ରାଧିକରଣ ପାଖରେ ଥିଲେ ଦୟାକରି ସେହି ଅଂଶ ଆରଟିଆଇ ଆଇନ 2005ର ଧାରା 6(3) ଅନୁଯାୟୀ ହସ୍ତାନ୍ତର କରନ୍ତୁ ଏବଂ ମୋତେ ଜଣାନ୍ତୁ।";

/** Point 4 of every seed body, verbatim from or.json scaffold.line4. */
const ELECTRONIC =
  "4. ଦୟାକରି ସୂଚନା ଉପରେ ଦିଆଯାଇଥିବା ଇମେଲ ଠିକଣାକୁ ଇଲେକ୍ଟ୍ରୋନିକ ରୂପରେ ପଠାନ୍ତୁ।";

export const DEMO_TEXT_OR: Record<string, DemoSeedText> = {
  "demo-r1-nh48": {
    question:
      "ଗତ ପାଞ୍ଚ ବର୍ଷରେ NH-48ର Delhi–Jaipur ଖଣ୍ଡରେ ସଡ଼କ ନିର୍ମାଣ ଠିକା କେଉଁ କମ୍ପାନିମାନଙ୍କୁ ଦିଆଯାଇଛି, ଏବଂ କେଉଁ ବ୍ୟୟରେ?",
    subject: "NH-48ର Delhi–Jaipur ଖଣ୍ଡରେ ପ୍ରଦତ୍ତ ସଡ଼କ ଠିକା, 2021–2026",
    body: [
      "1. 1 April 2021 to 31 March 2026 ଅବଧିରେ NH-48ର Delhi–Jaipur ଖଣ୍ଡ ପାଇଁ ପ୍ରଦତ୍ତ ସମସ୍ତ ସଡ଼କ ନିର୍ମାଣ ଓ ରକ୍ଷଣାବେକ୍ଷଣ ଠିକାର ତାଲିକା — ପ୍ରତ୍ୟେକ ଠିକା ପାଇଁ ଠିକାଦାରଙ୍କ ନାଁ, ଖଣ୍ଡର ଲମ୍ବ ଓ ମଞ୍ଜୁର ବ୍ୟୟ ସହିତ।",
      "2. ଉପରୋକ୍ତ ପ୍ରତ୍ୟେକ ଠିକା ପାଇଁ ପ୍ରଦାନ ତାରିଖ, ସମାପ୍ତିର ନିର୍ଦ୍ଧାରିତ ତାରିଖ, ଏବଂ ସମାପ୍ତିର ପ୍ରକୃତ ତାରିଖ ବା ବର୍ତ୍ତମାନ ଭୌତିକ ଅଗ୍ରଗତି।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r2-railrefund": {
    question:
      "ଗତ ଆର୍ଥିକ ବର୍ଷରେ ବାତିଲ ଟ୍ରେନର ଯାତ୍ରୀମାନଙ୍କୁ କେତେ ଟଙ୍କା ଫେରସ୍ତ ଦିଆଯାଇଛି?",
    subject: "2025–26ରେ ବାତିଲ ଟ୍ରେନ ପାଇଁ ଦେୟ ଫେରସ୍ତ",
    body: [
      "1. 1 April 2025 to 31 March 2026 ଅବଧିରେ ବାତିଲ ଟ୍ରେନର ମୋଟ ସଂଖ୍ୟା ଓ ଯାତ୍ରୀମାନଙ୍କୁ ଫେରସ୍ତ ମୋଟ ରାଶି — ଜୋନବାରୀ।",
      "2. ସେହି ଅବଧିରେ ଇ-ଟିକେଟ ଓ କାଉଣ୍ଟର ଟିକେଟର ଫେରସ୍ତ ଜମା ହେବାକୁ ଲାଗିଥିବା ଦିନର ହାରାହାରି ସଂଖ୍ୟା।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r3-pmkisan": {
    question:
      "2024–25 ଓ 2025–26ରେ Maharashtraର Nashik ଜିଲ୍ଲାରେ କେତେ PM-KISAN ହିତାଧିକାରୀ ବାଦ୍ ପଡ଼ିଛନ୍ତି, ଏବଂ କେଉଁ ଆଧାରରେ?",
    subject: "Maharashtraର Nashik ଜିଲ୍ଲାରେ ବାଦ୍ ପଡ଼ିଥିବା PM-KISAN ହିତାଧିକାରୀ, 2024–2026",
    body: [
      "1. 1 April 2024 to 31 March 2026 ପର୍ଯ୍ୟନ୍ତ ପ୍ରତ୍ୟେକ ବର୍ଷରେ Maharashtraର Nashik ଜିଲ୍ଲାରେ ହିତାଧିକାରୀ ତାଲିକାରୁ ବାଦ୍ ପଡ଼ିଥିବା PM-KISAN ହିତାଧିକାରୀଙ୍କ ସଂଖ୍ୟା — ପ୍ରତ୍ୟେକ ମାମଲାରେ ବାଦ୍ ପାଇଁ ଲିପିବଦ୍ଧ ଆଧାର ସହିତ (ଆୟକରଦାତା, ଜମି ରେକର୍ଡ ଅମେଳ, ଦୁହରା ଆଧାର ସିଡିଂ ବା ଅନ୍ୟ)।",
      "2. ସେହି ଅବଧିରେ ଏହିପରି ବାଦ୍ ଯୋଗୁଁ ଅଟକାଯାଇଥିବା କିସ୍ତି ସଂଖ୍ୟା।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r4-epfo": {
    question:
      "Jan–Mar 2026ରେ Delhiର EPFO ଆଞ୍ଚଳିକ କାର୍ଯ୍ୟାଳୟରେ PF ଉଠାଣ ଦାବି ନିପତିରେ ମଧ୍ୟମା ସମୟ କେତେ ଥିଲା?",
    subject: "Delhiର EPFO ଆଞ୍ଚଳିକ କାର୍ଯ୍ୟାଳୟରେ PF ଉଠାଣ ଦାବି ନିପତିରେ ଲାଗିଥିବା ସମୟ, Jan–Mar 2026",
    body: [
      "1. 1 January 2026 to 31 March 2026 ତ୍ରୈମାସରେ Delhiର EPFO ଆଞ୍ଚଳିକ କାର୍ଯ୍ୟାଳୟରେ ଅନଲାଇନ PF ଉଠାଣ ଦାବି ଓ କାଗଜ PF ଉଠାଣ ଦାବି ନିପତିରେ ଲାଗିଥିବା କାର୍ଯ୍ୟଦିବସର ମଧ୍ୟମା ସଂଖ୍ୟା।",
      "2. ସେହି କାର୍ଯ୍ୟାଳୟରେ ସେହି ତ୍ରୈମାସରେ ଖାରଜ ହୋଇଥିବା PF ଉଠାଣ ଦାବି ସଂଖ୍ୟା — ଖାରଜର ତିନୋଟି ସବୁଠୁ ସାଧାରଣ କାରଣ ସହିତ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r5-mgnrega": {
    question:
      "31 March 2026 ସୁଦ୍ଧା Biharର Gaya ଜିଲ୍ଲାରେ କେତେ MGNREGA ମଜୁରି ଟଙ୍କା ବାକି ଥିଲା, ଏବଂ 2025–26ରେ କେତେ ବିଳମ୍ବ କ୍ଷତିପୂରଣ ଦିଆଗଲା?",
    subject: "Biharର Gaya ଜିଲ୍ଲାରେ ବାକି MGNREGA ମଜୁରି ଦେୟ ଓ ବିଳମ୍ବ କ୍ଷତିପୂରଣ",
    body: [
      "1. 31 March 2026 ସୁଦ୍ଧା Biharର Gaya ଜିଲ୍ଲାରେ ବାକି MGNREGA ମଜୁରି ଦେୟର ମୋଟ ରାଶି — ପ୍ରଭାବିତ ଶ୍ରମିକ ସଂଖ୍ୟା ସହିତ।",
      "2. 2025–26ରେ ସେହି ଜିଲ୍ଲାରେ ଯେଉଁ ଶ୍ରମିକମାନଙ୍କ ମଜୁରି 15 ଦିନରୁ ଅଧିକ ବିଳମ୍ବିତ ହୋଇଛି ସେମାନଙ୍କ ମଷ୍ଟର ରୋଲବାରୀ ବିବରଣୀ — ପ୍ରତ୍ୟେକ ମାମଲାରେ ଦେୟ ବିଳମ୍ବ କ୍ଷତିପୂରଣ ସହିତ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r6-cbdt": {
    question:
      "ଗତ ପାଞ୍ଚ ବର୍ଷରେ ଏକ ନାମିତ ଘରୋଇ କମ୍ପାନିର ଆୟକର ରିଟର୍ଣ୍ଣ ଓ ଫେରସ୍ତ ବିବରଣୀ",
    subject: "M/s Brightline Traders Pvt. Ltd.ର ଆୟକର ରିଟର୍ଣ୍ଣ ଓ ଫେରସ୍ତ, 2021–2026",
    body: [
      "1. 1 April 2021 to 31 March 2026 ଅବଧି ପାଇଁ M/s Brightline Traders Pvt. Ltd. (PAN AAFCB0000A) ଦାଖଲ କରିଥିବା ଆୟକର ରିଟର୍ଣ୍ଣର ପ୍ରମାଣିତ ନକଲ।",
      "2. ସେହି ଅବଧିରେ ଉକ୍ତ କମ୍ପାନିକୁ ଜାରି ସମସ୍ତ ଆୟକର ଫେରସ୍ତର ବିବରଣୀ — ଜାରି ତାରିଖ ସହିତ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
  "demo-r7-toll": {
    question:
      "Delhi–Meerut Expresswayର ପ୍ରତ୍ୟେକ ପ୍ଲାଜାରେ କେତେ ଟୋଲ ଆଦାୟ ହୋଇଛି, ଏବଂ ତାହା କିପରି ବ୍ୟବହୃତ ହୁଏ?",
    subject: "Delhi–Meerut Expresswayରେ ଆଦାୟ ଟୋଲ ଓ ତା'ର ବ୍ୟବହାର, 2021–2026",
    body: [
      "1. 1 April 2021 to 31 March 2026 ପର୍ଯ୍ୟନ୍ତ ପ୍ରତ୍ୟେକ ବର୍ଷରେ Delhi–Meerut Expresswayର ପ୍ରତ୍ୟେକ ଟୋଲ ପ୍ଲାଜାରେ ଆଦାୟ ଟୋଲ ରାଶି।",
      "2. ସେହି ଅବଧିରେ ଟୋଲ ହାର ସଂଶୋଧନ ବାବଦରେ ରିହାତିଗ୍ରାହୀ ସହିତ ପତ୍ରାଚାରର ନକଲ।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
    appealText:
      "CPIO ଟୋଲ ଆଦାୟ ଅଙ୍କ ଦେଇଛନ୍ତି, ମାତ୍ର ରିହାତିଗ୍ରାହୀ ସହିତ ପତ୍ରାଚାର ଆରଟିଆଇ ଆଇନ 2005ର ଧାରା 8(1)(ଘ) ଅଧୀନରେ ମନା କରିଛନ୍ତି। ଏହି ପତ୍ରାଚାର ଜନସାଧାରଣଙ୍କଠାରୁ ଆଦାୟ ଟୋଲ ହାର ସଂଶୋଧନ ବାବଦରେ, ଏବଂ ବୃହତ୍ତର ଜନସ୍ୱାର୍ଥ ଏହାର ପ୍ରକାଶନ ଦାବି କରେ। ମୋ ଅନୁରୋଧ ଯେ ପ୍ରଥମ ଅପିଲ ପ୍ରାଧିକରଣ ମନା ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ CPIOଙ୍କୁ ବଳକା ସୂଚନା ଦେବାକୁ ନିର୍ଦ୍ଦେଶ ଦିଅନ୍ତୁ।",
  },
  "demo-r8-dopt": {
    question: "ଗତ ବର୍ଷ ବିଭାଗ କେତେ ଆରଟିଆଇ ଆବେଦନ ପାଇଛି ଓ ନିପତାରଣ କରିଛି?",
    subject: "2025–26ରେ ବିଭାଗ ପାଇଥିବା ଓ ନିପତାରଣ କରିଥିବା ଆରଟିଆଇ ଆବେଦନ",
    body: [
      "1. 1 April 2025 to 31 March 2026 ଅବଧିରେ ବିଭାଗ ପାଇଥିବା, ନିପତାରଣ କରିଥିବା, ଖାରଜ କରିଥିବା (ପ୍ରତ୍ୟେକ ଖାରଜ ପାଇଁ ଉଦ୍ଧୃତ ଧାରା ସହିତ) ଓ ପରବର୍ତ୍ତୀ ଅବଧିକୁ ନେଇଥିବା ଆରଟିଆଇ ଆବେଦନ ସଂଖ୍ୟା।",
      "2. ସେହି ଅବଧିରେ ପାଇଥିବା ଓ ନିଷ୍ପତ୍ତି ହୋଇଥିବା ପ୍ରଥମ ଅପିଲ ସଂଖ୍ୟା।",
      TRANSFER,
      ELECTRONIC,
    ].join("\n\n"),
  },
};

/** The mock Aadhaar handoff's street line, in Odia. Proper nouns stay. */
export const DEMO_AADHAAR_ADDR2_OR = "ଜିଲ୍ଲା ଅଦାଲତ ନିକଟରେ";
