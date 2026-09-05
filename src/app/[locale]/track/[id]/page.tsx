import Link from "next/link";
import { redirect } from "next/navigation";
import RequestDetail from "@/components/RequestDetail";
import { getT } from "@/i18n";
import { getCase } from "@/lib/store";
import { currentSession } from "@/lib/session";

/**
 * Step 6 — the statutory clock, computed and shown. (Anonymous half.)
 *
 * The live portal stores the filing date and the date of action, displays both,
 * and never subtracts one from the other. Section 7(1) gives the CPIO 30 days;
 * a citizen has no way to know when that ran out, and no route from a status
 * screen to the appeal form. Both are fixed here.
 *
 * Anyone holding the link can read the case — that is what a tracking link is
 * for. A signed-in citizen is sent to the same screen inside the account
 * shell instead, beside the menu, so the appeal and the history are one click
 * away rather than a fresh login away.
 */
export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getT(locale);

  if (await currentSession()) redirect(`/${locale}/account/track/${id}`);

  const file = await getCase(id);

  if (!file?.filed) {
    return (
      <>
        <main id="main">
          <div className="wrap stack">
            <h1>{t("track.h1")}</h1>
            <div className="callout callout-warn">
              <p className="mb-0">{t("track.nothingHere")}</p>
            </div>
            <p>
              <Link className="btn" href={`/${locale}`}>
                {t("track.startAgain")}
              </Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main id="main">
        <div className="wrap">
          <RequestDetail
            file={{ ...file, filed: file.filed }}
            locale={locale}
            t={t}
            context="public"
          />
        </div>
      </main>
    </>
  );
}
