import Link from "next/link";
import Icon from "@/components/Icon";
import HeroCarousel from "@/components/HeroCarousel";
import HowCards from "@/components/HowCards";
import { formatDate, getT } from "@/i18n";
import { INDICATORS } from "@/data/indicators";

/**
 * The homepage.
 *
 * A four-panel gallery at the top — what you can do, the RTI Mitra assistant,
 * how the service is doing, and what the Act gives you — then how to file,
 * what cannot be filed here, and the usual questions and notices.
 *
 * The gallery is a scroll-snap strip with anchor links, so it works with no
 * JavaScript, it never moves on its own, and it can be scrolled from the
 * keyboard. Nothing on this page animates without being asked to.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const slides = [t("hero.s1"), t("hero.mitra"), t("hero.s2"), t("hero.s3")];
  const rights = [
    { icon: "clock" as const, v: "home.rights.daysValue", l: "home.rights.daysLabel", n: "home.rights.daysNote" },
    { icon: "rupee" as const, v: "home.rights.appealValue", l: "home.rights.appealLabel", n: "home.rights.appealNote" },
    { icon: "no-reason" as const, v: "home.rights.reasonValue", l: "home.rights.reasonLabel", n: "home.rights.reasonNote" },
  ];
  const notices = [1, 2, 3].map((n) => ({
    date: t(`home.notice${n}.date`),
    text: t(`home.notice${n}.text`),
  }));

  return (
    <main id="main" className="flush">
      <section
        className="hero"
        aria-roledescription="carousel"
        aria-label={t("hero.label")}
      >
        <div className="slides" tabIndex={0} role="group" aria-label={t("hero.label")}>
          {slides.map((_, i) => {
            const n = i + 1;
            const total = slides.length;
            return (
            <div
              className="slide"
              id={`slide-${n}`}
              key={n}
              role="group"
              aria-roledescription="slide"
              aria-label={t("hero.slide", { n, total })}
            >
              <a className="slide-arrow prev" href={`#slide-${n === 1 ? total : n - 1}`}>
                <span aria-hidden="true">‹</span>
                <span className="visually-hidden">{t("hero.prev")}</span>
              </a>
              <a className="slide-arrow next" href={`#slide-${n === total ? 1 : n + 1}`}>
                <span aria-hidden="true">›</span>
                <span className="visually-hidden">{t("hero.next")}</span>
              </a>

              <div className="slide-inner">
                {n === 1 && (
                  <>
                    <h1>{t("hp.h1")}</h1>
                    <p className="lead">{t("hp.lead")}</p>
                    <div className="hero-actions">
                      <Link className="btn" href={`/${locale}/file`}>
                        <Icon name="act" />
                        {t("nav.file")}
                      </Link>
                      <Link className="btn btn-secondary" href={`/${locale}/appeal`}>
                        <Icon name="appeal" />
                        {t("hero.fileAppeal")}
                      </Link>
                    </div>
                  </>
                )}

                {n === 2 && (
                  <>
                    <h1>{t("hero.mitraTitle")}</h1>
                    <p className="lead">
                      {t("hero.mitraLead")}
                      <br />
                      {t("hero.mitraLead2")}
                    </p>
                    <div className="ind-grid">
                      {(["search", "building", "check"] as const).map((icon, i) => (
                        <div className="ind ind-mitra" key={icon}>
                          <span className="v">
                            <Icon name={icon} /> {t(`hero.mitra${i + 1}`)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="hero-actions">
                      <Link className="btn" href={`/${locale}/chat`}>
                        <Icon name="chat" />
                        {t("acct.new.searchCta")}
                      </Link>
                    </div>
                  </>
                )}

                {n === 3 && (
                  <>
                    <h1>{t("ind.title")}</h1>
                    <div className="ind-grid">
                      {INDICATORS.map((ind) => (
                        <div className="ind" key={ind.labelKey}>
                          <span className="v">{ind.value}</span>
                          <span className="l">{t(ind.labelKey)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {n === 4 && (
                  <>
                    <h1>{t("hp.rights")}</h1>
                    <div className="stat-grid">
                      {rights.map((r) => (
                        <div className="stat stat-rights" key={r.v}>
                          <span className="value">{t(r.v)}</span>
                          <span className="note">{t(r.n)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            );
          })}
        </div>

        <nav className="dots" aria-label={t("hero.label")}>
          {slides.map((label, i) => (
            <a key={label} href={`#slide-${i + 1}`}>
              <span className="visually-hidden">
                {t("hero.goTo", { n: i + 1 })} — {label}
              </span>
            </a>
          ))}
        </nav>
        <HeroCarousel />
      </section>

      <div className="page" style={{ paddingTop: "2rem" }}>
        <section className="section" aria-labelledby="hp-steps">
          <h2 id="hp-steps">{t("hp.steps")}</h2>
          <p className="muted">{t("hp.stepsLead")}</p>
          <HowCards
            items={[1, 2, 3].map((n) => ({
              title: t(`hp.how${n}.title`),
              bodies: [
                t(`hp.how${n}.body`),
                t(n === 3 ? "hp.how3.body3" : `hp.how${n}.body2`),
              ],
            }))}
          />
        </section>

        {/* --------------------------------------------------- scope, plainly */}
        <section className="section" aria-labelledby="hp-scope">
          <div className="callout callout-warn scope">
            <h2 id="hp-scope" className="callout-title">
              <Icon name="alert" /> {t("hp.scopeTitle")}
            </h2>
            <p className="mb-0">
              {t("hp.scopeIntro")} <strong>{t("hp.scopeList")}</strong>{" "}
              {t("hp.scopeEnd")} <strong>{t("hp.scopeAction")}</strong>
            </p>
            <p className="mb-0" style={{ marginTop: "0.75rem" }}>
              <Link href={`/${locale}/authorities`}>{t("nav.pa")}</Link>
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="hp-rights">
          <h2 id="hp-rights">{t("hp.rights")}</h2>
          <div className="stat-grid">
            {rights.map((r) => (
              <div className="stat stat-rights" key={`body-${r.v}`}>
                <span className="value">
                  <Icon name={r.icon} /> {t(r.v)}
                </span>
                <span className="note">{t(r.n)}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid-2 section">
          <section aria-labelledby="hp-faq">
            <h2 id="hp-faq">{t("hp.faq")}</h2>
            <div className="card">
              {[1, 2, 3, 4].map((n) => (
                <details key={n} className="dir-item">
                  <summary>
                    <span className="nm">{t(`faq.q${n}`)}</span>
                  </summary>
                  <p className="dir-body">{t(`faq.a${n}`)}</p>
                </details>
              ))}
              <p style={{ marginTop: "0.75rem" }}>
                <Link href={`/${locale}/help`}>{t("hp.faqAll")}</Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="hp-notices">
            <h2 id="hp-notices">{t("hp.notices")}</h2>
            <ul className="notice-list card">
              {notices.map((notice) => (
                <li key={notice.date}>
                  <time dateTime={notice.date}>{formatDate(notice.date, locale)}</time>
                  {notice.text}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
