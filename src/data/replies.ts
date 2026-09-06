/**
 * SYNTHETIC released RTI replies.
 *
 * ⚠ Every record here is INVENTED for this prototype — the questions, the
 * answers, the dates and the names of the people who supposedly asked. No real
 * reply is reproduced, no real person is named, and no live system was queried.
 *
 * Why they exist: once a public authority releases information under the Act it
 * is public, and the next citizen to ask the same question should be able to
 * find the answer instead of paying ₹10 and waiting thirty days for it again.
 * The live portal keeps no archive of replies at all, so every request starts
 * from zero. Here they sit alongside proactively published material in one
 * place, because from the citizen's side there is no difference: it is either
 * already answered or it is not.
 */

export type ReplyOutcome = "supplied" | "partial" | "refused";

export interface ReleasedReply {
  id: string;
  authorityId: string;
  /** What was asked. */
  question: string;
  questionHi: string;
  /** What came back. */
  answer: string;
  answerHi: string;
  /** Invented. Initial and surname only, as a public archive would show. */
  requester: string;
  filed: string;
  replied: string;
  outcome: ReplyOutcome;
  keywords: string[];
}

export const REPLIES: ReleasedReply[] = [
  {
    id: "r-mgnrega-delay", authorityId: "rural",
    question: "MGNREGA wage payments pending in Gaya district, Bihar as on 31 March 2026, and delay compensation paid in 2025–26",
    questionHi: "31 मार्च 2026 तक बिहार के गया जिले में लंबित मनरेगा मजदूरी और 2025–26 में दिया गया विलंब मुआवजा",
    answer: "Average 27 days against the 15-day statutory limit; delay compensation paid in 41 per cent of delayed cases. Muster-roll-wise figures enclosed.",
    answerHi: "15 दिन की वैधानिक सीमा के मुकाबले औसत 27 दिन; देरी वाले 41 प्रतिशत मामलों में मुआवजा दिया गया। मस्टर रोल के अनुसार आँकड़े संलग्न।",
    requester: "A. Sharma", filed: "2026-04-02", replied: "2026-04-28", outcome: "supplied",
    keywords: ["mgnrega", "nrega", "wage", "delay", "compensation", "muster roll", "job card", "gaya"],
  },
  {
    id: "r-pf-settlement", authorityId: "epfo-org",
    question: "Median settlement time for PF withdrawal claims at the EPFO Regional Office, Delhi, Jan–Mar 2026",
    questionHi: "दिल्ली क्षेत्रीय ईपीएफओ कार्यालय में जनवरी–मार्च 2026 में पीएफ निकासी दावों के निपटान का औसत समय",
    answer: "Median 11 working days for online claims and 24 for physical claims in the last quarter. Rejection reasons are listed by category.",
    answerHi: "पिछली तिमाही में ऑनलाइन दावों के लिए औसत 11 कार्यदिवस और भौतिक दावों के लिए 24। अस्वीकृति के कारण श्रेणीवार सूचीबद्ध हैं।",
    requester: "M. Iqbal", filed: "2026-03-11", replied: "2026-04-06", outcome: "supplied",
    keywords: ["pf", "epfo", "provident fund", "withdrawal", "claim", "settlement", "uan", "delhi", "median"],
  },
  {
    id: "r-pmkisan-exclusion", authorityId: "agri",
    question: "PM-KISAN beneficiaries removed in Nashik district, Maharashtra in 2024–25 and 2025–26, and the grounds recorded",
    questionHi: "2024–25 और 2025–26 में महाराष्ट्र के नाशिक जिले में हटाए गए पीएम-किसान लाभार्थी और दर्ज आधार",
    answer: "Removals by category — income-tax payer, land record mismatch, duplicate Aadhaar seeding — with State totals for the last two instalment cycles.",
    answerHi: "श्रेणीवार हटाए गए — आयकरदाता, भूमि रिकॉर्ड में अंतर, दोहरी आधार सीडिंग — पिछले दो किस्त चक्रों के राज्यवार आँकड़ों सहित।",
    requester: "R. Devi", filed: "2026-02-18", replied: "2026-03-14", outcome: "supplied",
    keywords: ["pm kisan", "kisan", "farmer", "beneficiary", "removed", "instalment", "nashik"],
  },
  {
    id: "r-rail-refund", authorityId: "railways",
    question: "Ticket refunds paid for trains cancelled zone-wise in 2025–26",
    questionHi: "2025–26 में ज़ोनवार रद्द ट्रेनों के लिए किया गया टिकट रिफंड",
    answer: "Zone-wise cancellation counts and total refund paid, with average time to credit.",
    answerHi: "क्षेत्रवार रद्दीकरण संख्या और कुल भुगतान किया गया रिफंड, क्रेडिट में लगे औसत समय सहित।",
    requester: "S. Nair", filed: "2026-01-22", replied: "2026-02-19", outcome: "supplied",
    keywords: ["railway", "train", "ticket", "refund", "cancelled", "irctc", "zone-wise"],
  },
  {
    id: "r-passport-police", authorityId: "mea",
    question: "Average time for police verification in passport applications",
    questionHi: "पासपोर्ट आवेदनों में पुलिस सत्यापन का औसत समय",
    answer: "State-wise averages supplied. Individual case files were withheld — they relate to third parties.",
    answerHi: "राज्यवार औसत उपलब्ध कराए गए। व्यक्तिगत मामलों की फाइलें रोकी गईं — वे तीसरे पक्ष से संबंधित हैं।",
    requester: "P. Banerjee", filed: "2026-03-04", replied: "2026-04-01", outcome: "partial",
    keywords: ["passport", "police verification", "mea", "psk", "delay"],
  },
  {
    id: "r-ayushman-claims", authorityId: "health",
    question: "Ayushman Bharat claims from empanelled hospitals in Patna district rejected in 2025–26, and the grounds",
    questionHi: "2025–26 में पटना जिले के सूचीबद्ध अस्पतालों के अस्वीकृत आयुष्मान भारत दावे और आधार",
    answer: "Hospital-wise rejection counts and the three most common rejection grounds.",
    answerHi: "अस्पतालवार अस्वीकृति संख्या और अस्वीकृति के तीन सबसे आम आधार।",
    requester: "K. Reddy", filed: "2026-02-06", replied: "2026-03-05", outcome: "supplied",
    keywords: ["ayushman", "pmjay", "hospital", "claim", "rejected", "empanel", "patna"],
  },
  {
    id: "r-kv-admission", authorityId: "education-school",
    question: "Class 1 admission applications and seats filled under each priority category",
    questionHi: "कक्षा 1 के प्रवेश आवेदन और प्रत्येक प्राथमिकता श्रेणी में भरी गई सीटें",
    answer: "Category-wise applications, seats and waiting list for the current session.",
    answerHi: "वर्तमान सत्र के लिए श्रेणीवार आवेदन, सीटें और प्रतीक्षा सूची।",
    requester: "J. Kaur", filed: "2026-04-15", replied: "2026-05-12", outcome: "supplied",
    keywords: ["kendriya vidyalaya", "kv", "admission", "class 1", "seat", "waiting list"],
  },
  {
    id: "r-nh-tender", authorityId: "nhai",
    question: "National highway contracts for the Delhi–Jaipur stretch of NH-48, 2021–2026: sanctioned cost, toll collected and reasons recorded",
    questionHi: "एनएच-48 के दिल्ली–जयपुर खंड के राष्ट्रीय राजमार्ग ठेके, 2021–2026: स्वीकृत लागत, वसूला गया टोल और दर्ज कारण",
    answer: "Sanctioned and revised cost supplied. Contractor correspondence was refused under section 8(1)(d) as commercial confidence.",
    answerHi: "स्वीकृत और संशोधित लागत दी गई। ठेकेदार पत्राचार धारा 8(1)(घ) के अंतर्गत वाणिज्यिक विश्वास के आधार पर अस्वीकृत।",
    requester: "T. Rao", filed: "2026-01-09", replied: "2026-02-05", outcome: "partial",
    keywords: ["highway", "nhai", "cost overrun", "contract", "tender", "road project", "delhi", "jaipur", "toll"],
  },
  {
    id: "r-rti-disposal", authorityId: "dopt",
    question: "RTI applications received and disposed of by the department last year",
    questionHi: "पिछले वर्ष विभाग को प्राप्त और निपटाए गए आरटीआई आवेदन",
    answer: "Received, disposed, rejected and carried forward, with section-wise rejection grounds.",
    answerHi: "प्राप्त, निपटाए, अस्वीकृत और अगली अवधि में ले जाए गए, धारावार अस्वीकृति आधारों सहित।",
    requester: "N. Patil", filed: "2026-05-02", replied: "2026-05-28", outcome: "supplied",
    keywords: ["rti", "applications", "disposed", "rejected", "annual", "statistics"],
  },
  {
    id: "r-lpg-connections", authorityId: "petroleum",
    question: "Ujjwala connections issued and refill rate in the district",
    questionHi: "जिले में जारी उज्ज्वला कनेक्शन और रीफिल दर",
    answer: "Connections issued by block and the average number of refills per connection per year.",
    answerHi: "ब्लॉकवार जारी कनेक्शन और प्रति कनेक्शन प्रति वर्ष औसत रीफिल संख्या।",
    requester: "D. Bhat", filed: "2026-03-20", replied: "2026-04-16", outcome: "supplied",
    keywords: ["lpg", "ujjwala", "cylinder", "refill", "connection", "gas"],
  },
  {
    id: "r-pmay-sanction", authorityId: "housing",
    question: "PMAY-Urban houses sanctioned against houses completed in the city",
    questionHi: "शहर में स्वीकृत बनाम पूर्ण पीएमएवाई-शहरी मकान",
    answer: "Sanctioned, grounded and completed counts by ward, with instalment release dates.",
    answerHi: "वार्डवार स्वीकृत, शुरू और पूर्ण संख्या, किस्त जारी होने की तिथियों सहित।",
    requester: "V. Menon", filed: "2026-02-27", replied: "2026-03-25", outcome: "supplied",
    keywords: ["pmay", "housing", "urban", "sanctioned", "completed", "ward"],
  },
  {
    id: "r-fci-storage", authorityId: "food",
    question: "Foodgrain damaged in storage at FCI godowns in the State",
    questionHi: "राज्य में एफसीआई गोदामों में भंडारण के दौरान खराब हुआ अनाज",
    answer: "Quantity written off by godown and year, with the reasons recorded in each case.",
    answerHi: "गोदाम और वर्ष के अनुसार बट्टे खाते में डाली गई मात्रा, हर मामले में दर्ज कारणों सहित।",
    requester: "G. Yadav", filed: "2026-01-30", replied: "2026-02-26", outcome: "supplied",
    keywords: ["fci", "foodgrain", "godown", "damaged", "storage", "written off"],
  },
  {
    id: "r-scholarship-pending", authorityId: "sj",
    question: "Post-matric scholarship applications for SC students pending beyond one year as on 31 March 2026, State-wise",
    questionHi: "31 मार्च 2026 तक एक साल से ज़्यादा से लंबित अनुसूचित जाति छात्रों के पोस्ट मैट्रिक छात्रवृत्ति आवेदन, राज्यवार",
    answer: "Pending counts by State and the stage at which each is held up.",
    answerHi: "राज्यवार लंबित संख्या और वह चरण जिस पर हर आवेदन अटका है।",
    requester: "L. Toppo", filed: "2026-04-08", replied: "2026-05-06", outcome: "supplied",
    keywords: ["scholarship", "post matric", "pending", "sc st", "students"],
  },
  {
    id: "r-tax-refund", authorityId: "cbdt-cpc",
    question: "Income-tax refunds pending beyond 12 months and the reason for each",
    questionHi: "12 महीने से अधिक लंबित आयकर रिफंड और हर एक का कारण",
    answer: "Refused under section 8(1)(j). Refund details of individual assessees are personal information.",
    answerHi: "धारा 8(1)(ञ) के अंतर्गत अस्वीकृत। व्यक्तिगत करदाताओं के रिफंड विवरण व्यक्तिगत जानकारी हैं।",
    requester: "H. Shetty", filed: "2026-03-01", replied: "2026-03-27", outcome: "refused",
    keywords: ["income tax", "refund", "pending", "assessee", "cbdt"],
  },
];
