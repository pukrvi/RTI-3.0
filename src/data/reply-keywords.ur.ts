/**
 * Urdu keywords for matching released replies (`matchReplies`),
 * keyed by reply id from `src/data/replies.ts`.
 *
 * Same drop-in pattern as subjects: 4-8 Urdu keywords each, calibrated
 * against the English `keywords` on each record.
 */
export const REPLY_KEYWORDS_UR: Record<string, string[]> = {
  "r-mgnrega-delay": ["منریگا", "مزدوری", "تاخیر", "معاوضہ", "مستر رول", "جاب کارڈ", "گیا"],
  "r-pf-settlement": ["پی ایف", "ای پی ایف او", "پروویڈنٹ فنڈ", "نکاسی", "دعویٰ", "تصفیہ", "اوسط"],
  "r-pmkisan-exclusion": ["پی ایم کسان", "کسان", "فائدہ اٹھانے والا", "خارج", "قسط", "ناشک"],
  "r-rail-refund": ["ریلوے", "ٹرین", "ٹکٹ", "ریفنڈ", "منسوخ", "زون وار"],
  "r-passport-police": ["پاسپورٹ", "پولیس تصدیق", "تاخیر", "سفارت", "پی ایس کے"],
  "r-ayushman-claims": ["آیوشمان", "اسپتال", "دعویٰ", "مسترد", "فہرست شدہ", "پٹنہ"],
  "r-kv-admission": ["کیندریہ ودیالیہ", "داخلہ", "نشست", "انتظار فہرست", "جماعت"],
  "r-nh-tender": ["شاہراہ", "ٹھیکہ", "ٹینڈر", "سڑک منصوبہ", "لاگت", "ٹول"],
  "r-rti-disposal": ["آر ٹی آئی", "درخواستیں", "نمٹائی", "مسترد", "سالانہ", "اعداد"],
  "r-lpg-connections": ["ایل پی جی", "اجولا", "سلنڈر", "ری فل", "کنکشن", "گیس"],
  "r-pmay-sanction": ["پی ایم اے وائی", "رہائش", "شہری", "منظور شدہ", "مکمل", "وارڈ"],
  "r-fci-storage": ["ایف سی آئی", "اناج", "گودام", "خراب", "ذخیرہ", "بٹہ کھاتہ"],
  "r-scholarship-pending": ["اسکالرشپ", "پوسٹ میٹرک", "بقایا", "طلبہ", "درج فہرست"],
  "r-tax-refund": ["انکم ٹیکس", "ریفنڈ", "بقایا", "ٹیکس دہندہ", "سی بی ڈی ٹی"],
};
