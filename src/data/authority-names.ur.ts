/**
 * Urdu names for public authorities.
 *
 * Same drop-in pattern as `subjects.hi.ts`: keyed by authority id from
 * `src/data/authorities.ts`. `name` translates the authority's `name`; the ten
 * `st-*` State entries additionally carry `redirectLabel` and `redirectNote`,
 * translating `redirect.label` and `redirect.note`. Anything missing falls
 * back to English at render time. The page sets `dir="rtl"` for this locale.
 */
export const AUTHORITY_NAMES_UR: Record<
  string,
  { name: string; redirectLabel?: string; redirectNote?: string }
> = {
  dopt: { name: "محکمہ عملہ و تربیت" },
  mha: { name: "وزارت داخلہ" },
  mea: { name: "وزارت خارجہ" },
  morth: { name: "وزارت سڑک نقل و حمل و شاہراہیں" },
  railways: { name: "وزارت ریلوے" },
  "mof-revenue": { name: "محکمہ محصولات" },
  "mof-expenditure": { name: "محکمہ اخراجات" },
  dfs: { name: "محکمہ مالیاتی خدمات" },
  health: { name: "وزارت صحت و خاندانی بہبود" },
  "education-school": { name: "محکمہ اسکولی تعلیم و خواندگی" },
  "education-higher": { name: "محکمہ اعلیٰ تعلیم" },
  rural: { name: "وزارت دیہی ترقی" },
  agri: { name: "محکمہ زراعت و بہبودِ کسان" },
  food: { name: "محکمہ خوراک و عوامی تقسیم" },
  consumer: { name: "محکمہ امورِ صارفین" },
  labour: { name: "وزارت محنت و روزگار" },
  wcd: { name: "وزارت خواتین و اطفال کی ترقی" },
  sj: { name: "محکمہ سماجی انصاف و تفویضِ اختیار" },
  tribal: { name: "وزارت قبائلی امور" },
  housing: { name: "وزارت رہائش و شہری امور" },
  jal: { name: "محکمہ پینے کا پانی و صفائی" },
  power: { name: "وزارت بجلی" },
  petroleum: { name: "وزارت پٹرولیم و قدرتی گیس" },
  telecom: { name: "محکمہ ٹیلی مواصلات" },
  meity: { name: "وزارت الیکٹرانکس و انفارمیشن ٹیکنالوجی" },
  defence: { name: "وزارت دفاع" },
  environment: { name: "وزارت ماحولیات، جنگلات و موسمیاتی تبدیلی" },
  coal: { name: "وزارت کوئلہ" },
  msme: { name: "وزارت خردہ، چھوٹی و درمیانی صنعتیں" },
  commerce: { name: "محکمہ تجارت" },
  civilaviation: { name: "وزارت شہری ہوابازی" },
  shipping: { name: "وزارت بندرگاہیں، جہاز رانی و آبی گزرگاہیں" },
  textiles: { name: "وزارت ٹیکسٹائل" },
  youth: { name: "وزارت امورِ نوجوانان و کھیل" },
  culture: { name: "وزارت ثقافت" },
  statistics: { name: "وزارت شماریات و پروگرام نفاذ" },
  cic: { name: "مرکزی معلوماتی کمیشن" },
  "cbdt-cpc": { name: "مرکزی بورڈ برائے راست ٹیکس" },
  nhai: { name: "نیشنل ہائی وے اتھارٹی آف انڈیا" },
  "epfo-org": { name: "ایمپلائز پروویڈنٹ فنڈ آرگنائزیشن" },
  "st-revenue": { name: "ضلع کلکٹر / محکمہ محصولات (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "زمین اور محصولات کا ریکارڈ آپ کی ریاست کے محکمہ محصولات کے پاس ہوتا ہے۔ کوئی مرکزی پورٹل اسے حاصل نہیں کر سکتا۔" },
  "st-police": { name: "ریاستی پولیس (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "امن عامہ ریاست کا موضوع ہے۔ ایف آئی آر اور تھانے کا ریکارڈ آپ کی ریاستی پولیس کے پاس ہے۔" },
  "st-municipal": { name: "بلدیہ / شہری مقامی ادارہ (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "بلدیہ خدمات ریاستی قانون کے تحت آپ کے شہر یا قصبے کا ادارہ چلاتا ہے۔" },
  "st-transport": { name: "ریاستی ٹرانسپورٹ اتھارٹی / آر ٹی او (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "ڈرائیونگ لائسنس اور گاڑی کا اندراج آپ کا ریاستی آر ٹی او جاری کرتا ہے۔" },
  "st-ration": { name: "ریاستی خوراک و شہری رسد / راشن (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "مرکزی حکومت اناج مختص کرتی ہے؛ راشن کارڈ اور دکانیں آپ کی ریاست چلاتی ہے۔" },
  "st-electricity": { name: "ریاستی بجلی بورڈ / ڈسکوم (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "آپ کی بجلی تقسیم کرنے والی کمپنی ایک ریاستی ادارہ ہے۔" },
  "st-school": { name: "ریاستی محکمہ اسکولی تعلیم (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "ریاست کے چلائے اسکول اور ریاستی بورڈ آپ کے ریاستی محکمہ تعلیم کے ماتحت ہیں۔" },
  "st-health": { name: "ریاستی محکمہ صحت / ضلعی اسپتال (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "عوامی صحت کی فراہمی ریاست کا موضوع ہے؛ ضلعی سہولتیں ریاست چلاتی ہے۔" },
  "st-panchayat": { name: "گرام پنچایت / دیہی مقامی ادارہ (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "پنچایت کا ریکارڈ آپ کی ریاست کے پنچایتی راج محکمے کے تحت مقامی سطح پر رکھا جاتا ہے۔" },
  "st-irrigation": { name: "ریاستی آبپاشی / محکمہ تعمیراتِ عامہ (ریاستی)", redirectLabel: "آپ کا ریاستی معلوماتی کمیشن یا ریاستی آر ٹی آئی پورٹل", redirectNote: "ریاست کی سڑکیں، نہریں اور پی ڈبلیو ڈی کے کام آپ کی ریاستی حکومت کی ذمہ داری ہیں۔" },
};
