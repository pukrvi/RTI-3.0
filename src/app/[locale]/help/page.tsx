import Link from "next/link";
import ProcessJourney from "@/components/ProcessJourney";
import { getT } from "@/i18n";

/**
 * Everything the live portal spreads across a 29-page PDF user manual, an FAQ,
 * a guidelines interstitial and a help desk phone number — on one page, in the
 * citizen's language, as text.
 */
export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <main id="main">
      <div className="wrap stack-lg">
        <div className="page-head">
          <h1>{t("help.h1")}</h1>
          <p>{t("help.intro")}</p>
        </div>

        <section aria-labelledby="process-heading">
          <h2 id="process-heading">{t("proc.h1")}</h2>
          <p className="muted">{t("proc.lead")}</p>
          <ProcessJourney locale={locale} />
        </section>

        <section className="card" id="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading">{t("hp.faq")}</h2>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <details className="dir-item" key={n}>
              <summary>
                <span className="nm">{t(`faq.q${n}`)}</span>
              </summary>
              <p className="small" style={{ padding: "0 0 0.75rem 2rem" }}>
                {t(`faq.a${n}`)}
              </p>
            </details>
          ))}
        </section>

        <section className="card" aria-labelledby="rights-heading">
          <h2 id="rights-heading">{t("help.rights.title")}</h2>
          <ul className="list-tight mb-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n}>{t(`help.rights.${n}`)}</li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="writing-heading">
          <h2 id="writing-heading">{t("help.writing.title")}</h2>
          <ul className="list-tight mb-0">
            {[1, 2, 3, 4].map((n) => (
              <li key={n}>{t(`help.writing.${n}`)}</li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="refused-heading">
          <h2 id="refused-heading">{t("help.refused.title")}</h2>
          <p className="mb-0">{t("help.refused.body")}</p>
        </section>

        <section className="card" id="accessibility" aria-labelledby="a11y-heading">
          <h2 id="a11y-heading">{t("help.accessibility.title")}</h2>
          <p>{t("help.accessibility.body")}</p>
          <p className="mb-0">{t("help.accessibility.report")}</p>
        </section>

        <section className="card" aria-labelledby="contact-heading">
          <h2 id="contact-heading">{t("help.contact.title")}</h2>
          <p className="mb-0">{t("help.contact.body")}</p>
        </section>

        <p>
          <Link className="btn btn-secondary" href={`/${locale}/about`}>
            {t("footer.about")}
          </Link>
        </p>
      </div>
    </main>
  );
}
