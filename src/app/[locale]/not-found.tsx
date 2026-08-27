import Link from "next/link";
import { getT, normaliseLocale } from "@/i18n";

export default function NotFound() {
  // A not-found rendered above the locale segment has no params to read.
  const locale = normaliseLocale(undefined);
  const t = getT(locale);
  return (
    <main id="main" className="wrap stack">
      <h1>{t("notfound.title")}</h1>
      <p>{t("notfound.body")}</p>
      <p>
        <Link className="btn" href={`/${locale}`}>
          {t("nav.restart")}
        </Link>
      </p>
    </main>
  );
}
