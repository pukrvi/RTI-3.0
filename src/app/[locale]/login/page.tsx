import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getT } from "@/i18n";
import { currentSession } from "@/lib/session";
import { startLogin } from "../actions";

/**
 * Login.
 *
 * One field. Not a username and a password, because there is no password to
 * forget and no account to create — the address you filed with is the address
 * the reply goes to, so it is the only handle that has to work.
 *
 * The panel beside it exists because "log in" on a government site usually
 * means "you cannot proceed without this". Here it means the opposite: filing
 * works signed out, and the honest cost of an account — a record of who asked
 * what — is stated on the same screen as the benefits.
 */
export default async function LoginPage({
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

  const benefits = ["auth.login.why1", "auth.login.why2", "auth.login.why3", "auth.login.why4"];

  return (
    <main id="main">
      <div className="page auth-grid">
        <div className="auth-main stack">
          <div>
            <h1 className="mb-0">{t("auth.login.h1")}</h1>
            <p className="muted">{t("auth.login.lead")}</p>
          </div>

          <form className="card auth-card" action={startLogin}>
            <input type="hidden" name="locale" value={locale} />
            <div className={`field ${error === "contact" ? "field-error" : ""}`}>
              <label htmlFor="contact">{t("auth.login.label")}</label>
              <span className="hint" id="contact-hint">
                {t("auth.login.methodNote")}
              </span>
              <input
                type="text"
                id="contact"
                name="contact"
                required
                autoComplete="username"
                inputMode="email"
                aria-describedby={`contact-hint${error === "contact" ? " contact-error" : ""}`}
                aria-invalid={error === "contact" || undefined}
              />
              {error === "contact" && (
                <p className="error-text" id="contact-error">
                  {t("auth.login.error")}
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-block">
              {t("auth.login.submit")}
            </button>

            <p className="auth-alt mb-0">
              <Link href={`/${locale}/ask`}>{t("auth.login.orFile")}</Link>
            </p>
          </form>
        </div>

        <aside className="auth-aside stack" aria-labelledby="why">
          <div className="card">
            <h2 id="why">{t("auth.login.why")}</h2>
            <ul className="tick-list mb-0">
              {benefits.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </div>

          <div className="callout callout-warn">
            <p className="callout-title">
              <Icon name="alert" />
              {t("auth.login.cost")}
            </p>
            <p className="mb-0 small">{t("auth.login.costBody")}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
