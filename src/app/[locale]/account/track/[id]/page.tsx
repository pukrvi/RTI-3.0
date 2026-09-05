import Link from "next/link";
import RequestDetail from "@/components/RequestDetail";
import { getT } from "@/i18n";
import { loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";

/**
 * One request, inside the signed-in shell beside the account menu.
 *
 * Every card and row in this shell — dashboard, track status, history,
 * payments, appeals — lands here, so a signed-in citizen never drops out to
 * the standalone tracking layout mid-task. The screen itself is the shared
 * `RequestDetail`: the same order, the same actions, only the back link
 * points at the track list instead of the homepage.
 */
export default async function AccountRequestPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getT(locale);
  const session = (await currentSession())!;
  const { items } = await loadAccount(session.contact, locale);
  const item = items.find((i) => i.file.id === id);
  const file = item?.file;

  if (!file?.filed) {
    return (
      <>
        <h1>{t("track.h1")}</h1>
        <div className="callout callout-warn">
          <p className="mb-0">{t("track.nothingHere")}</p>
        </div>
        <p className="mb-0">
          <Link className="btn btn-secondary" href={`/${locale}/account/track`}>
            ← {t("acct.track")}
          </Link>
        </p>
      </>
    );
  }

  return <RequestDetail file={{ ...file, filed: file.filed }} locale={locale} t={t} context="account" />;
}
