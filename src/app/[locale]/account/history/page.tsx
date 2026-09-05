import Link from "next/link";
import { formatDate, getT } from "@/i18n";
import { loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";

/**
 * View history.
 *
 * The live portal reaches this through an email address, a mobile number, a
 * captcha and a one-time code sent to email only — and it demands the mobile
 * number that was used at filing time, which the filing form marks optional.
 * A citizen who left it blank cannot see their own history at all.
 *
 * Requests and their appeals are one row each rather than two separate
 * lookups, because they are one case.
 */
export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const session = (await currentSession())!;
  const { items } = await loadAccount(session.contact, locale);

  const status = (item: (typeof items)[number]) =>
    item.file.appeal
      ? t("auth.account.appealed")
      : item.file.deleted
        ? t("track.status.withdrawn")
        : item.file.reply?.kind === "refused"
          ? t("track.status.refused")
          : item.clock.state === "replied"
            ? t("track.status.replied")
            : item.clock.state === "overdue"
              ? t("track.status.overdue")
              : t("track.status.waiting");

  return (
    <>
      <div>
        <h1 className="mb-0">{t("acct.history.h1")}</h1>
      </div>

      {items.length === 0 ? (
        <div className="card">
          <p className="mb-0">{t("acct.history.none")}</p>
        </div>
      ) : (
        /* Focusable and named, so a keyboard user can scroll it sideways on a
           narrow screen without a pointer. */
        <div
          className="tablewrap"
          role="region"
          aria-label={t("acct.history.caption")}
          tabIndex={0}
        >
          <table className="data">
            <caption className="visually-hidden">{t("acct.history.caption")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("acct.history.colRef")}</th>
                <th scope="col">{t("acct.history.colSubject")}</th>
                <th scope="col">{t("acct.history.colFiled")}</th>
                <th scope="col">{t("acct.history.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.file.id}>
                  <th scope="row">
                    <Link className="refno" href={`/${locale}/account/track/${item.file.id}`}>
                      {item.file.filed?.ref}
                    </Link>
                    {item.file.appeal && (
                      <span className="sub">
                        {t("acct.history.appealRow")}: {item.file.appeal.ref}
                      </span>
                    )}
                  </th>
                  <td lang={locale}>
                    {item.file.subject}
                    {item.authority && <span className="sub">{item.authority}</span>}
                  </td>
                  <td>
                    <time dateTime={item.file.filed?.at}>
                      {item.file.filed && formatDate(item.file.filed.at, locale)}
                    </time>
                  </td>
                  <td>{status(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
