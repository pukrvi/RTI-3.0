import Link from "next/link";
import FilingCard from "@/components/FilingCard";
import Icon from "@/components/Icon";
import { getT } from "@/i18n";
import { loadAccount } from "@/lib/account";
import { currentCase } from "@/lib/case";
import { currentSession } from "@/lib/session";
import { getProfile } from "@/lib/store";

/**
 * The dashboard.
 *
 * The live portal's version is six numbers in a 2×3 grid and nothing else — no
 * dates, no ordering, no marker on the filing that is two days from breaching
 * thirty. The six numbers are here, because people who have used the portal
 * look for them, but they sit below the two lists that matter: the most
 * recent filings first, then anything waiting on the citizen.
 *
 * Every list on this page speaks the track card's language, shows the two
 * most recent filings, and then stops: a view link in the heading leads to
 * the full list. Nothing here carries an action of its own — the way in is
 * always the card, and the appeal or reply it opens.
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const session = (await currentSession())!;

  const [{ items, counts }, draft, profile] = await Promise.all([
    loadAccount(session.contact, locale),
    currentCase(),
    getProfile(session.contact),
  ]);

  const attention = items.filter((i) => i.needsAction);
  const showDraft = draft && !draft.filed && draft.question;

  const countCard = (
    heading: string,
    c: { registered: number; disposed: number; pending: number },
  ) => (
    <div className="card count-card">
      <h3 className="mb-0">{heading}</h3>
      <dl className="counts">
        <div>
          <dt>{t("acct.dash.registered")}</dt>
          <dd>{c.registered}</dd>
        </div>
        <div>
          <dt>{t("acct.dash.disposed")}</dt>
          <dd>{c.disposed}</dd>
        </div>
        <div>
          <dt>{t("acct.dash.pending")}</dt>
          <dd>{c.pending}</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <>
      <div>
        <h1 className="mb-0">{t("acct.dash.h1")}</h1>
      </div>

      {showDraft && (
        <div className="callout callout-info">
          <p className="callout-title">{t("acct.new.draftTitle")}</p>
          <p lang={locale}>“{draft!.question}”</p>
          <p className="mb-0">
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/ask/chat`}>
              {t("acct.new.resume")}
            </Link>
          </p>
        </div>
      )}

      <section className="section" aria-labelledby="recent">
        <div className="card-head">
          <h2 id="recent">{t("acct.dash.recent")}</h2>
          {items.length > 0 && (
            <Link className="small" href={`/${locale}/account/history`}>
              {t("acct.dash.viewAll")}
            </Link>
          )}
        </div>
        {items.length === 0 ? (
          <div className="card">
            <p>{t("auth.account.empty")}</p>
            <p className="mb-0">
              <Link className="btn" href={`/${locale}/account/new`}>
                {t("auth.account.start")}
              </Link>
            </p>
          </div>
        ) : (
          <ul className="card-grid">
            {items.slice(0, 2).map((item) => (
              <FilingCard
                key={item.file.id}
                item={item}
                locale={locale}
                t={t}
                showMeter
              />
            ))}
          </ul>
        )}
      </section>

      <section className="section" aria-labelledby="attention">
        <div className="card-head">
          <h2 id="attention">{t("acct.dash.attention")}</h2>
          {attention.length > 0 && (
            <Link className="small" href={`/${locale}/account/track`}>
              {t("acct.dash.viewRequests")}
            </Link>
          )}
        </div>
        {attention.length === 0 ? (
          <div className="callout callout-ok">
            <p className="callout-title">
              <Icon name="check" />
              {t("acct.dash.attentionNone")}
            </p>
          </div>
        ) : (
          <ul className="card-grid">
            {attention.slice(0, 2).map((item) => (
              <FilingCard
                key={item.file.id}
                item={item}
                locale={locale}
                t={t}
                showMeter
              />
            ))}
          </ul>
        )}
      </section>

      <section className="section" aria-labelledby="counts">
        <h2 id="counts">{t("acct.dash.counts")}</h2>
        <div className="grid-2">
          {countCard(t("acct.dash.requests"), counts.requests)}
          {countCard(t("acct.dash.appeals"), counts.appeals)}
        </div>
      </section>

      <section className="section" aria-labelledby="details">
        <h2 id="details">
          {profile?.updatedAt ? t("acct.dash.profileEdit") : t("acct.dash.profilePrompt")}
        </h2>
        <div className={`callout ${profile?.updatedAt ? "callout-ok" : "callout-info"}`}>
          <p>
            {profile?.updatedAt ? t("acct.dash.profileDone") : t("acct.dash.profilePromptBody")}
          </p>
          <p className="mb-0">
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/account/profile`}>
              {profile?.updatedAt ? t("acct.dash.profileEdit") : t("acct.dash.profileCta")}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
