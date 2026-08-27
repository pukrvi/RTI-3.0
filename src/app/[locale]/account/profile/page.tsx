import Icon from "@/components/Icon";
import { STATES } from "@/data/states";
import { formatDate, getT, type Translate } from "@/i18n";
import { currentSession } from "@/lib/session";
import { getProfile, type Profile } from "@/lib/store";
import { saveProfile } from "../../actions";

/**
 * Account information.
 *
 * Every field the live RTI request form asks for, in the order it asks, with
 * three differences.
 *
 * It is asked once. The portal asks for all twelve personal fields on every
 * request and every appeal and remembers none of them, which on a phone is
 * several minutes of typing per filing.
 *
 * The labels say what they mean. `Status` on the live form offers `Rural` and
 * `Urban` with no explanation of what is being asked; `State` sits in the
 * applicant's address block where it is regularly mistaken for the government
 * the request is going to.
 *
 * And it asks for nothing it does not need. There is no Aadhaar field, no PAN
 * field, no card field and no password, because none of them is required to ask
 * a question of your own government.
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

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { saved } = await searchParams;
  const t = getT(locale);
  const session = (await currentSession())!;
  const p: Profile = (await getProfile(session.contact)) ?? {};

  return (
    <>
      <div>
        <h1 className="mb-0">{t("acct.profile.h1")}</h1>
        <p className="muted">{t("acct.profile.lead")}</p>
      </div>

      {saved && (
        <div className="callout callout-ok" role="status">
          <p className="callout-title">
            <Icon name="check" />
            {t("acct.profile.saved")}
          </p>
          {p.updatedAt && (
            <p className="mb-0 small">
              {t("acct.profile.savedAt", { date: formatDate(p.updatedAt, locale) })}
            </p>
          )}
        </div>
      )}

      <form action={saveProfile} className="stack-lg">
        <input type="hidden" name="locale" value={locale} />

        <fieldset className="card">
          <legend>{t("acct.profile.secPersonal")}</legend>

          <div className="field">
            <label htmlFor="name">{t("acct.profile.name")}</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              defaultValue={p.name ?? ""}
            />
          </div>

          <div className="field">
            <label htmlFor="email">{t("acct.profile.email")}</label>
            <span className="hint" id="email-hint">
              {t("acct.profile.emailHint")}
            </span>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              aria-describedby="email-hint"
              defaultValue={p.email ?? session.contact}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="mobile">{t("acct.profile.mobile")}</label>
              <span className="hint" id="mobile-hint">
                {t("acct.profile.mobileHint")}
              </span>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                inputMode="tel"
                autoComplete="tel"
                aria-describedby="mobile-hint"
                defaultValue={p.mobile ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">
                {t("acct.profile.phone")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                inputMode="tel"
                defaultValue={p.phone ?? ""}
              />
            </div>
          </div>

          <fieldset className="subset">
            <legend>{t("acct.profile.gender")}</legend>
            {radios(t, "gender", p.gender, [
              ["male", "acct.profile.gender.male"],
              ["female", "acct.profile.gender.female"],
              ["third", "acct.profile.gender.third"],
            ])}
          </fieldset>

          <fieldset className="subset">
            <legend>{t("acct.profile.education")}</legend>
            <p className="hint">{t("acct.profile.educationHint")}</p>
            {radios(t, "education", p.education, [
              ["literate", "acct.profile.education.literate"],
              ["illiterate", "acct.profile.education.illiterate"],
            ])}
          </fieldset>
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
              defaultValue={p.addr1 ?? ""}
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
              defaultValue={p.addr2 ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="addr3">
              {t("acct.profile.addr3")}{" "}
              <span className="muted smaller">({t("common.optional")})</span>
            </label>
            <input
              type="text"
              id="addr3"
              name="addr3"
              autoComplete="address-line3"
              defaultValue={p.addr3 ?? ""}
            />
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
                defaultValue={p.pin ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="state">{t("acct.profile.state")}</label>
              <span className="hint" id="state-hint">
                {t("acct.profile.stateHint")}
              </span>
              <select
                id="state"
                name="state"
                defaultValue={p.state ?? ""}
                aria-describedby="state-hint"
              >
                <option value="">{t("acct.profile.statePick")}</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="subset">
            <legend>{t("acct.profile.country")}</legend>
            {radios(t, "country", p.country ?? "india", [
              ["india", "acct.profile.country.india"],
              ["other", "acct.profile.country.other"],
            ])}
          </fieldset>

          <fieldset className="subset">
            <legend>{t("acct.profile.habitation")}</legend>
            <p className="hint">{t("acct.profile.habitationHint")}</p>
            {radios(t, "habitation", p.habitation, [
              ["rural", "acct.profile.habitation.rural"],
              ["urban", "acct.profile.habitation.urban"],
            ])}
          </fieldset>
        </fieldset>

        <fieldset className="card">
          <legend>{t("acct.profile.secEligibility")}</legend>

          <fieldset className="subset">
            <legend>{t("acct.profile.citizenship")}</legend>
            <p className="hint">{t("acct.profile.citizenshipHint")}</p>
            {radios(t, "citizenship", p.citizenship ?? "indian", [
              ["indian", "acct.profile.citizenship.indian"],
              ["other", "acct.profile.citizenship.other"],
            ])}
            {p.citizenship === "other" && (
              <p className="error-text">{t("acct.profile.citizenshipWarn")}</p>
            )}
          </fieldset>

          <fieldset className="subset">
            <legend>{t("acct.profile.bpl")}</legend>
            <p className="hint">{t("acct.profile.bplHint")}</p>
            {radios(t, "bpl", p.bpl ?? "no", [
              ["yes", "acct.profile.bpl.yes"],
              ["no", "acct.profile.bpl.no"],
            ])}
          </fieldset>

          <div className="callout callout-mock">
            <p className="callout-title">{t("acct.profile.bplWarn")}</p>
            <div className="form-row mt-1">
              <div className="field mb-0">
                <label htmlFor="bplCard">{t("acct.profile.bplCard")}</label>
                <input
                  type="text"
                  id="bplCard"
                  name="bplCard"
                  autoComplete="off"
                  defaultValue={p.bplCard ?? ""}
                />
              </div>
              <div className="field mb-0">
                <label htmlFor="bplYear">{t("acct.profile.bplYear")}</label>
                <input
                  type="text"
                  id="bplYear"
                  name="bplYear"
                  inputMode="numeric"
                  defaultValue={p.bplYear ?? ""}
                />
              </div>
            </div>
            <div className="field mb-0 mt-1">
              <label htmlFor="bplAuthority">{t("acct.profile.bplAuthority")}</label>
              <input
                type="text"
                id="bplAuthority"
                name="bplAuthority"
                defaultValue={p.bplAuthority ?? ""}
              />
            </div>
          </div>
        </fieldset>

        <div className="btn-row">
          <button type="submit" className="btn">
            {t("acct.profile.save")}
          </button>
          {p.updatedAt && (
            <span className="small muted">
              {t("acct.profile.savedAt", { date: formatDate(p.updatedAt, locale) })}
            </span>
          )}
        </div>
      </form>

      <div className="grid-2">
        <section className="callout callout-info">
          <h2 className="callout-title">{t("acct.profile.useIt")}</h2>
          <p className="mb-0">{t("acct.profile.useItBody")}</p>
        </section>
        <section className="callout callout-ok">
          <h2 className="callout-title">
            <Icon name="check" />
            {t("acct.profile.noIds")}
          </h2>
          <p className="mb-0">{t("acct.profile.noIdsBody")}</p>
        </section>
      </div>
    </>
  );
}
