import Link from "next/link";
import { formatDate, getT } from "@/i18n";
import { appealable, loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";

const GROUNDS = ["no-response", "refused", "incomplete", "fee", "other"] as const;

/**
 * File appeal.
 *
 * On the live portal this is a top-level menu item that opens a lookup asking
 * for the registration number, the email address and a captcha — and nothing on
 * any status screen tells the citizen that an appeal is possible, or that the
 * window shuts thirty days after the decision. Here the appeals that can be
 * filed today are simply listed, with the closing date on each one.
 */
export default async function AppealsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const session = (await currentSession())!;
  const { items } = await loadAccount(session.contact, locale);

  const ready = appealable(items);
  const filed = items.filter((i) => i.file.appeal);

  return (
    <>
      <div>
        <h1 className="mb-0">{t("acct.appeals.h1")}</h1>
        <p className="muted">{t("acct.appeals.lead")}</p>
      </div>

      <section className="section" aria-labelledby="ready">
        <h2 id="ready">{t("acct.appeals.ready")}</h2>
        {ready.length === 0 ? (
          <div className="card">
            <p>{t("acct.appeals.none")}</p>
            <p className="mb-0 small muted">{t("acct.appeals.noneBody")}</p>
          </div>
        ) : (
          <>
            <p className="small muted">{t("acct.appeals.readyNote")}</p>
            <ul className="result-list">
              {ready.map((item) => (
                <li className="card filing" key={item.file.id}>
                  <div className="card-head">
                    <h3 className="mb-0 refno">{item.file.filed?.ref}</h3>
                    <span className="badge badge-warn">
                      {t("acct.appeals.window", {
                        date: formatDate(item.window.closes!, locale),
                        n: item.window.daysLeft,
                      })}
                    </span>
                  </div>
                  <p className="mb-0" lang={locale}>
                    {item.file.subject}
                  </p>
                  <p className="small">
                    {item.window.reason === "overdue"
                      ? t("track.appealWhyOverdue")
                      : t("track.appealWhyReplied")}
                  </p>
                  <p className="mb-0">
                    <Link className="btn btn-sm" href={`/${locale}/appeal/${item.file.id}`}>
                      {t("acct.appeals.start")}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {filed.length > 0 && (
        <section className="section" aria-labelledby="filed">
          <h2 id="filed">{t("acct.appeals.filedTitle")}</h2>
          <ul className="result-list">
            {filed.map((item) => (
              <li className="card filing" key={item.file.id}>
                <div className="card-head">
                  <h3 className="mb-0 refno">{item.file.appeal!.ref}</h3>
                  <span className="badge badge-info">{t("auth.account.appealed")}</span>
                </div>
                <p className="mb-0" lang={locale}>
                  {item.file.subject}
                </p>
                <p className="small muted">
                  {t("track.appealFiled", {
                    ref: item.file.appeal!.ref,
                    date: formatDate(item.file.appeal!.at, locale),
                  })}
                </p>
                <p className="mb-0">
                  <Link
                    className="btn btn-secondary btn-sm"
                    href={`/${locale}/track/${item.file.id}`}
                  >
                    {t("auth.account.open")}
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section" aria-labelledby="grounds">
        <h2 id="grounds">{t("acct.appeals.grounds")}</h2>
        <ul className="card step-list">
          {GROUNDS.map((g) => (
            <li key={g}>{t(`appeal.ground.${g}`)}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
