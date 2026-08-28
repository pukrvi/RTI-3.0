import Link from "next/link";
import { getT } from "@/i18n";

const REPO_URL = "https://github.com/pukrvi/RTI-3.0";

/**
 * The project doc, as a pitch deck: one idea per slide, the least text that
 * carries it. Reachable only from the footer — it is for reviewers of the
 * build, not for a citizen mid-journey — and English-only by decision: every
 * other locale falls back to English for these keys, which the dictionary
 * check treats as a deliberate partial.
 *
 * The argument is the three problems the product actually solves: finding
 * what is already published, filing and tracking without repetition, and a
 * service that works for every citizen — not any single UI change.
 */
export default async function ProjectDocPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const stats = (prefix: string, count: number) =>
    Array.from({ length: count }, (_, i) => i + 1).map((n) => (
      <div className="stat" key={n}>
        <span className="value">{t(`pd.${prefix}.${n}.v`)}</span>
        <span className="label">{t(`pd.${prefix}.${n}.l`)}</span>
        <span className="note">{t(`pd.${prefix}.${n}.n`)}</span>
      </div>
    ));

  const cards = (prefix: string, count: number) => (
    <div className="card-grid">
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <div className="card" key={n}>
          <h3>{t(`pd.${prefix}.c${n}.t`)}</h3>
          <p className="mb-0">{t(`pd.${prefix}.c${n}.d`)}</p>
        </div>
      ))}
    </div>
  );

  return (
    <main id="main" className="deck">
      <section className="deck-slide" aria-labelledby="pd-s1-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s1.kicker")}</p>
          <h1 className="deck-title" id="pd-s1-h">
            {t("pd.s1.title")}
          </h1>
          <p className="deck-sub">{t("pd.s1.sub")}</p>
          <p className="deck-note mb-0">{t("pd.s1.note")}</p>
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s2-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s2.kicker")}</p>
          <h2 className="deck-title" id="pd-s2-h">
            {t("pd.s2.title")}
          </h2>
          {cards("s2", 3)}
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s3-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s3.kicker")}</p>
          <h2 className="deck-title" id="pd-s3-h">
            {t("pd.s3.title")}
          </h2>
          <p className="deck-sub">{t("pd.s3.problem")}</p>
          {cards("s3", 2)}
          <p className="deck-note mb-0">{t("pd.s3.outcome")}</p>
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s4-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s4.kicker")}</p>
          <h2 className="deck-title" id="pd-s4-h">
            {t("pd.s4.title")}
          </h2>
          <p className="deck-sub">{t("pd.s4.problem")}</p>
          {cards("s4", 4)}
          <p className="deck-note mb-0">{t("pd.s4.note")}</p>
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s5-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s5.kicker")}</p>
          <h2 className="deck-title" id="pd-s5-h">
            {t("pd.s5.title")}
          </h2>
          {cards("s5", 4)}
          <p className="deck-note mb-0">{t("pd.s5.note")}</p>
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s6-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s6.kicker")}</p>
          <h2 className="deck-title" id="pd-s6-h">
            {t("pd.s6.title")}
          </h2>
          <ul className="deck-points">
            {[1, 2, 3].map((n) => (
              <li key={n}>{t(`pd.s6.${n}`)}</li>
            ))}
          </ul>
          <p className="mb-0">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              {t("pd.s6.repo")}
            </a>
          </p>
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s7-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s7.kicker")}</p>
          <h2 className="deck-title" id="pd-s7-h">
            {t("pd.s7.title")}
          </h2>
          <div className="stat-grid">{stats("s7", 4)}</div>
        </div>
      </section>

      <section className="deck-slide" aria-labelledby="pd-s8-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s8.kicker")}</p>
          <h2 className="deck-title" id="pd-s8-h">
            {t("pd.s8.title")}
          </h2>
          <div className="grid-2">
            <div className="card">
              <h3>
                <span className="badge badge-ok">{t("pd.s8.real.t")}</span>
              </h3>
              <ul className="deck-points mb-0">
                {[1, 2, 3].map((n) => (
                  <li key={n}>{t(`pd.s8.real.${n}`)}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>
                <span className="badge badge-mock">{t("pd.s8.mock.t")}</span>
              </h3>
              <ul className="deck-points mb-0">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n}>{t(`pd.s8.mock.${n}`)}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="deck-note mb-0">{t("pd.s8.note")}</p>
        </div>
      </section>

      <section className="deck-slide deck-final" aria-labelledby="pd-s9-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s9.kicker")}</p>
          <h2 className="deck-title" id="pd-s9-h">
            {t("pd.s9.title")}
          </h2>
          <p className="deck-sub mb-0">{t("pd.s9.sub")}</p>
          <p>
            <Link className="btn btn-secondary" href={`/${locale}`}>
              {t("pd.back")}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}