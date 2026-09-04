import Icon from "@/components/Icon";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { currentSession } from "@/lib/session";
import { getSignup } from "@/lib/signup";
import { fetchAadhaarIdentity } from "../../actions";

/**
 * Sign-up via Aadhaar: the number capture.
 *
 * On this path the handoff IS the verification — a valid number skips both
 * the OTP and the separate citizenship check and lands on the details step
 * with the fetched identity prefilled. Same card, same demo contract, same
 * consent as the email path's verify screen.
 */
export default async function SignupAadhaarPage({
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
  if (!pending || pending.method !== "aadhaar") redirect(`/${locale}/signup`);
  if (pending.step === "details") redirect(`/${locale}/signup/details`);

  return (
    <main id="main">
      <div className="page auth-single">
        <div className="auth-single-inner">
          <div className="card auth-card">
            <div className="auth-head">
              <p className="muted small mb-0">{t("auth.signup.step", { n: 1, total: 2 })}</p>
              <h1 className="auth-title mb-0">{t("auth.signup.ad.h1")}</h1>
              <p className="muted mb-0">{t("auth.signup.ad.lead")}</p>
            </div>

            <div className="demo-box mt-1">
              <p className="mb-0">{t("auth.signup.ad.mock")}</p>
            </div>

            <form action={fetchAadhaarIdentity} className="mt-1">
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
                {t("auth.signup.ad.submit")}
              </button>

              <p className="auth-alt mb-0">
                <Link href={`/${locale}/signup`}>{t("auth.signup.continue")} · email</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
