import Link from "next/link";
import { getT } from "@/i18n";

/**
 * The opening screen.
 *
 * Both benchmark portals start their request tool this way — a plain statement
 * of what the tool does and what it cannot do, then a single button. This is
 * the same idea with the Indian scope limits and the prototype's own disclosure
 * on it, so nobody enters the assistant without knowing that nothing here is
 * filed and no money moves.
 *
 * An ordinary page — site header, footer, light background, like everywhere
 * else. Only the chat itself (/ask/chat) runs full-screen.
 */
export default async function WizardIntro({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <main id="main">
      <div className="wrap stack-lg ask-intro">
        <h1>{t("wiz.h1")}</h1>
        <p>{t("wiz.p1")}</p>
        <p>{t("wiz.p2")}</p>
        <p>{t("wiz.p3")}</p>
        <p className="muted">{t("wiz.time")}</p>
        <p>
          <Link className="btn" href={`/${locale}/ask/chat`}>
            {t("wiz.begin")}
          </Link>
        </p>
      </div>
    </main>
  );
}
