import Icon from "@/components/Icon";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { currentSession } from "@/lib/session";
import { safeNext } from "@/lib/redirect";
import { signInWithPassword, startAadhaarLogin } from "../actions";

/**
 * Login, after the LOGIN 2 design: one centred card, the heading inside it,
 * a demo hint box, username and password capture, an illustrative security
 * check, a full-width primary action, a divider, and a full-width Aadhaar
 * way in where the design holds DigiLocker.
 *
 * What the design sketches but this prototype has no infrastructure for —
 * real passwords, a checked captcha, a UIDAI handoff, a registration screen,
 * password recovery — stays a labelled demo: anything signs in, the password
 * is discarded unread, the code is decorative, and the two links with no
 * destination stay on honest ground (help for a forgotten password; the form
 * itself for an account, since first sign-in creates it).
 */
const CODES = ["A7X9B", "K4M2Q", "T8B3Z", "F6N9D", "P3W7A"];

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { error, next } = await searchParams;
  const t = getT(locale);

  const rawNext = typeof next === "string" ? next : "";
  const dest = rawNext ? safeNext(rawNext, locale) : `/${locale}/account`;
  if (await currentSession()) redirect(dest);

  const code = CODES[Math.floor(Math.random() * CODES.length)];
  const needsLoginToFile = dest.includes("/file") || dest.includes("/pay");

  return (
    <main id="main">
      <div className="page auth-single">
        <div className="auth-single-inner">
          <div className="card auth-card">
            <div className="auth-head">
              <h1 className="auth-title mb-0">{t("auth.login.title")}</h1>
              <p className="muted mb-0">{t("auth.login.sub")}</p>
            </div>

            <div className="demo-box mt-1">
              <p className="mb-0">{t("auth.login.demo")}</p>
            </div>

            {needsLoginToFile && (
              <div className="callout callout-info mt-1" role="note">
                <p className="mb-0">{t("auth.login.requiredToFile")}</p>
              </div>
            )}

            <form action={signInWithPassword} className="mt-1">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={dest} />
              <div className={`field ${error === "contact" ? "field-error" : ""}`}>
                <label htmlFor="contact">{t("auth.login.email")}</label>
                <input
                  type="email"
                  id="contact"
                  name="contact"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t("auth.login.emailPh")}
                  aria-describedby={error === "contact" ? "contact-error" : undefined}
                  aria-invalid={error === "contact" || undefined}
                />
                {error === "contact" && (
                  <p className="error-text" id="contact-error">
                    {t("auth.login.emailError")}
                  </p>
                )}
              </div>

              <div className="field">
                <div className="pass-row">
                  <label htmlFor="password">{t("auth.login.password")}</label>
                  <Link href={`/${locale}/help`}>{t("auth.login.forgot")}</Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder={t("auth.login.passwordPh")}
                />
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
                    href={rawNext ? `/${locale}/login?next=${encodeURIComponent(dest)}` : `/${locale}/login`}
                    aria-label={t("auth.login.refresh")}
                    title={t("auth.login.refresh")}
                  >
                    <Icon name="history" />
                  </Link>
                </div>
              </div>

              <button type="submit" className="btn btn-block">
                {t("auth.login.signin")}
              </button>
            </form>

            <div className="auth-div" aria-hidden="true">
              {t("auth.login.or")}
            </div>

            <form action={startAadhaarLogin}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={dest} />
              <button type="submit" className="btn btn-secondary btn-block">
                <Icon name="id" />
                {t("auth.login.aadhaar")}
              </button>
            </form>

            <p className="create-line muted mb-0">
              {t("auth.login.newHere")}{" "}
              <Link href={rawNext ? `/${locale}/signup?next=${encodeURIComponent(dest)}` : `/${locale}/signup`}>{t("auth.login.createAccount")}</Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
