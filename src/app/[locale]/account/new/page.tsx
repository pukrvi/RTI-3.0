import Link from "next/link";
import Icon from "@/components/Icon";
import { getT } from "@/i18n";
import { currentCase } from "@/lib/case";

/**
 * The front door to filing, from inside the account.
 *
 * Four ways in, ranked: filing first and biggest, the three "check first"
 * routes smaller beneath it. One primary button on the page — everything else
 * is secondary. The state-scope warning survives as one compact line, because
 * the wrong-portal problem is real, but three sentences of it buried the
 * buttons it was protecting.
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
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/ask/chat`}>
              {t("acct.new.resume")}
            </Link>
          </p>
        </div>
      )}

      <section className="card new-file-card">
        <p className="new-file-lead">{t("acct.new.fileBody")}</p>
        <p className="mb-0">
          <Link className="btn" href={`/${locale}/file`}>
            {t("acct.new.fileCta")}
          </Link>
        </p>
      </section>

      <div className="card-grid card-grid-3">
        <section className="card mini-card">
          <h2 className="card-title">
            <Icon name="search" />
            {t("acct.new.searchTitle")}
          </h2>
          <p className="muted">{t("acct.new.searchBody")}</p>
          <p className="mb-0">
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/ask`}>
              {t("acct.new.searchCta")}
            </Link>
          </p>
        </section>

        <section className="card mini-card">
          <h2 className="card-title">
            <Icon name="archive" />
            {t("acct.new.pubTitle")}
          </h2>
          <p className="muted">{t("acct.new.pubBody")}</p>
          <p className="mb-0">
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/published`}>
              {t("acct.new.pubCta")}
            </Link>
          </p>
        </section>

        <section className="card mini-card">
          <h2 className="card-title">
            <Icon name="building" />
            {t("acct.new.dirTitle")}
          </h2>
          <p className="muted">{t("acct.new.dirBody")}</p>
          <p className="mb-0">
            <Link className="btn btn-secondary btn-sm" href={`/${locale}/authorities`}>
              {t("acct.new.dirCta")}
            </Link>
          </p>
        </section>
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
