import Link from "next/link";
import DashboardActions from "@/components/DashboardActions";
import { getT } from "@/i18n";
import { currentCase } from "@/lib/case";

/**
 * The front door to filing, from inside the account.
 *
 * A draft from the chat first, when there is one — then the five action
 * cards moved here from the dashboard top: the two filing routes wide
 * ("File an RTI Manually" straight to the one-page form, "File with RTI
 * Mitra AI" into the assistant) and the three helper routes beneath them.
 * The old front door (filing-first card, three "check first" routes, scope
 * warning) is gone.
 *
 * The `.new-fill` wrapper marks this short page for the footer rule in
 * globals.css: the account column absorbs the free viewport height so the
 * footer rests at the fold instead of floating mid-page. It carries
 * `stack-lg` because it is now the `main` element's only child — the spacing
 * between heading, draft and cards is unchanged.
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
    <div className="new-fill stack-lg">
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

      <DashboardActions locale={locale} />
    </div>
  );
}
