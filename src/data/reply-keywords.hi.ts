/**
 * Hindi keywords for matching released replies (`matchReplies`), keyed by
 * reply id from `src/data/replies.ts`.
 *
 * This file is the whole mechanism for adding a language to reply matching.
 * To support Tamil, Bengali, Marathi or any other Eighth Schedule language,
 * drop in `reply-keywords.ta.ts` with the same shape and register it in
 * `src/data/subjects.ts`. No matching code changes.
 */
export const REPLY_KEYWORDS_HI: Record<string, string[]> = {
  "r-mgnrega-delay": ["मनरेगा", "नरेगा", "मजदूरी", "देरी", "मुआवजा", "मस्टर रोल", "जॉब कार्ड", "गया"],
  "r-pf-settlement": ["पीएफ", "ईपीएफओ", "भविष्य निधि", "निकासी", "दावा", "निपटान", "यूएएन", "दिल्ली"],
  "r-pmkisan-exclusion": ["पीएम किसान", "किसान", "लाभार्थी", "किस्त", "नाशिक", "हटाए गए"],
  "r-rail-refund": ["रेलवे", "ट्रेन", "टिकट", "रिफंड", "रद्द", "आईआरसीटीसी", "ज़ोनवार"],
  "r-passport-police": ["पासपोर्ट", "पुलिस सत्यापन", "पासपोर्ट सेवा केंद्र", "वीजा", "देरी"],
  "r-ayushman-claims": ["आयुष्मान", "पीएमजेएवाई", "अस्पताल", "दावा", "अस्वीकृत", "सूचीबद्ध", "पटना"],
  "r-kv-admission": ["केंद्रीय विद्यालय", "केवी", "प्रवेश", "कक्षा 1", "सीट", "प्रतीक्षा सूची"],
  "r-nh-tender": ["राजमार्ग", "एनएचएआई", "ठेका", "टेंडर", "टोल", "दिल्ली", "जयपुर", "लागत"],
  "r-rti-disposal": ["आरटीआई", "आवेदन", "निपटारा", "अस्वीकृत", "वार्षिक", "आँकड़े"],
  "r-lpg-connections": ["एलपीजी", "उज्ज्वला", "सिलेंडर", "रीफिल", "कनेक्शन", "गैस"],
  "r-pmay-sanction": ["पीएमएवाई", "आवास", "शहरी", "स्वीकृत", "पूर्ण", "वार्ड"],
  "r-fci-storage": ["एफसीआई", "अनाज", "गोदाम", "खराब", "भंडारण", "बट्टा खाता"],
  "r-scholarship-pending": ["छात्रवृत्ति", "पोस्ट मैट्रिक", "लंबित", "अनुसूचित जाति", "छात्र"],
  "r-tax-refund": ["आयकर", "रिफंड", "लंबित", "करदाता", "सीबीडीटी"],
};
