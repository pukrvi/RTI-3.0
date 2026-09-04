import Icon from "@/components/Icon";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { currentSession } from "@/lib/session";
import { getSignup } from "@/lib/signup";
import { startAadhaarSignup, startEmailSignup } from "../actions";

/**
 * Account creation, step 1: choose a way in.
 *
 * The same centred card as /login — same captcha row, same divider, same
 * full-width Aadhaar way in — so the two screens read as one family. Email
 * continues to an OTP code; Aadhaar continues to its own number capture.
 */
const CODES = ["A7X9B", "K4M2Q", "T8B3Z", "F6N9D", "P3W7A"];

export default async function SignupPage({
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
  // A half-finished sign-up resumes where it left off, never from the top.
  const pending = await getSignup();
  if (pending) {
    if (pending.method === "email" && pending.step === "code") redirect(`/${locale}/signup/code`);
    if (pending.method === "email" && pending.step === "verify") redirect(`/${locale}/signup/verify`);
    if (pending.step === "details") redirect(`/${locale}/signup/details`);
    if (pending.method === "aadhaar" && pending.step === "aadhaar")
      redirect(`/${locale}/signup/aadhaar`);
  }

  const code = CODES[Math.floor(Math.random() * CODES.length)];

  return (
    <main id="main">
      <div className="page auth-single">
        <div className="auth-single-inner">
          <div className="card auth-card">
            <div className="auth-head">
              <p className="muted small mb-0">{t("auth.signup.step", { n: 1, total: 4 })}</p>
              <h1 className="auth-title mb-0">{t("auth.signup.title")}</h1>
              <p className="muted mb-0">{t("auth.signup.sub")}</p>
            </div>

            <form action={startEmailSignup} className="mt-1">
              <input type="hidden" name="locale" value={locale} />
              <div className={`field ${error === "details" ? "field-error" : ""}`}>
                <label htmlFor="name">{t("auth.signup.name")}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={t("auth.signup.namePh")}
                  aria-invalid={error === "details" || undefined}
                />
              </div>

              <div className={`field ${error === "details" ? "field-error" : ""}`}>
                <label htmlFor="email">{t("auth.signup.email")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t("auth.signup.emailPh")}
                  aria-describedby={error === "details" ? "signup-error" : undefined}
                  aria-invalid={error === "details" || undefined}
                />
                {error === "details" && (
                  <p className="error-text" id="signup-error">
                    {t("auth.signup.detailsError")}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="captcha">{t("auth.login.security")}</label>
                <div className="captcha-row">
                  <input
                    type="text"
                    id="captcha"
                    name="captcha"
                    autoComplete="off"
                    placeholder={t("auth.login.captchaPh")}
                  />
                  <div className="captcha-code" aria-hidden="true">
                    {code.split("").join(" ")}
                  </div>
                  <Link
                    className="captcha-refresh"
                    href={`/${locale}/signup`}
                    aria-label={t("auth.login.refresh")}
                    title={t("auth.login.refresh")}
                  >
                    <Icon name="history" />
                  </Link>
                </div>
              </div>

              <button type="submit" className="btn btn-block">
                {t("auth.signup.continue")}
              </button>
            </form>

            <div className="auth-div" aria-hidden="true">
              {t("auth.login.or")}
            </div>

            <form action={startAadhaarSignup}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-secondary btn-block">
                <Icon name="id" />
                {t("auth.signup.aadhaarBtn")}
              </button>
            </form>

            <p className="create-line muted mb-0">
              {t("auth.signup.haveAccount")}{" "}
              <Link href={`/${locale}/login`}>{t("auth.signup.signin")}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
