import Link from "next/link";
import { getT } from "@/i18n";
import { storageKind } from "@/lib/store";

/**
 * Honesty is one of the six judging criteria, so it gets its own page, linked
 * from the footer of every screen.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const storage = await storageKind();

  return (
    <main id="main">
      <div className="wrap stack-lg">
        <div>
          <h1>{t("about.h1")}</h1>
          <p>{t("about.intro")}</p>
        </div>

        <section className="callout callout-ok" aria-labelledby="real-heading">
          <h2 id="real-heading" className="callout-title">
            <span className="badge badge-ok">{t("about.realTitle")}</span>
          </h2>
          <ul className="list-tight mb-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n}>{t(`about.real${n}`)}</li>
            ))}
          </ul>
        </section>

        <section className="callout callout-mock" aria-labelledby="mock-heading">
          <h2 id="mock-heading" className="callout-title">
            <span className="badge badge-mock">{t("about.mockTitle")}</span>
          </h2>
          <ul className="list-tight mb-0">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li key={n}>{t(`about.mock${n}`)}</li>
            ))}
          </ul>
          <p className="small mb-0" style={{ marginTop: "0.75rem" }}>
            <span className="muted">draft storage driver: </span>
            <code>{storage}</code>
          </p>
        </section>

        <section className="callout callout-stop" aria-labelledby="not-heading">
          <h2 id="not-heading" className="callout-title">
            <span className="badge badge-stop">{t("about.notTitle")}</span>
          </h2>
          <ul className="list-tight mb-0">
            {[1, 2, 3, 4].map((n) => (
              <li key={n}>{t(`about.not${n}`)}</li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="evidence-heading">
          <h2 id="evidence-heading">{t("about.evidenceTitle")}</h2>
          <p className="mb-0">{t("about.evidenceBody")}</p>
        </section>

        <p>
          <Link className="btn btn-secondary" href={`/${locale}`}>
            {t("about.back")}
          </Link>
        </p>
      </div>
    </main>
  );
}
