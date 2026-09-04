import ProcessJourney from "@/components/ProcessJourney";
import { getT } from "@/i18n";

/**
 * How a request moves, inside the account shell so the sidebar stays put.
 * The journey itself lives in ProcessJourney, shared with the help page.
 */
export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <>
      <h1 className="mb-0">{t("proc.h1")}</h1>
      <p className="muted">{t("proc.lead")}</p>

      <ProcessJourney locale={locale} />
    </>
  );
}
