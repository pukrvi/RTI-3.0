import AppealReadyCard from "@/components/AppealReadyCard";
import FilingCard from "@/components/FilingCard";
import { getT } from "@/i18n";
import { appealable, loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";

/**
 * File appeal.
 *
 * On the live portal this is a top-level menu item that opens a lookup asking
 * for the registration number, the email address and a captcha — and nothing on
 * any status screen tells the citizen that an appeal is possible, or that the
 * window shuts thirty days after the decision. Here the appeals that can be
 * filed today are simply listed, with the closing date on each one.
 *
 * Both lists reuse the track card's anatomy: a request ready to appeal points
 * at the appeal form, one already filed points back at its status page. The
 * grounds and the explanation live on the form itself, not on the cards.
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
      </div>

      <section className="section" aria-labelledby="ready">
        <h2 id="ready">{t("acct.appeals.ready")}</h2>
        {ready.length === 0 ? (
          <div className="card">
            <p>{t("acct.appeals.none")}</p>
            <p className="mb-0 small muted">{t("acct.appeals.noneBody")}</p>
          </div>
        ) : (
          <ul className="card-grid">
            {ready.map((item) => (
              <AppealReadyCard
                key={item.file.id}
                item={item}
                locale={locale}
                t={t}
              />
            ))}
          </ul>
        )}
      </section>

      {filed.length > 0 && (
        <section className="section" aria-labelledby="filed">
          <h2 id="filed">{t("acct.appeals.filedTitle")}</h2>
          <ul className="card-grid">
            {filed.map((item) => (
              <FilingCard
                key={item.file.id}
                item={item}
                locale={locale}
                t={t}
                showMeter
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
