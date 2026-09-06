/**
 * Gujarati keywords for matching released replies (`matchReplies`),
 * keyed by reply id from `src/data/replies.ts`.
 *
 * Same drop-in pattern as subjects: English `keywords` on the record always
 * apply; these add Gujarati forms.
 */
export const REPLY_KEYWORDS_GU: Record<string, string[]> = {
  "r-mgnrega-delay": ["મનરેગા", "મજૂરી", "વિલંબ", "વળતર", "મસ્ટર રોલ", "જોબ કાર્ડ", "ગયા"],
  "r-pf-settlement": ["પીએફ", "ઈપીએફઓ", "ભવિષ્ય નિધિ", "ઉપાડ", "દાવો", "નિકાલ", "યુએએન", "દિલ્હી"],
  "r-pmkisan-exclusion": ["પીએમ કિસાન", "ખેડૂત", "લાભાર્થી", "દૂર કરેલા", "હપ્તો", "નાશિક"],
  "r-rail-refund": ["રેલવે", "ટ્રેન", "ટિકિટ", "રિફંડ", "રદ", "ઝોનવાર"],
  "r-passport-police": ["પાસપોર્ટ", "પોલીસ ચકાસણી", "વિદેશ મંત્રાલય", "વિલંબ"],
  "r-ayushman-claims": ["આયુષ્માન", "હોસ્પિટલ", "દાવો", "નકારેલા", "સૂચિબદ્ધ", "પટના"],
  "r-kv-admission": ["કેન્દ્રીય વિદ્યાલય", "પ્રવેશ", "ધોરણ 1", "બેઠક", "પ્રતીક્ષા યાદી"],
  "r-nh-tender": ["ધોરીમાર્ગ", "ઠેકો", "ટેન્ડર", "માર્ગ પ્રોજેક્ટ", "ટોલ", "દિલ્હી", "જયપુર", "ખર્ચ"],
  "r-rti-disposal": ["આરટીઆઈ", "અરજીઓ", "નિકાલ", "નકારેલી", "વાર્ષિક", "આંકડા"],
  "r-lpg-connections": ["એલપીજી", "ઉજ્જવલા", "સિલિન્ડર", "રિફિલ", "જોડાણ", "ગેસ"],
  "r-pmay-sanction": ["પીએમએવાય", "આવાસ", "શહેરી", "મંજૂર", "પૂર્ણ", "વોર્ડ"],
  "r-fci-storage": ["એફસીઆઈ", "અનાજ", "ગોડાઉન", "બગડેલું", "સંગ્રહ", "માંડી વાળેલું"],
  "r-scholarship-pending": ["શિષ્યવૃત્તિ", "પોસ્ટ મેટ્રિક", "બાકી", "અનુસૂચિત જાતિ", "વિદ્યાર્થી"],
  "r-tax-refund": ["આવકવેરો", "રિફંડ", "બાકી", "કરદાતા", "સીબીડીટી"],
};
