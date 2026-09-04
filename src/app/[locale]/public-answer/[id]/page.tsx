import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatDate, getT } from "@/i18n";
import { authorityById, authorityName, currentCase } from "@/lib/case";
import { PUBLISHED } from "@/data/published";
import { publishedSummary, publishedTitle } from "@/data/locale-text";
import { continueToRouting, restart } from "../../actions";

/**
 * The deflection ending: the citizen has what they wanted and never files.
 *
 * Roughly the most valuable screen in the prototype and the cheapest to build,
 * because the information was already public — it was simply undiscoverable.
 */
export default async function PublicAnswerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getT(locale);
  const file = await currentCase();
  if (!file) redirect(`/${locale}`);

  const record = PUBLISHED.find((p) => p.id === id);
  if (!record) notFound();

  const authority = authorityById(record.authorityId);

  return (
    <>
      <main id="main">
        <div className="wrap stack-lg">
          <div className="callout callout-ok">
            <h1 className="callout-title">{t("publicAnswer.h1")}</h1>
            <p className="mb-0">{t("publicAnswer.body")}</p>
          </div>

          <article className="card">
            <div className="card-head">
              <h2 className="mb-0">{publishedTitle(record, locale)}</h2>
            </div>
            <p className="small muted">
              <span className="badge badge-plain">{t(`check.kind.${record.kind}`)}</span>{" "}
              {t("check.updated", { date: formatDate(record.updated, locale) })}
            </p>
            <p>{publishedSummary(record, locale)}</p>
            {authority && (
              <p className="small mb-0">
                <span className="muted">{t("publicAnswer.heldBy")}: </span>
                {authorityName(authority, locale)}
              </p>
            )}
          </article>

          <p className="callout callout-info mb-0">{t("publicAnswer.scale")}</p>

          <div className="btn-row">
            <form action={continueToRouting}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-secondary">
                {t("publicAnswer.stillFile")}
              </button>
            </form>
            <form action={restart}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-quiet">
                {t("publicAnswer.startOver")}
              </button>
            </form>
          </div>

          <p className="small">
            <Link href={`/${locale}/chat`}>{t("common.back")}</Link>
          </p>
        </div>
      </main>
    </>
  );
}
