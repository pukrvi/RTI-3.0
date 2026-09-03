/**
 * Gujarati names for public authorities.
 *
 * Same drop-in pattern as `subjects.hi.ts`: keyed by authority id from
 * `src/data/authorities.ts`. `name` translates the authority's `name`; the ten
 * `st-*` State entries additionally carry `redirectLabel` and `redirectNote`,
 * translating `redirect.label` and `redirect.note`. Anything missing falls
 * back to English at render time.
 */
export const AUTHORITY_NAMES_GU: Record<
  string,
  { name: string; redirectLabel?: string; redirectNote?: string }
> = {
  dopt: { name: "કાર્મિક અને તાલીમ વિભાગ" },
  mha: { name: "ગૃહ મંત્રાલય" },
  mea: { name: "વિદેશ મંત્રાલય" },
  morth: { name: "માર્ગ પરિવહન અને ધોરીમાર્ગ મંત્રાલય" },
  railways: { name: "રેલવે મંત્રાલય" },
  "mof-revenue": { name: "મહેસૂલ વિભાગ" },
  "mof-expenditure": { name: "ખર્ચ વિભાગ" },
  dfs: { name: "નાણાકીય સેવાઓ વિભાગ" },
  health: { name: "આરોગ્ય અને પરિવાર કલ્યાણ મંત્રાલય" },
  "education-school": { name: "શાળા શિક્ષણ અને સાક્ષરતા વિભાગ" },
  "education-higher": { name: "ઉચ્ચ શિક્ષણ વિભાગ" },
  rural: { name: "ગ્રામીણ વિકાસ મંત્રાલય" },
  agri: { name: "કૃષિ અને ખેડૂત કલ્યાણ વિભાગ" },
  food: { name: "ખાદ્ય અને જાહેર વિતરણ વિભાગ" },
  consumer: { name: "ગ્રાહક બાબતો વિભાગ" },
  labour: { name: "શ્રમ અને રોજગાર મંત્રાલય" },
  wcd: { name: "મહિલા અને બાળ વિકાસ મંત્રાલય" },
  sj: { name: "સામાજિક ન્યાય અને અધિકારિતા વિભાગ" },
  tribal: { name: "આદિજાતિ બાબતો મંત્રાલય" },
  housing: { name: "આવાસ અને શહેરી બાબતો મંત્રાલય" },
  jal: { name: "પેયજળ અને સ્વચ્છતા વિભાગ" },
  power: { name: "વીજ મંત્રાલય" },
  petroleum: { name: "પેટ્રોલિયમ અને કુદરતી ગેસ મંત્રાલય" },
  telecom: { name: "દૂરસંચાર વિભાગ" },
  meity: { name: "ઇલેક્ટ્રોનિક્સ અને માહિતી ટેકનોલોજી મંત્રાલય" },
  defence: { name: "સંરક્ષણ મંત્રાલય" },
  environment: { name: "પર્યાવરણ, વન અને આબોહવા પરિવર્તન મંત્રાલય" },
  coal: { name: "કોલસા મંત્રાલય" },
  msme: { name: "સૂક્ષ્મ, લઘુ અને મધ્યમ ઉદ્યમ મંત્રાલય" },
  commerce: { name: "વાણિજ્ય વિભાગ" },
  civilaviation: { name: "નાગરિક ઉડ્ડયન મંત્રાલય" },
  shipping: { name: "બંદર, જહાજ પરિવહન અને જળમાર્ગ મંત્રાલય" },
  textiles: { name: "વસ્ત્ર મંત્રાલય" },
  youth: { name: "યુવા બાબતો અને રમતગમત મંત્રાલય" },
  culture: { name: "સંસ્કૃતિ મંત્રાલય" },
  statistics: { name: "આંકડાશાસ્ત્ર અને કાર્યક્રમ અમલીકરણ મંત્રાલય" },
  cic: { name: "કેન્દ્રીય માહિતી આયોગ" },
  "cbdt-cpc": { name: "કેન્દ્રીય પ્રત્યક્ષ કર બોર્ડ" },
  nhai: { name: "ભારતીય રાષ્ટ્રીય ધોરીમાર્ગ સત્તામંડળ" },
  "epfo-org": { name: "કર્મચારી ભવિષ્ય નિધિ સંગઠન" },
  "st-revenue": { name: "જિલ્લા કલેક્ટર / મહેસૂલ વિભાગ (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "જમીન અને મહેસૂલ રેકોર્ડ તમારા રાજ્યના મહેસૂલ વિભાગ પાસે હોય છે. કોઈ કેન્દ્રીય પોર્ટલ તે મેળવી આપી શકે નહીં." },
  "st-police": { name: "રાજ્ય પોલીસ (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "કાયદો અને વ્યવસ્થા રાજ્યનો વિષય છે. FIR અને પોલીસ સ્ટેશનના રેકોર્ડ તમારી રાજ્ય પોલીસ પાસે છે." },
  "st-municipal": { name: "નગરપાલિકા / શહેરી સ્થાનિક સંસ્થા (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "નગરપાલિકા સેવાઓ રાજ્ય કાયદા હેઠળ તમારા શહેર કે કસબાની સંસ્થા ચલાવે છે." },
  "st-transport": { name: "રાજ્ય પરિવહન સત્તામંડળ / RTO (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "ડ્રાઇવિંગ લાઇસન્સ અને વાહન નોંધણી તમારા રાજ્યના RTO જારી કરે છે." },
  "st-ration": { name: "રાજ્ય ખાદ્ય અને નાગરિક પુરવઠા / રેશન (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "કેન્દ્ર સરકાર અનાજ ફાળવે છે; રેશન કાર્ડ અને દુકાનો તમારું રાજ્ય ચલાવે છે." },
  "st-electricity": { name: "રાજ્ય વીજળી બોર્ડ / DISCOM (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "તમારી વીજ વિતરણ કંપની રાજ્યનું સાહસ છે." },
  "st-school": { name: "રાજ્ય શાળા શિક્ષણ વિભાગ (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "રાજ્ય સંચાલિત શાળાઓ અને રાજ્ય બોર્ડ તમારા રાજ્ય શિક્ષણ વિભાગ હેઠળ આવે છે." },
  "st-health": { name: "રાજ્ય આરોગ્ય વિભાગ / જિલ્લા હોસ્પિટલ (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "જાહેર આરોગ્ય સેવા રાજ્યનો વિષય છે; જિલ્લા સુવિધાઓ રાજ્ય સંચાલિત છે." },
  "st-panchayat": { name: "ગ્રામ પંચાયત / ગ્રામીણ સ્થાનિક સંસ્થા (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "પંચાયત રેકોર્ડ તમારા રાજ્યના પંચાયતી રાજ વિભાગ હેઠળ સ્થાનિક સ્તરે રાખવામાં આવે છે." },
  "st-irrigation": { name: "રાજ્ય સિંચાઈ / જાહેર બાંધકામ વિભાગ (રાજ્ય)", redirectLabel: "તમારું રાજ્ય માહિતી આયોગ કે રાજ્ય RTI પોર્ટલ", redirectNote: "રાજ્યના રસ્તા, નહેરો અને જાહેર બાંધકામ તમારી રાજ્ય સરકારની જવાબદારી છે." },
};
