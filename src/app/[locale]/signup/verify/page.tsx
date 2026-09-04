import Icon from "@/components/Icon";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { currentSession } from "@/lib/session";
import { getSignup } from "@/lib/signup";
import { verifySignupAadhaar } from "../../actions";

/**
 * Sign-up step 3 (email path): the mandatory one-time Aadhaar check.
 *
 * Section 3 of the RTI Act limits the right to citizens of India; this screen
 * is where the email path proves it. Same 12-digit demo contract as the
 * Aadhaar path — any 12 digits verify, only the last 4 are kept — so the two
 * paths match step for step from here on.
 */
export default async function SignupVerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = getT(locale);

  if (await currentSession()) redirect(`/${locale}/account`);
  const pending = await getSignup();
  if (!pending || pending.method !== "email") redirect(`/${locale}/signup`);
  if (pending.step === "code") redirect(`/${locale}/signup/code`);
  if (pending.step === "details") redirect(`/${locale}/signup/details`);

  return (
    <main id="main">
      <div className="page auth-single">
        <div className="auth-single-inner">
          <div className="card auth-card">
            <div className="auth-head">
              <p className="muted small mb-0">{t("auth.signup.step", { n: 3, total: 4 })}</p>
              <h1 className="auth-title mb-0">{t("auth.signup.verify.h1")}</h1>
              <p className="muted mb-0">{t("auth.signup.verify.lead")}</p>
            </div>

            <div className="demo-box mt-1">
              <p className="mb-0">{t("auth.signup.verify.mock")}</p>
            </div>

            <form action={verifySignupAadhaar} className="mt-1">
              <input type="hidden" name="locale" value={locale} />
              <div className={`field ${error === "aadhaar" ? "field-error" : ""}`}>
                <label htmlFor="aadhaar">{t("auth.signup.aadhaar")}</label>
                <span className="hint" id="aadhaar-hint">
                  {t("auth.signup.aadhaarHint")}
                </span>
                <input
                  type="text"
                  id="aadhaar"
                  name="aadhaar"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={14}
                  placeholder={t("auth.signup.aadhaarPh")}
                  aria-describedby={`aadhaar-hint${error === "aadhaar" ? " aadhaar-error" : ""}`}
                  aria-invalid={error === "aadhaar" || undefined}
                />
                {error === "aadhaar" && (
                  <p className="error-text" id="aadhaar-error">
                    {t("auth.signup.aadhaarError")}
                  </p>
                )}
              </div>

              <div className={`field ${error === "consent" ? "field-error" : ""}`}>
                <div className="choice">
                  <input type="checkbox" id="consent" name="consent" value="1" />
                  <label htmlFor="consent">{t("auth.signup.consent")}</label>
                </div>
                {error === "consent" && (
                  <p className="error-text" id="consent-error">
                    {t("auth.signup.consentError")}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-block">
                <Icon name="id" />
                {t("auth.signup.verifySubmit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
