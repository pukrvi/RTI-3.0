/**
 * SYNTHETIC "already published" corpus.
 *
 * ⚠ Every record here is INVENTED for this prototype. Titles, dates and figures are
 * plausible but fabricated. No real document is reproduced and no live government
 * system is queried. In production this layer would be built from each authority's
 * section-4 proactive disclosures, its published datasets, and previously released
 * RTI replies — none of which the current portal exposes or indexes.
 *
 * Purpose: demonstrate that a large share of RTI requests ask for material that is
 * already public, and that telling the citizen so — before they pay — is a service.
 */

export interface PublishedRecord {
  id: string;
  authorityId: string;
  title: string;
  titleHi: string;
  /** What the citizen would actually get. */
  summary: string;
  summaryHi: string;
  kind: "annual-report" | "dataset" | "scheme-guideline" | "circular" | "past-rti-reply";
  updated: string;      // ISO date — synthetic
  keywords: string[];
}

export const PUBLISHED: PublishedRecord[] = [
  { id: "p-mgnrega-wages", authorityId: "rural",
    title: "MGNREGA wage payment status, district-wise (monthly dataset)",
    titleHi: "मनरेगा मजदूरी भुगतान स्थिति, जिलेवार (मासिक डेटासेट)",
    summary: "Pending and released wage payments by district and financial year, updated monthly. Includes delay-compensation figures.",
    summaryHi: "जिले और वित्तीय वर्ष के अनुसार लंबित और जारी मजदूरी भुगतान, मासिक अद्यतन। देरी-मुआवजा आंकड़े शामिल हैं।",
    kind: "dataset", updated: "2026-08-01",
    keywords: ["mgnrega", "nrega", "wage", "wages", "payment", "delay", "job card", "muster roll"] },
  { id: "p-pmkisan-list", authorityId: "agri",
    title: "PM-KISAN beneficiary counts and instalment release, State-wise",
    titleHi: "पीएम-किसान लाभार्थी संख्या और किस्त जारी, राज्यवार",
    summary: "Number of beneficiaries and instalments released per State per instalment cycle.",
    summaryHi: "प्रति राज्य प्रति किस्त चक्र लाभार्थियों की संख्या और जारी किस्तें।",
    kind: "dataset", updated: "2026-07-18",
    keywords: ["pm kisan", "kisan", "farmer", "instalment", "beneficiary", "6000"] },
  { id: "p-epfo-claims", authorityId: "epfo-org",
    title: "EPFO claim settlement time — quarterly performance report",
    titleHi: "ईपीएफओ दावा निपटान समय — त्रैमासिक प्रदर्शन रिपोर्ट",
    summary: "Average days to settle PF withdrawal, transfer and pension claims, by regional office.",
    summaryHi: "क्षेत्रीय कार्यालय के अनुसार पीएफ निकासी, स्थानांतरण और पेंशन दावों के निपटान में औसत दिन।",
    kind: "annual-report", updated: "2026-07-05",
    keywords: ["pf", "epfo", "provident fund", "claim", "withdrawal", "settlement", "pension", "uan"] },
  { id: "p-nh-projects", authorityId: "nhai",
    title: "National highway project status — stretch-wise progress dataset",
    titleHi: "राष्ट्रीय राजमार्ग परियोजना स्थिति — खंडवार प्रगति डेटासेट",
    summary: "Sanctioned length, awarded length, physical progress and expected completion for each NH stretch.",
    summaryHi: "प्रत्येक एनएच खंड के लिए स्वीकृत लंबाई, प्रदत्त लंबाई, भौतिक प्रगति और अपेक्षित पूर्णता।",
    kind: "dataset", updated: "2026-08-10",
    keywords: ["highway", "nh", "road project", "toll", "completion", "contract", "nhai"] },
  { id: "p-ayushman", authorityId: "health",
    title: "Ayushman Bharat PM-JAY — empanelled hospitals and claims paid",
    titleHi: "आयुष्मान भारत पीएम-जेएवाई — सूचीबद्ध अस्पताल और भुगतान किए गए दावे",
    summary: "List of empanelled hospitals by district, plus claim volumes and amounts paid per State.",
    summaryHi: "जिलेवार सूचीबद्ध अस्पतालों की सूची, साथ ही प्रति राज्य दावा मात्रा और भुगतान की गई राशि।",
    kind: "dataset", updated: "2026-08-04",
    keywords: ["ayushman", "pmjay", "hospital", "empanel", "health card", "claim", "treatment"] },
  { id: "p-kv-admission", authorityId: "education-school",
    title: "Kendriya Vidyalaya admission guidelines and class-wise vacancy",
    titleHi: "केंद्रीय विद्यालय प्रवेश दिशानिर्देश और कक्षावार रिक्ति",
    summary: "Current admission rules, priority categories, and declared vacancies per KV.",
    summaryHi: "वर्तमान प्रवेश नियम, प्राथमिकता श्रेणियाँ, और प्रति केवी घोषित रिक्तियाँ।",
    kind: "scheme-guideline", updated: "2026-03-28",
    keywords: ["kendriya vidyalaya", "kv", "admission", "vacancy", "class 1", "school seat"] },
  { id: "p-lpg-subsidy", authorityId: "petroleum",
    title: "LPG connections and subsidy transferred under Ujjwala",
    titleHi: "उज्ज्वला के तहत एलपीजी कनेक्शन और अंतरित सब्सिडी",
    summary: "Connections released and subsidy transferred, State and district level, with refill statistics.",
    summaryHi: "जारी कनेक्शन और अंतरित सब्सिडी, राज्य और जिला स्तर, रीफिल आंकड़ों सहित।",
    kind: "dataset", updated: "2026-07-30",
    keywords: ["lpg", "ujjwala", "gas", "cylinder", "subsidy", "connection", "refill"] },
  { id: "p-rti-annual", authorityId: "cic",
    title: "RTI annual report — requests received, disposed and pending by public authority",
    titleHi: "आरटीआई वार्षिक रिपोर्ट — लोक प्राधिकरण द्वारा प्राप्त, निपटाए और लंबित अनुरोध",
    summary: "Per-authority counts of requests received, rejected (with section cited), and appeals decided.",
    summaryHi: "प्रति प्राधिकरण प्राप्त, अस्वीकृत (धारा सहित) अनुरोधों और निर्णीत अपीलों की संख्या।",
    kind: "annual-report", updated: "2026-06-12",
    keywords: ["rti annual report", "rti statistics", "requests disposed", "appeal decided", "rti pending", "rti rejected"] },
  { id: "p-jjm-coverage", authorityId: "jal",
    title: "Jal Jeevan Mission — village-level tap connection coverage",
    titleHi: "जल जीवन मिशन — गाँव स्तर पर नल कनेक्शन कवरेज",
    summary: "Households with functional tap connections, by village, with scheme expenditure.",
    summaryHi: "गाँव के अनुसार कार्यात्मक नल कनेक्शन वाले घर, योजना व्यय सहित।",
    kind: "dataset", updated: "2026-08-06",
    keywords: ["jal jeevan", "tap water", "har ghar jal", "water connection", "village water"] },
  { id: "p-pmay-urban", authorityId: "housing",
    title: "PMAY-Urban houses sanctioned, completed and occupied",
    titleHi: "पीएमएवाई-शहरी घर स्वीकृत, पूर्ण और अधिग्रहीत",
    summary: "Sanctioned, grounded, completed and occupied houses per city, with central assistance released.",
    summaryHi: "प्रति शहर स्वीकृत, प्रारंभ, पूर्ण और अधिग्रहीत घर, जारी केंद्रीय सहायता सहित।",
    kind: "dataset", updated: "2026-07-22",
    keywords: ["pmay", "housing", "awas yojana", "house sanctioned", "urban housing", "subsidy"] },
  { id: "p-scholarship-rules", authorityId: "sj",
    title: "Post-Matric Scholarship for SC students — eligibility and rates",
    titleHi: "अनुसूचित जाति छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति — पात्रता और दरें",
    summary: "Income ceiling, course-wise maintenance allowance rates, and application timeline.",
    summaryHi: "आय सीमा, पाठ्यक्रमवार रखरखाव भत्ता दरें, और आवेदन समयरेखा।",
    kind: "scheme-guideline", updated: "2026-05-15",
    keywords: ["scholarship", "post matric", "sc", "st", "obc", "eligibility", "income limit", "student"] },
  { id: "p-past-reply-dopt", authorityId: "dopt",
    title: "Previously released RTI reply: seniority list maintenance rules",
    titleHi: "पहले जारी आरटीआई उत्तर: वरिष्ठता सूची रखरखाव नियम",
    summary: "A reply released to an earlier applicant setting out how seniority lists are maintained and revised. Released under RTI, now published.",
    summaryHi: "पहले के आवेदक को जारी उत्तर जिसमें बताया गया है कि वरिष्ठता सूचियाँ कैसे बनाई और संशोधित की जाती हैं। आरटीआई के तहत जारी, अब प्रकाशित।",
    kind: "past-rti-reply", updated: "2026-04-09",
    keywords: ["seniority", "promotion", "dpc", "civil service", "transfer policy", "cadre"] },
];

export const publishedByAuthority = (authorityId: string) =>
  PUBLISHED.filter((p) => p.authorityId === authorityId);
