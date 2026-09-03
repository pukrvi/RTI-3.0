import FilingCard from "@/components/FilingCard";
import { getT } from "@/i18n";
import { loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";
import { lookupByRef } from "../../actions";

/**
 * Track status.
 *
 * Two lists and one lookup box. The live portal's equivalent is a screen that
 * asks for a registration number, the email address it was filed with, and a
 * captcha, and then shows exactly one filing — and it shares its title,
 * `Online RTI Status Form`, with four other screens.
 */
export default async function TrackStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = getT(locale);
  const session = (await currentSession())!;
  const { items } = await loadAccount(session.contact, locale);

  const open = items.filter(
    (i) => i.clock.state !== "replied" && !i.file.appeal && !i.file.deleted,
  );
  const closed = items.filter(
    (i) => i.clock.state === "replied" || i.file.appeal || i.file.deleted,
  );

  return (
    <>
      <div>
        <h1 className="mb-0">{t("acct.track.h1")}</h1>
      </div>

      <section className="section" aria-labelledby="open">
        <h2 id="open">{t("acct.track.open")}</h2>
        {open.length === 0 ? (
          <div className="card">
            <p className="mb-0">{t("acct.track.none")}</p>
          </div>
        ) : (
          <ul className="result-list">
            {open.map((item) => (
              <FilingCard key={item.file.id} item={item} locale={locale} t={t} showMeter />
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <section className="section" aria-labelledby="closed">
          <h2 id="closed">{t("acct.track.closed")}</h2>
          <ul className="result-list">
            {closed.map((item) => (
              <FilingCard key={item.file.id} item={item} locale={locale} t={t} />
            ))}
          </ul>
        </section>
      )}

      <section className="section" aria-labelledby="lookup">
        <h2 id="lookup">{t("acct.track.lookupTitle")}</h2>

        {error === "notfound" && (
          <div className="callout callout-stop" role="alert">
            <p className="mb-0">{t("trackIndex.notFound")}</p>
          </div>
        )}

        <form className="card" action={lookupByRef}>
          <input type="hidden" name="locale" value={locale} />
          <div className="field">
            <label htmlFor="ref">{t("trackIndex.lookupLabel")}</label>
            <span className="hint" id="ref-hint">
              {t("trackIndex.lookupHint")}
            </span>
            <input
              type="text"
              id="ref"
              name="ref"
              required
              aria-describedby="ref-hint"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            {t("trackIndex.lookup")}
          </button>
        </form>
      </section>
    </>
  );
}
