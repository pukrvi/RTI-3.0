import Link from "next/link";
import type { Translate } from "@/i18n";

/**
 * A slim footer on every page. The full "what is real, what is mocked"
 * breakdown lives on /about — so the footer keeps only a single quiet reminder
 * with a link to that page, plus the links people expect at the foot of a site.
 * The project doc is footer-only by design: it is written for reviewers of the
 * build, not for a citizen mid-journey, and nothing else on the site links to it.
 */
export default function SiteFooter({
  t,
  locale,
}: {
  t: Translate;
  locale: string;
}) {
  return (
    <footer className="site-footer">
      <div className="page footer-slim">
        <p className="footer-note mb-0">
          <strong>{t("footer.prototype")}</strong>{" "}
          <Link href={`/${locale}/about`}>{t("footer.about")}</Link>
        </p>
        <ul className="footer-inline">
          <li>
            <Link href={`/${locale}/help`}>{t("nav.helpFaq")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/contact`}>{t("nav.contact")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/authorities`}>{t("nav.pa")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/published`}>{t("nav.published")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/project-doc`}>{t("footer.projectDoc")}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
