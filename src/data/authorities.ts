/**
 * Public authorities.
 *
 * CENTRAL entries are real Central Government bodies. They are the bodies the real
 * RTI Online portal actually serves. `subjects` are plain-language keywords a citizen
 * might use — this is what makes routing possible without asking them to know the
 * machinery of government.
 *
 * STATE entries are real *categories* of State body. The live portal accepts requests
 * aimed at these, takes the fee, and returns the application weeks later without a
 * refund. In this prototype they are matched, labelled, and stopped BEFORE payment,
 * with a pointer to where the citizen should actually go.
 *
 * Nothing here is scraped. Central names are public record; `subjects` are our own.
 */

export type Scope = "central" | "state";

export interface Authority {
  id: string;
  code: string;          // in the style of the real registration-number prefix
  name: string;
  nameHi: string;
  scope: Scope;
  ministry?: string;     // parent, for Central
  subjects: string[];    // plain-language routing keywords
  /** For out-of-scope bodies: where the citizen should actually go. */
  redirect?: { label: string; labelHi: string; note: string; noteHi: string };
}

export const AUTHORITIES: Authority[] = [
  // ---------------------------------------------------------------- CENTRAL
  { id: "dopt", code: "DOPT", name: "Department of Personnel & Training", nameHi: "कार्मिक और प्रशिक्षण विभाग",
    scope: "central", ministry: "Ministry of Personnel, Public Grievances & Pensions",
    subjects: ["rti", "civil service", "ias", "government job rules", "seniority", "deputation", "pension rules", "reservation in central jobs", "vigilance"] },
  { id: "mha", code: "MHOME", name: "Ministry of Home Affairs", nameHi: "गृह मंत्रालय",
    scope: "central", subjects: ["citizenship", "passport police clearance", "foreigner registration", "cbi", "central armed police", "crpf", "bsf", "disaster management", "internal security", "naturalisation", "oci card"] },
  { id: "mea", code: "MEAFF", name: "Ministry of External Affairs", nameHi: "विदेश मंत्रालय",
    scope: "central", subjects: ["passport", "visa", "embassy", "consulate", "nri", "apostille", "attestation", "indians abroad"] },
  { id: "morth", code: "MORTH", name: "Ministry of Road Transport & Highways", nameHi: "सड़क परिवहन और राजमार्ग मंत्रालय",
    scope: "central", subjects: ["national highway", "nh", "toll plaza", "highway construction", "road accident data", "bharatmala", "vehicle safety standards"] },
  { id: "railways", code: "RAILW", name: "Ministry of Railways", nameHi: "रेल मंत्रालय",
    scope: "central", subjects: ["train", "railway", "irctc", "ticket refund", "railway recruitment", "station redevelopment", "rail accident", "reservation quota"] },
  { id: "mof-revenue", code: "DOREV", name: "Department of Revenue", nameHi: "राजस्व विभाग",
    scope: "central", ministry: "Ministry of Finance",
    subjects: ["income tax", "gst", "customs", "excise", "pan card", "tax refund", "benami", "enforcement directorate"] },
  { id: "mof-expenditure", code: "DOEXP", name: "Department of Expenditure", nameHi: "व्यय विभाग",
    scope: "central", ministry: "Ministry of Finance",
    subjects: ["central pay commission", "dearness allowance", "central government salary", "budget allocation", "finance commission"] },
  { id: "dfs", code: "DOFSR", name: "Department of Financial Services", nameHi: "वित्तीय सेवाएँ विभाग",
    scope: "central", ministry: "Ministry of Finance",
    subjects: ["public sector bank", "bank loan waiver", "jan dhan", "mudra loan", "insurance", "npa", "bank merger"] },
  { id: "health", code: "MOHFW", name: "Ministry of Health & Family Welfare", nameHi: "स्वास्थ्य और परिवार कल्याण मंत्रालय",
    scope: "central", subjects: ["ayushman bharat", "aiims", "drug approval", "medical college seats", "neet", "vaccine", "national health mission", "cghs"] },
  { id: "education-school", code: "DOSEL", name: "Department of School Education & Literacy", nameHi: "स्कूल शिक्षा और साक्षरता विभाग",
    scope: "central", ministry: "Ministry of Education",
    subjects: ["kendriya vidyalaya", "navodaya", "cbse", "samagra shiksha", "mid day meal scheme", "right to education central"] },
  { id: "education-higher", code: "DOHED", name: "Department of Higher Education", nameHi: "उच्चतर शिक्षा विभाग",
    scope: "central", ministry: "Ministry of Education",
    subjects: ["ugc", "aicte", "iit", "nit", "central university", "scholarship", "nirf ranking", "college affiliation central"] },
  { id: "rural", code: "MORDV", name: "Ministry of Rural Development", nameHi: "ग्रामीण विकास मंत्रालय",
    scope: "central", subjects: ["mgnrega", "nrega", "pmay gramin", "rural housing", "pmgsy", "rural road scheme", "self help group", "nrlm"] },
  { id: "agri", code: "DOAGR", name: "Department of Agriculture & Farmers Welfare", nameHi: "कृषि और किसान कल्याण विभाग",
    scope: "central", subjects: ["pm kisan", "crop insurance", "fasal bima", "msp", "minimum support price", "fertiliser subsidy", "soil health card", "kisan credit card"] },
  { id: "food", code: "DOFPD", name: "Department of Food & Public Distribution", nameHi: "खाद्य और सार्वजनिक वितरण विभाग",
    scope: "central", subjects: ["fci", "food corporation", "central ration allocation", "one nation one ration card", "pmgkay", "food grain procurement", "sugar policy"] },
  { id: "consumer", code: "DOCAF", name: "Department of Consumer Affairs", nameHi: "उपभोक्ता मामले विभाग",
    scope: "central", subjects: ["consumer complaint", "bis standard", "weights and measures", "price monitoring", "e commerce rules"] },
  { id: "labour", code: "MOLAB", name: "Ministry of Labour & Employment", nameHi: "श्रम और रोजगार मंत्रालय",
    scope: "central", subjects: ["epfo", "provident fund", "esic", "labour code", "minimum wage central", "e shram", "gratuity"] },
  { id: "wcd", code: "MOWCD", name: "Ministry of Women & Child Development", nameHi: "महिला और बाल विकास मंत्रालय",
    scope: "central", subjects: ["anganwadi", "icds", "poshan", "beti bachao", "one stop centre", "child protection", "maternity benefit"] },
  { id: "sj", code: "DOSJE", name: "Department of Social Justice & Empowerment", nameHi: "सामाजिक न्याय और अधिकारिता विभाग",
    scope: "central", subjects: ["sc st scholarship", "post matric scholarship", "disability certificate rules", "senior citizen scheme", "atrocities act data"] },
  { id: "tribal", code: "MOTRA", name: "Ministry of Tribal Affairs", nameHi: "जनजातीय कार्य मंत्रालय",
    scope: "central", subjects: ["forest rights act", "eklavya school", "tribal scholarship", "minor forest produce", "pvtg"] },
  { id: "housing", code: "MOHUA", name: "Ministry of Housing & Urban Affairs", nameHi: "आवास और शहरी कार्य मंत्रालय",
    scope: "central", subjects: ["pmay urban", "smart city mission", "amrut", "metro rail", "swachh bharat urban", "street vendor act"] },
  { id: "jal", code: "DOWSA", name: "Department of Drinking Water & Sanitation", nameHi: "पेयजल और स्वच्छता विभाग",
    scope: "central", subjects: ["jal jeevan mission", "har ghar jal", "swachh bharat gramin", "rural toilet", "piped water scheme"] },
  { id: "power", code: "MOPOW", name: "Ministry of Power", nameHi: "विद्युत मंत्रालय",
    scope: "central", subjects: ["national grid", "power tariff policy", "saubhagya", "ujala", "thermal plant central", "electricity act"] },
  { id: "petroleum", code: "MOPNG", name: "Ministry of Petroleum & Natural Gas", nameHi: "पेट्रोलियम और प्राकृतिक गैस मंत्रालय",
    scope: "central", subjects: ["lpg subsidy", "ujjwala", "gas cylinder", "petrol price", "gas pipeline", "oil marketing company"] },
  { id: "telecom", code: "DOTEL", name: "Department of Telecommunications", nameHi: "दूरसंचार विभाग",
    scope: "central", subjects: ["spectrum", "mobile tower", "bsnl", "bharatnet", "call drop", "sim card rules", "trai"] },
  { id: "meity", code: "MEITY", name: "Ministry of Electronics & Information Technology", nameHi: "इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय",
    scope: "central", subjects: ["aadhaar policy", "uidai", "digital india", "data protection", "it rules", "common service centre", "digilocker"] },
  { id: "defence", code: "MODEF", name: "Ministry of Defence", nameHi: "रक्षा मंत्रालय",
    scope: "central", subjects: ["army", "navy", "air force", "defence pension", "sainik school", "cantonment", "ex servicemen", "agniveer"] },
  { id: "environment", code: "MOEFC", name: "Ministry of Environment, Forest & Climate Change", nameHi: "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय",
    scope: "central", subjects: ["environmental clearance", "forest clearance", "pollution board central", "wildlife", "tiger reserve", "eia", "coastal regulation"] },
  { id: "coal", code: "MOCOL", name: "Ministry of Coal", nameHi: "कोयला मंत्रालय",
    scope: "central", subjects: ["coal block", "coal india", "mining lease central", "coal auction"] },
  { id: "msme", code: "MOMSM", name: "Ministry of Micro, Small & Medium Enterprises", nameHi: "सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय",
    scope: "central", subjects: ["udyam registration", "msme loan", "cluster scheme", "khadi", "pmegp"] },
  { id: "commerce", code: "DOCOM", name: "Department of Commerce", nameHi: "वाणिज्य विभाग",
    scope: "central", subjects: ["export promotion", "import duty", "sez", "trade agreement", "dgft", "export incentive"] },
  { id: "civilaviation", code: "MOCAV", name: "Ministry of Civil Aviation", nameHi: "नागर विमानन मंत्रालय",
    scope: "central", subjects: ["airport", "airline", "udan scheme", "dgca", "air fare", "flight safety"] },
  { id: "shipping", code: "MOPSW", name: "Ministry of Ports, Shipping & Waterways", nameHi: "पत्तन, पोत परिवहन और जलमार्ग मंत्रालय",
    scope: "central", subjects: ["port", "major port", "inland waterway", "seafarer", "sagarmala"] },
  { id: "textiles", code: "MOTEX", name: "Ministry of Textiles", nameHi: "वस्त्र मंत्रालय",
    scope: "central", subjects: ["handloom", "handicraft", "cotton procurement", "silk board", "textile park"] },
  { id: "youth", code: "MOYAS", name: "Ministry of Youth Affairs & Sports", nameHi: "युवा कार्यक्रम और खेल मंत्रालय",
    scope: "central", subjects: ["khelo india", "sai", "sports authority", "national sports federation", "nyks"] },
  { id: "culture", code: "MOCUL", name: "Ministry of Culture", nameHi: "संस्कृति मंत्रालय",
    scope: "central", subjects: ["asi", "monument", "museum", "archaeological survey", "heritage site", "akademi grant"] },
  { id: "statistics", code: "MOSPI", name: "Ministry of Statistics & Programme Implementation", nameHi: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय",
    scope: "central", subjects: ["census data", "nsso", "survey data", "cpi", "gdp", "mplads"] },
  { id: "cic", code: "CICOM", name: "Central Information Commission", nameHi: "केंद्रीय सूचना आयोग",
    scope: "central", subjects: ["second appeal", "rti complaint", "cic decision", "information commissioner"] },
  { id: "cbdt-cpc", code: "CBDTC", name: "Central Board of Direct Taxes", nameHi: "केंद्रीय प्रत्यक्ष कर बोर्ड",
    scope: "central", ministry: "Ministry of Finance",
    subjects: ["itr", "tax assessment", "tds", "form 16", "refund status", "faceless assessment"] },
  { id: "nhai", code: "NHAIA", name: "National Highways Authority of India", nameHi: "भारतीय राष्ट्रीय राजमार्ग प्राधिकरण",
    scope: "central", subjects: ["fastag", "toll", "highway land acquisition", "highway contract", "road project status"] },
  { id: "epfo-org", code: "EPFOI", name: "Employees' Provident Fund Organisation", nameHi: "कर्मचारी भविष्य निधि संगठन",
    scope: "central", subjects: ["pf withdrawal", "uan", "pf balance", "pension eps", "employer contribution"] },

  // ------------------------------------------------------------------ STATE
  // Out of scope for this portal. Matched so we can stop the citizen before payment.
  { id: "st-revenue", code: "ST-REV", name: "District Collector / Revenue Department (State)", nameHi: "जिला कलेक्टर / राजस्व विभाग (राज्य)",
    scope: "state",
    subjects: ["land record", "khata", "khasra", "patta", "mutation", "7/12 extract", "jamabandi", "encroachment", "caste certificate", "income certificate", "domicile", "tehsil", "circle rate", "land acquisition state"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Land and revenue records are held by your State's revenue department. A Central portal cannot obtain them.",
      noteHi: "भूमि और राजस्व रिकॉर्ड आपके राज्य के राजस्व विभाग के पास होते हैं। कोई केंद्रीय पोर्टल उन्हें प्राप्त नहीं कर सकता।" } },
  { id: "st-police", code: "ST-POL", name: "State Police (State)", nameHi: "राज्य पुलिस (राज्य)",
    scope: "state",
    subjects: ["fir", "police station", "police complaint", "chargesheet", "local police", "thana", "police verification state"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Law and order is a State subject. FIRs and station records sit with your State police.",
      noteHi: "कानून और व्यवस्था राज्य का विषय है। एफआईआर और थाना रिकॉर्ड आपके राज्य पुलिस के पास हैं।" } },
  { id: "st-municipal", code: "ST-MUN", name: "Municipal Corporation / Urban Local Body (State)", nameHi: "नगर निगम / शहरी स्थानीय निकाय (राज्य)",
    scope: "state",
    subjects: ["property tax", "building permission", "birth certificate", "death certificate", "garbage collection", "street light", "municipal water", "trade licence", "ward"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Municipal services are run by your city or town body under State law.",
      noteHi: "नगरपालिका सेवाएँ राज्य कानून के तहत आपके शहर या कस्बे के निकाय द्वारा चलाई जाती हैं।" } },
  { id: "st-transport", code: "ST-RTO", name: "State Transport Authority / RTO (State)", nameHi: "राज्य परिवहन प्राधिकरण / आरटीओ (राज्य)",
    scope: "state",
    subjects: ["driving licence", "vehicle registration", "rc book", "rto", "learner licence", "permit", "state bus", "challan"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Driving licences and vehicle registration are issued by your State RTO.",
      noteHi: "ड्राइविंग लाइसेंस और वाहन पंजीकरण आपके राज्य आरटीओ द्वारा जारी किए जाते हैं।" } },
  { id: "st-ration", code: "ST-PDS", name: "State Food & Civil Supplies / Ration (State)", nameHi: "राज्य खाद्य एवं नागरिक आपूर्ति / राशन (राज्य)",
    scope: "state",
    subjects: ["ration card", "ration shop", "fair price shop", "kerosene", "bpl list", "antyodaya card", "dealer licence"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Central government allocates food grain; your State issues ration cards and runs the shops.",
      noteHi: "केंद्र सरकार अनाज आवंटित करती है; राशन कार्ड और दुकानें आपका राज्य चलाता है।" } },
  { id: "st-electricity", code: "ST-ELE", name: "State Electricity Board / DISCOM (State)", nameHi: "राज्य विद्युत बोर्ड / डिस्कॉम (राज्य)",
    scope: "state",
    subjects: ["electricity bill", "power cut", "new connection", "meter reading", "transformer", "discom", "load sanction"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Your electricity distribution company is a State undertaking.",
      noteHi: "आपकी बिजली वितरण कंपनी एक राज्य उपक्रम है।" } },
  { id: "st-school", code: "ST-EDU", name: "State School Education Department (State)", nameHi: "राज्य विद्यालय शिक्षा विभाग (राज्य)",
    scope: "state",
    subjects: ["government school", "teacher recruitment state", "state board", "school admission", "scholarship state", "school building"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "State-run schools and State boards fall under your State education department.",
      noteHi: "राज्य द्वारा संचालित स्कूल और राज्य बोर्ड आपके राज्य शिक्षा विभाग के अधीन हैं।" } },
  { id: "st-health", code: "ST-HLT", name: "State Health Department / District Hospital (State)", nameHi: "राज्य स्वास्थ्य विभाग / जिला अस्पताल (राज्य)",
    scope: "state",
    subjects: ["primary health centre", "phc", "district hospital", "asha worker", "state ambulance", "government hospital state"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Public health delivery is a State subject; district facilities are State-run.",
      noteHi: "सार्वजनिक स्वास्थ्य वितरण राज्य का विषय है; जिला सुविधाएँ राज्य द्वारा संचालित हैं।" } },
  { id: "st-panchayat", code: "ST-PAN", name: "Gram Panchayat / Rural Local Body (State)", nameHi: "ग्राम पंचायत / ग्रामीण स्थानीय निकाय (राज्य)",
    scope: "state",
    subjects: ["panchayat", "gram sabha", "village road", "panchayat fund", "sarpanch", "job card issuance", "village water tank"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "Panchayat records are held locally under your State's panchayati raj department.",
      noteHi: "पंचायत रिकॉर्ड आपके राज्य के पंचायती राज विभाग के तहत स्थानीय स्तर पर रखे जाते हैं।" } },
  { id: "st-irrigation", code: "ST-IRR", name: "State Irrigation / Public Works Department (State)", nameHi: "राज्य सिंचाई / लोक निर्माण विभाग (राज्य)",
    scope: "state",
    subjects: ["canal", "state road repair", "pwd", "irrigation project state", "tender state", "bridge repair"],
    redirect: { label: "Your State Information Commission or State RTI portal", labelHi: "आपका राज्य सूचना आयोग या राज्य आरटीआई पोर्टल",
      note: "State roads, canals and PWD works are your State government's responsibility.",
      noteHi: "राज्य की सड़कें, नहरें और पीडब्ल्यूडी कार्य आपकी राज्य सरकार की ज़िम्मेदारी हैं।" } },
];

export const CENTRAL = AUTHORITIES.filter((a) => a.scope === "central");
export const STATE = AUTHORITIES.filter((a) => a.scope === "state");
export const byId = (id: string) => AUTHORITIES.find((a) => a.id === id);
