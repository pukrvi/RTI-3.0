/**
 * The Eighth Schedule.
 *
 * The live portal offers two languages in a dropdown: English and Hindi. The
 * Constitution recognises twenty-two, and the request body on that portal
 * accepts the script of none of them.
 *
 * All twenty-three are listed here, in their own script, because a citizen
 * should be able to see their language named on a government service even
 * before it is translated. Thirteen are live (English, Hindi, Assamese,
 * Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil,
 * Telugu, Urdu); the language menu offers only those, with no greyed-out
 * entries. Adding another is one JSON file plus one line in `DICTIONARIES`;
 * the `available` flag below flips itself.
 */
export interface Language {
  code: string;
  /** The language's name in its own script. */
  native: string;
  /** The language's name in English, for the `title` and for search. */
  english: string;
}

export const EIGHTH_SCHEDULE: Language[] = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "as", native: "অসমীয়া", english: "Assamese" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "brx", native: "बड़ो", english: "Bodo" },
  { code: "doi", native: "डोगरी", english: "Dogri" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "ks", native: "کٲشُر", english: "Kashmiri" },
  { code: "kok", native: "कोंकणी", english: "Konkani" },
  { code: "mai", native: "मैथिली", english: "Maithili" },
  { code: "ml", native: "മലയാളം", english: "Malayalam" },
  { code: "mni", native: "ꯃꯤꯇꯩꯂꯣꯟ", english: "Manipuri" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "ne", native: "नेपाली", english: "Nepali" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { code: "sa", native: "संस्कृतम्", english: "Sanskrit" },
  { code: "sat", native: "ᱥᱟᱱᱛᱟᱲᱤ", english: "Santali" },
  { code: "sd", native: "سنڌي", english: "Sindhi" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "ur", native: "اردو", english: "Urdu" },
];

/** Right-to-left scripts, so the page can set `dir` correctly when they land. */
export const RTL_LANGUAGES = new Set(["ur", "ks", "sd"]);
