import Link from "next/link";
import Icon from "@/components/Icon";
import PrintButton from "@/components/PrintButton";
import { formatDate, getT } from "@/i18n";
import { REPLY_DAYS } from "@/lib/deadline";
import { caseAuthorityLabel, currentCase } from "@/lib/case";
import { currentSession } from "@/lib/session";

/**
 * The confirmation screen — the last page of the journey.
 *
 * The live portal ends a filing on a printed acknowledgement the citizen has
 * to go and find again. Here the registration number, the deadline it starts,
 * and the route to the appeal that follows it all live on the one screen the
 * citizen lands on the moment the payment is confirmed.
 */
export default async function FiledConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const file = await currentCase();
  if (!file?.filed) {
    return (
      <main id="main">
        <div className="wrap stack">
          <h1>{t("file.doneH1")}</h1>
          <div className="callout callout-warn">
            <p className="mb-0">{t("track.nothingHere")}</p>
          </div>
          <p>
            <Link className="btn" href={`/${locale}/file`}>
              {t("file.h1")}
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const authority = caseAuthorityLabel(file, locale);
  const session = await currentSession();
  const due = new Date(
    new Date(file.filed.at).getTime() + REPLY_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  return (
    <main id="main">
      <div className="wrap stack-lg">
        <div className="callout callout-ok" role="status">
          <h1 className="callout-title">
            <Icon name="check" /> {t("file.doneH1")}
          </h1>
          <p className="mb-0">{t("file.doneLead")}</p>
        </div>

        <section className="card" aria-labelledby="done-reg">
          <div className="card-head">
            <h2 id="done-reg" className="mb-0">
              {t("track.regNo")}
            </h2>
          </div>
          <p className="refno">{file.filed.ref}</p>
          <dl className="kv">
            <div>
              <dt>{t("track.filedOn")}</dt>
              <dd>{formatDate(file.filed.at, locale)}</dd>
            </div>
            <div>
              <dt>{t("track.with")}</dt>
              <dd lang="en">{authority}</dd>
            </div>
            <div>
              <dt>{t("track.subject")}</dt>
              <dd lang={locale}>{file.subject}</dd>
            </div>
          </dl>
        </section>

        <div className="callout callout-info">
          <p className="mb-0">
            {t("file.doneNote", {
              days: REPLY_DAYS,
              date: formatDate(due, locale),
            })}
          </p>
        </div>

        <div className="btn-row no-print">
          <Link className="btn" href={`/${locale}/track/${file.id}`}>
            {t("file.doneTrack")}
          </Link>
          {session && (
            <Link className="btn btn-secondary" href={`/${locale}/account`}>
              {t("auth.account")}
            </Link>
          )}
          <PrintButton label={t("track.print")} />
          <Link className="btn btn-quiet" href={`/${locale}`}>
            {t("file.doneHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
