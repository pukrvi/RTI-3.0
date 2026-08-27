import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { currentSession, pendingSession } from "@/lib/session";
import { verifyCode } from "../../actions";

/**
 * The one-time code screen.
 *
 * No code is generated, none is sent, and any six digits are accepted — this is
 * a demonstration of the step, not an implementation of it. The brief forbids
 * handling real OTP data, and a realistic-looking fake one-time code is not
 * meaningfully safer than a real one.
 *
 * Worth noting what the live portal does here: it demands a mobile number, then
 * says `(Received in Email ONLY)`. The mobile number is a second secret to
 * match against, not a delivery channel, and a citizen who left it blank when
 * filing — where it is optional — can never get past this screen.
 */
export default async function CodePage({
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
  const pending = await pendingSession();
  if (!pending) redirect(`/${locale}/login`);

  return (
    <main id="main">
      <div className="page auth-grid auth-grid-single">
        <div className="auth-main stack">
          <div>
            <h1 className="mb-0">{t("auth.code.h1")}</h1>
            <p className="muted">{t("auth.code.lead", { contact: pending.contact })}</p>
          </div>

          <form className="card auth-card" action={verifyCode}>
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
              {t("auth.code.submit")}
            </button>

            <p className="auth-alt mb-0">
              <Link href={`/${locale}/login`}>{t("auth.code.change")}</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
