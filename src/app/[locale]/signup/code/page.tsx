import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { currentSession } from "@/lib/session";
import { getSignup } from "@/lib/signup";
import { verifySignupCode } from "../../actions";

/**
 * Sign-up step 2 (email path): the OTP code.
 *
 * Same six-digit demo contract as /login/code — nothing generated, nothing
 * sent, any six digits accepted — in the centred sign-up card instead of the
 * login grid, so the flow never changes shape mid-way.
 */
export default async function SignupCodePage({
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
  if (pending.step === "details") redirect(`/${locale}/signup/details`);
  if (pending.step === "verify") redirect(`/${locale}/signup/verify`);

  return (
    <main id="main">
      <div className="page auth-single">
        <div className="auth-single-inner">
          <div className="card auth-card">
            <div className="auth-head">
              <p className="muted small mb-0">{t("auth.signup.step", { n: 2, total: 4 })}</p>
              <h1 className="auth-title mb-0">{t("auth.signup.code.h1")}</h1>
              <p className="muted mb-0">{t("auth.signup.code.lead", { contact: pending.email ?? "" })}</p>
            </div>

            <div className="demo-box mt-1">
              <p className="mb-0">{t("auth.signup.code.mock")}</p>
            </div>

            <form action={verifySignupCode} className="mt-1">
              <input type="hidden" name="locale" value={locale} />
              <div className={`field ${error === "code" ? "field-error" : ""}`}>
                <label htmlFor="code">{t("auth.code.label")}</label>
                <span className="hint" id="code-hint">
                  {t("auth.code.hint")}
                </span>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="\d{6}"
                  className="otp"
                  aria-describedby={`code-hint${error === "code" ? " code-error" : ""}`}
                  aria-invalid={error === "code" || undefined}
                />
                {error === "code" && (
                  <p className="error-text" id="code-error">
                    {t("auth.code.error")}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-block">
                {t("auth.signup.code.submit")}
              </button>

              <p className="auth-alt mb-0">
                <Link href={`/${locale}/signup`}>{t("auth.code.change")}</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
