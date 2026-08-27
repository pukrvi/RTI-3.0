"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getT, normaliseLocale } from "@/i18n";

/**
 * Next requires an error boundary to be a client component, so this one is.
 * The journey itself never depends on it: the recovery route is a plain link.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const locale = normaliseLocale((usePathname() || "/en").split("/")[1]);
  const t = getT(locale);

  return (
    <main id="main" className="wrap stack">
      <h1>{t("error.title")}</h1>
      <p>{t("error.body")}</p>
      <p className="btn-row">
        <button className="btn" onClick={reset}>
          {t("common.continue")}
        </button>
        <a className="btn btn-secondary" href={`/${locale}`}>
          {t("nav.restart")}
        </a>
      </p>
    </main>
  );
}
