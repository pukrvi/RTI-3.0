import Icon from "@/components/Icon";
import { STATES } from "@/data/states";
import { getT, type Translate } from "@/i18n";
import { currentSession } from "@/lib/session";
import { DEMO_AADHAAR_IDENTITY, getSignup } from "@/lib/signup";
import { redirect } from "next/navigation";
import { completeSignup } from "../../actions";

/**
 * Sign-up, final step (both paths): personal + address details.
 *
 * The same fields as account information, in the same order, under the same
 * section names — a citizen who creates an account today and opens their
 * profile tomorrow meets the same form. Two differences, both labelled:
 *
 *   • citizenship is not asked — Aadhaar verified it on both paths, so it
 *     arrives as a badge, not a question.
 *   • the Aadhaar path arrives prefilled from the fetched identity; the
 *     email path arrives with only the name and email from step 1.
 */
function radios(
  t: Translate,
  name: string,
  value: string | undefined,
  options: Array<[string, string]>,
) {
  return (
    <div className="radio-row">
      {options.map(([key, label]) => (
        <label className="radio" key={key}>
          <input type="radio" name={name} value={key} defaultChecked={value === key} />
          <span>{t(label)}</span>
        </label>
      ))}
    </div>
  );
}

export default async function SignupDetailsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  if (await currentSession()) redirect(`/${locale}/account`);
  const pending = await getSignup();
  if (!pending || pending.step !== "details" || !pending.aadhaarVerified) {
    if (pending?.method === "email" && pending.step === "code") redirect(`/${locale}/signup/code`);
    if (pending?.method === "email" && pending.step === "verify")
      redirect(`/${locale}/signup/verify`);
    if (pending?.method === "aadhaar" && pending.step === "aadhaar")
      redirect(`/${locale}/signup/aadhaar`);
    redirect(`/${locale}/signup`);
  }

  const fromAadhaar = pending.method === "aadhaar";
  const stepLabel = t("auth.signup.step", { n: fromAadhaar ? 2 : 4, total: fromAadhaar ? 2 : 4 });
  const name = fromAadhaar ? DEMO_AADHAAR_IDENTITY.name : (pending.name ?? "");
  const email = pending.email ?? "";
  const addr1 = fromAadhaar ? DEMO_AADHAAR_IDENTITY.addr1 : "";
  const addr2 = fromAadhaar ? DEMO_AADHAAR_IDENTITY.addr2 : "";
  const pin = fromAadhaar ? DEMO_AADHAAR_IDENTITY.pin : "";
  const state = fromAadhaar ? DEMO_AADHAAR_IDENTITY.state : "";
  const gender = fromAadhaar ? DEMO_AADHAAR_IDENTITY.gender : undefined;

  return (
    <main id="main">
      <div className="wrap stack-lg">
        <div>
          <p className="muted small mb-0">{stepLabel}</p>
          <h1 className="mb-0">{t("auth.signup.details.h1")}</h1>
          <p className="muted">
            {fromAadhaar
              ? t("auth.signup.details.leadAadhaar")
              : t("auth.signup.details.leadEmail", {
                  name: pending.name ?? "",
                  email: pending.email ?? "",
                })}
          </p>
        </div>

        <div className="callout callout-ok" role="status">
          <p className="callout-title">
            <Icon name="check" />
            {t("auth.signup.details.verified", { last4: pending.aadhaarLast4 ?? "••••" })}
          </p>
          {fromAadhaar && <p className="mb-0 small">{t("auth.signup.details.fetched")}</p>}
        </div>

        <form action={completeSignup} className="stack-lg">
          <input type="hidden" name="locale" value={locale} />

          <fieldset className="card">
            <legend>{t("acct.profile.secPersonal")}</legend>

            <div className="form-row">
              <div className="field">
                <label htmlFor="name">{t("acct.profile.name")}</label>
                <input type="text" id="name" name="name" autoComplete="name" defaultValue={name} />
              </div>

              <div className="field">
                <label htmlFor="email">{t("acct.profile.email")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  defaultValue={email}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="mobile">{t("acct.profile.mobile")}</label>
                <input type="tel" id="mobile" name="mobile" inputMode="tel" autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="phone">
                  {t("acct.profile.phone")}{" "}
                  <span className="muted smaller">({t("common.optional")})</span>
                </label>
                <input type="tel" id="phone" name="phone" inputMode="tel" />
              </div>
            </div>

            <div className="form-row">
              <fieldset className="subset">
                <legend>{t("acct.profile.gender")}</legend>
                {radios(t, "gender", gender, [
                  ["male", "acct.profile.gender.male"],
                  ["female", "acct.profile.gender.female"],
                  ["third", "acct.profile.gender.third"],
                ])}
              </fieldset>

              <fieldset className="subset">
                <legend>{t("acct.profile.education")}</legend>
                {radios(t, "education", undefined, [
                  ["literate", "acct.profile.education.literate"],
                  ["illiterate", "acct.profile.education.illiterate"],
                ])}
              </fieldset>
            </div>

            <div className="form-row">
              <fieldset className="subset">
                <legend>{t("acct.profile.bpl")}</legend>
                {radios(t, "bpl", "no", [
                  ["yes", "acct.profile.bpl.yes"],
                  ["no", "acct.profile.bpl.no"],
                ])}
              </fieldset>
            </div>

            <div className="callout callout-mock bpl-details">
              <p className="callout-title">{t("acct.profile.bplWarn")}</p>
              <div className="form-row mt-1">
                <div className="field mb-0">
                  <label htmlFor="bplCard">{t("acct.profile.bplCard")}</label>
                  <input type="text" id="bplCard" name="bplCard" autoComplete="off" />
                </div>
                <div className="field mb-0">
                  <label htmlFor="bplYear">{t("acct.profile.bplYear")}</label>
                  <input type="text" id="bplYear" name="bplYear" inputMode="numeric" />
                </div>
              </div>
              <div className="field mb-0 mt-1">
                <label htmlFor="bplAuthority">{t("acct.profile.bplAuthority")}</label>
                <input type="text" id="bplAuthority" name="bplAuthority" />
              </div>
            </div>
          </fieldset>

          <fieldset className="card">
            <legend>{t("acct.profile.secAddress")}</legend>

            <div className="field">
              <label htmlFor="addr1">{t("acct.profile.addr1")}</label>
              <input
                type="text"
                id="addr1"
                name="addr1"
                autoComplete="address-line1"
                defaultValue={addr1}
              />
            </div>
            <div className="field">
              <label htmlFor="addr2">
                {t("acct.profile.addr2")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input
                type="text"
                id="addr2"
                name="addr2"
                autoComplete="address-line2"
                defaultValue={addr2}
              />
            </div>
            <div className="field">
              <label htmlFor="addr3">
                {t("acct.profile.addr3")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input type="text" id="addr3" name="addr3" autoComplete="address-line3" />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="pin">{t("acct.profile.pin")}</label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  defaultValue={pin}
                />
              </div>
              <div className="field">
                <label htmlFor="state">{t("acct.profile.state")}</label>
                <select id="state" name="state" defaultValue={state}>
                  <option value="">{t("acct.profile.statePick")}</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <fieldset className="subset">
                <legend>{t("acct.profile.country")}</legend>
                {radios(t, "country", "india", [
                  ["india", "acct.profile.country.india"],
                  ["other", "acct.profile.country.other"],
                ])}
              </fieldset>

              <fieldset className="subset">
                <legend>{t("acct.profile.habitation")}</legend>
                {radios(t, "habitation", undefined, [
                  ["rural", "acct.profile.habitation.rural"],
                  ["urban", "acct.profile.habitation.urban"],
                ])}
              </fieldset>
            </div>
          </fieldset>

          <div className="callout callout-mock callout-compact">
            <p className="mb-0 small">{t("auth.signup.details.mock")}</p>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn">
              {t("auth.signup.details.submit")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
