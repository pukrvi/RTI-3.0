import Icon, { type IconName } from "@/components/Icon";
import { getT } from "@/i18n";

const REPO_URL = "https://github.com/pukrvi/RTI-3.0";

/**
 * The project doc, as a ten-slide executive pitch deck: one idea per section,
 * uniform rhythm, dividers between sections. Reachable only from the footer
 * — it is for reviewers of the build, not for a citizen mid-journey — and
 * English-only by decision: the
 * page always reads from the English dictionary, and no other locale ships
 * these keys (the dictionary check treats that as a deliberate partial).
 *
 * The argument is a business case, not a build log: who files, what today
 * costs them, the three bets that change it, what the government gains,
 * and what each layer maps to at production scale. All visuals are CSS and
 * inline SVG — no images, no new requests.
 */
export default async function ProjectDocPage() {
  // English-only by decision. No other locale ships these keys (the dictionary
  // check treats that as a deliberate partial).
  const t = getT("en");

  /** Compact tiles with an icon medallion: cohorts (s2), trust (s7),
      government wins (s8). The grid class spreads each set across the slide:
      six cohorts in 3×2, four wins in 4-across, two trust cards in halves. */
  const tiles = (
    prefix: string,
    key: string,
    icons: IconName[],
    gridClass = "",
  ) => (
    <div className={`card-grid${gridClass ? ` ${gridClass}` : ""}`}>
      {icons.map((icon, i) => {
        const n = i + 1;
        return (
          <div className="card deck-tile" key={n}>
            <span className="deck-ic" aria-hidden="true">
              <Icon name={icon} />
            </span>
            <div>
              <h3>{t(`pd.${prefix}.${key}${n}.t`)}</h3>
              <p className="mb-0">{t(`pd.${prefix}.${key}${n}.d`)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  /** Icon rows for the right half of a split slide (s4, s5, s6). */
  const rows = (prefix: string, key: string, icons: IconName[]) => (
    <div>
      {icons.map((icon, i) => {
        const n = i + 1;
        return (
          <div className="deck-row" key={n}>
            <span className="deck-ic" aria-hidden="true">
              <Icon name={icon} />
            </span>
            <div>
              <h3>{t(`pd.${prefix}.${key}${n}.t`)}</h3>
              <p className="mb-0">{t(`pd.${prefix}.${key}${n}.d`)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <main id="main" className="deck">
      {/* 01 — title */}
      <section className="deck-slide" aria-labelledby="pd-s1-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s1.kicker")}</p>
          <h1 className="deck-title deck-title-hero" id="pd-s1-h">
            {t("pd.s1.title")}
          </h1>
          <p className="deck-sub">{t("pd.s1.sub")}</p>
          <ol className="deck-strip" aria-label="The journey in three steps">
            <li className="step">
              <Icon name="chat" />
              {t("pd.s1.step1")}
            </li>
            <li className="sep" aria-hidden="true">
              →
            </li>
            <li className="step">
              <Icon name="search" />
              {t("pd.s1.step2")}
            </li>
            <li className="sep" aria-hidden="true">
              →
            </li>
            <li className="step">
              <Icon name="send" />
              {t("pd.s1.step3")}
            </li>
          </ol>
          <p className="deck-note mb-0">{t("pd.s1.note")}</p>
        </div>
      </section>

      {/* 02 — who files */}
      <section className="deck-slide" aria-labelledby="pd-s2-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s2.kicker")}</p>
          <h2 className="deck-title" id="pd-s2-h">
            {t("pd.s2.title")}
          </h2>
          <p className="deck-sub">{t("pd.s2.sub")}</p>
          {tiles("s2", "c", ["file", "grid", "archive", "user", "search", "building"], "card-grid-3")}
          <p className="deck-note mb-0">{t("pd.s2.outcome")}</p>
        </div>
      </section>

      {/* 03 — the problem, as a failure flow */}
      <section className="deck-slide" aria-labelledby="pd-s3-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s3.kicker")}</p>
          <h2 className="deck-title" id="pd-s3-h">
            {t("pd.s3.title")}
          </h2>
          <p className="deck-sub">{t("pd.s3.sub")}</p>
          <ol className="deck-flow">
            {(
              [
                ["file", "f1"],
                ["rupee", "f2"],
                ["clock", "f3"],
                ["alert", "f4"],
              ] as Array<[IconName, string]>
            ).map(([icon, k], i) => (
              <li className="deck-step" key={k}>
                <span className="deck-ic" aria-hidden="true">
                  <Icon name={icon} />
                </span>
                <p className="step-n" aria-hidden="true">
                  {i + 1}
                </p>
                <h3>{t(`pd.s3.${k}.t`)}</h3>
                <p className="mb-0">{t(`pd.s3.${k}.d`)}</p>
              </li>
            ))}
          </ol>
          <p className="deck-note mb-0">{t("pd.s3.outcome")}</p>
        </div>
      </section>

      {/* 04 — bet one: chat */}
      <section className="deck-slide" aria-labelledby="pd-s4-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s4.kicker")}</p>
          <h2 className="deck-title" id="pd-s4-h">
            {t("pd.s4.title")}
          </h2>
          <div className="grid-2 deck-split">
            <div className="card chat-mock" aria-label="Illustrated chat exchange">
              <p className="bubble bubble-you">{t("pd.s4.q")}</p>
              <div className="bubble bubble-mitra">
                <p className="mini-chip mini-chip-ok">
                  <Icon name="check" />
                  {t("pd.s4.a1")}
                </p>
                <p className="mini-chip mini-chip-info">
                  <Icon name="archive" />
                  {t("pd.s4.a2")}
                </p>
                <p className="mb-0 muted">{t("pd.s4.a3")}</p>
              </div>
            </div>
            <div>
              {rows("s4", "r", ["search", "building", "file"])}
              <p className="deck-note mb-0">{t("pd.s4.outcome")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — bet two: one profile */}
      <section className="deck-slide" aria-labelledby="pd-s5-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s5.kicker")}</p>
          <h2 className="deck-title" id="pd-s5-h">
            {t("pd.s5.title")}
          </h2>
          <div className="grid-2 deck-split">
            <div className="card attn-mock" aria-label="Illustrated attention list">
              <div className="attn-row">
                <span className="deck-ic" aria-hidden="true">
                  <Icon name="appeal" />
                </span>
                <p className="mb-0">{t("pd.s5.a1")}</p>
              </div>
              <div className="attn-row">
                <span className="deck-ic" aria-hidden="true">
                  <Icon name="clock" />
                </span>
                <p className="mb-0">{t("pd.s5.a2")}</p>
              </div>
              <div className="attn-row">
                <span className="deck-ic" aria-hidden="true">
                  <Icon name="id" />
                </span>
                <p className="mb-0">{t("pd.s5.a3")}</p>
              </div>
            </div>
            {rows("s5", "r", ["id", "history", "clock", "appeal"])}
          </div>
        </div>
      </section>

      {/* 06 — bet three: language */}
      <section className="deck-slide" aria-labelledby="pd-s6-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s6.kicker")}</p>
          <h2 className="deck-title" id="pd-s6-h">
            {t("pd.s6.title")}
          </h2>
          <div className="grid-2 deck-split">
            <div className="card deck-figure">
              <span className="figure-big" aria-hidden="true">
                {t("pd.s6.fig")}
              </span>
              <div>
                <p className="figure-label">{t("pd.s6.figLabel")}</p>
                <p className="deck-note mb-0">{t("pd.s6.figNote")}</p>
              </div>
            </div>
            <div>
              {rows("s6", "r", ["mic", "building"])}
              <p className="deck-note mb-0">{t("pd.s6.outcome")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — trust, both sides */}
      <section className="deck-slide" aria-labelledby="pd-s7-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s7.kicker")}</p>
          <h2 className="deck-title" id="pd-s7-h">
            {t("pd.s7.title")}
          </h2>
          {tiles("s7", "c", ["id", "archive"])}
          <p className="deck-note mb-0">{t("pd.s7.note")}</p>
        </div>
      </section>

      {/* 08 — the government business case */}
      <section className="deck-slide" aria-labelledby="pd-s8-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s8.kicker")}</p>
          <h2 className="deck-title" id="pd-s8-h">
            {t("pd.s8.title")}
          </h2>
          <p className="deck-sub">{t("pd.s8.sub")}</p>
          {tiles("s8", "b", ["search", "rupee", "archive", "check"], "card-grid-4")}
          <p className="deck-note mb-0">{t("pd.s8.outcome")}</p>
        </div>
      </section>

      {/* 09 — production and scale */}
      <section className="deck-slide" aria-labelledby="pd-s9-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s9.kicker")}</p>
          <h2 className="deck-title" id="pd-s9-h">
            {t("pd.s9.title")}
          </h2>
          <p className="deck-sub">{t("pd.s9.sub")}</p>
          <div className="card-grid">
            {(
              [
                ["grid", "c1"],
                ["check", "c2"],
                ["building", "c3"],
                ["archive", "c4"],
              ] as Array<[IconName, string]>
            ).map(([icon, k]) => (
              <div className="card" key={k}>
                <span className="deck-ic" aria-hidden="true">
                  <Icon name={icon} />
                </span>
                <p className="deck-kicker">{t(`pd.s9.${k}.k`)}</p>
                <h3>{t(`pd.s9.${k}.t`)}</h3>
                <p className="mb-0">{t(`pd.s9.${k}.d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — the ask + credit */}
      <section className="deck-slide deck-final" aria-labelledby="pd-s10-h">
        <div className="wrap">
          <p className="deck-kicker">{t("pd.s10.kicker")}</p>
          <h2 className="deck-title deck-title-hero" id="pd-s10-h">
            {t("pd.s10.title")}
          </h2>
          <p className="deck-sub">{t("pd.s10.sub")}</p>
          <p className="deck-note">{t("pd.s10.credit")}</p>
          <p className="deck-note mb-0">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              {t("pd.s10.repo")}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
