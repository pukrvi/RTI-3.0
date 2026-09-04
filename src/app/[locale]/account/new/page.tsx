import Link from "next/link";
import Icon from "@/components/Icon";
import { getT } from "@/i18n";
import { currentCase } from "@/lib/case";

/**
 * The front door to filing, from inside the account.
 *
 * Four whole-card links, ranked: filing first and full-width, the three
 * "check first" routes beneath it in the site's standard three-up grid. There
 * is exactly one primary card on the page and no buttons at all — each card
 * is its own link, with the icon beside a title and a one-line body, after
 * the Paper "Home 1c" pattern. The card titles and bodies reuse the existing
 * dictionary strings, so no new English/Hindi/Bengali copy was needed: the
 * Mitra card's body ("finds what is already published and names the
 * authority that holds the rest") plus the scope note below it carry the
 * check-first and Central-only meaning. The state-scope warning survives as
 * one compact line, because the wrong-portal problem is real, but three
 * sentences of it buried the cards it was protecting.
 */
export default async function NewRequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const draft = await currentCase();
  const showDraft = draft && !draft.filed && draft.question;

  return (
    <>
      <h1 className="mb-0">{t("acct.new.h1")}</h1>

      {showDraft && (
        <div className="callout callout-info">
          <p className="callout-title">{t("acct.new.draftTitle")}</p>
          <p lang={locale}>“{draft!.question}”</p>
          <p className="mb-0">
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/chat`}>
              {t("acct.new.resume")}
            </Link>
          </p>
        </div>
      )}

      <Link className="action-card action-card-primary" href={`/${locale}/file`}>
        <span className="action-ic" aria-hidden="true">
          <Icon name="plus" />
        </span>
        <span className="action-tx">
          <span className="action-t">{t("acct.new.fileCta")}</span>
          <span className="action-d">{t("acct.new.fileBody")}</span>
        </span>
      </Link>

      <div className="card-grid card-grid-3">
        <Link className="action-card" href={`/${locale}/chat`}>
          <span className="action-ic" aria-hidden="true">
            <Icon name="search" />
          </span>
          <span className="action-tx">
            <span className="action-t">{t("acct.new.searchTitle")}</span>
            <span className="action-d">{t("acct.new.searchBody")}</span>
          </span>
        </Link>

        <Link className="action-card" href={`/${locale}/authorities`}>
          <span className="action-ic" aria-hidden="true">
            <Icon name="building" />
          </span>
          <span className="action-tx">
            <span className="action-t">{t("acct.new.dirTitle")}</span>
            <span className="action-d">{t("acct.new.dirBody")}</span>
          </span>
        </Link>

        <Link className="action-card" href={`/${locale}/published`}>
          <span className="action-ic" aria-hidden="true">
            <Icon name="archive" />
          </span>
          <span className="action-tx">
            <span className="action-t">{t("acct.new.pubTitle")}</span>
            <span className="action-d">{t("acct.new.pubBody")}</span>
          </span>
        </Link>
      </div>

      <div className="callout callout-warn callout-compact">
        <p className="mb-0">
          <Icon name="alert" />
          <strong>{t("hp.scope")}.</strong> {t("acct.new.scopeNote")}
        </p>
      </div>
    </>
  );
}
