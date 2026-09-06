/**
 * Malayalam keywords for matching released replies (`matchReplies`), keyed by
 * reply id from `src/data/replies.ts`.
 *
 * This file is the whole mechanism for adding a language to reply matching.
 * To support any other Eighth Schedule language, drop in
 * `reply-keywords.xx.ts` with the same shape and register it in
 * `src/data/subjects.ts`. No matching code changes.
 */
export const REPLY_KEYWORDS_ML: Record<string, string[]> = {
  "r-mgnrega-delay": ["തൊഴിലുറപ്പ്", "MGNREGA", "കൂലി", "കാലതാമസം", "നഷ്ടപരിഹാരം", "മസ്റ്റർ റോൾ", "ജോബ് കാർഡ്", "Gaya"],
  "r-pf-settlement": ["PF", "EPFO", "പ്രൊവിഡന്റ് ഫണ്ട്", "പിൻവലിക്കൽ", "ക്ലെയിം", "തീർപ്പാക്കൽ", "UAN", "Delhi"],
  "r-pmkisan-exclusion": ["PM-KISAN", "കർഷകൻ", "ഗുണഭോക്താവ്", "ഗഡു", "Nashik", "ഒഴിവാക്കൽ"],
  "r-rail-refund": ["റെയിൽവേ", "ട്രെയിൻ", "ടിക്കറ്റ്", "റീഫണ്ട്", "റദ്ദാക്കൽ", "IRCTC", "മേഖല തിരിച്ച്"],
  "r-passport-police": ["പാസ്പോർട്ട്", "പോലീസ് പരിശോധന", "പാസ്പോർട്ട് സേവാ കേന്ദ്രം", "വിസ", "കാലതാമസം"],
  "r-ayushman-claims": ["ആയുഷ്മാൻ", "PM-JAY", "ആശുപത്രി", "ക്ലെയിം", "നിരസിക്കൽ", "എംപാനൽ", "Patna"],
  "r-kv-admission": ["കേന്ദ്രീയ വിദ്യാലയം", "KV", "പ്രവേശനം", "ക്ലാസ് 1", "സീറ്റ്", "കാത്തിരിപ്പ് പട്ടിക"],
  "r-nh-tender": ["ദേശീയപാത", "NHAI", "കരാർ", "ടെൻഡർ", "ടോൾ", "Delhi", "Jaipur", "ചെലവ്"],
  "r-rti-disposal": ["ആർടിഐ", "അപേക്ഷ", "തീർപ്പാക്കൽ", "നിരസിക്കൽ", "വാർഷികം", "കണക്കുകൾ"],
  "r-lpg-connections": ["LPG", "ഉജ്ജ്വല", "സിലിണ്ടർ", "റീഫിൽ", "കണക്ഷൻ", "ഗ്യാസ്"],
  "r-pmay-sanction": ["PMAY", "ഭവനം", "നഗരം", "അനുവദിച്ചത്", "പൂർത്തിയാക്കിയത്", "വാർഡ്"],
  "r-fci-storage": ["FCI", "ഭക്ഷ്യധാന്യം", "ഗോഡൗൺ", "നാശം", "സംഭരണം", "എഴുതിത്തള്ളൽ"],
  "r-scholarship-pending": ["സ്കോളർഷിപ്പ്", "പോസ്റ്റ്-മെട്രിക്", "കെട്ടിക്കിടപ്പ്", "പട്ടികജാതി", "വിദ്യാർത്ഥി"],
  "r-tax-refund": ["ആദായനികുതി", "റീഫണ്ട്", "കെട്ടിക്കിടപ്പ്", "നികുതിദായകൻ", "CBDT"],
};
