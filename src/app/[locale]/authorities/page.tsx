import Link from "next/link";
import Icon from "@/components/Icon";
import AuthorityFinder from "@/components/AuthorityFinder";
import { getT } from "@/i18n";
import { DIRECTORY, TOTAL_BODIES, subjectsFor } from "@/data/directory";
import { tokens } from "@/lib/match";

/**
 * Every public authority you can file against.
 *
 * The live version of this page is 2,581 bodies in an alphabetical accordion
 * with no search: the only way to find out what is inside a heading is to open
 * it, ninety-four times.
 *
 * The client component does the filtering as you type. This server pass exists
 * for the citizen whose JavaScript never arrives — the same input is then a
 * plain GET form and the server filters instead — and for `?dept=`, which is a
 * real, shareable URL for one department in full.
 */
const RTI_ACT_URL = "https://rti.dopt.gov.in/rtiact.html";

export default async function AuthoritiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = getT(locale);

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const dept = typeof sp.dept === "string" ? sp.dept : "";
  const only = dept ? DIRECTORY.find((e) => e.name === dept) : undefined;

  // One department, in full, on its own URL.
  if (only) {
    return (
      <main id="main">
        <div className="page stack-lg">
          <p>
            <Link href={`/${locale}/authorities`}>{t("dir.backToAll")}</Link>
          </p>
          <div>
            <h1 lang="en">{only.name}</h1>
            <p className="lead muted">
              {t("dir.childCount", { n: only.children.length })}
            </p>
          </div>
          <ul className="dir-children card">
            {only.children.map((child, i) => (
              <li key={`${child}-${i}`} lang="en">
                {child}
              </li>
            ))}
          </ul>
          <p>
            <Link className="btn" href={`/${locale}/chat`}>
              {t("authorities.fileWith")}
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Server-side filtering, for a browser that never ran the script.
  const needles = tokens(q);
  const entries = (needles.length
    ? DIRECTORY.filter((entry) => {
        const hay = [entry.name, ...subjectsFor(entry)].join(" ").toLowerCase();
        return (
          needles.some((n) => hay.includes(n)) ||
          entry.children.some((c) => needles.some((n) => c.toLowerCase().includes(n)))
        );
      })
    : DIRECTORY
  ).map((entry) => ({
    name: entry.name,
    children: entry.children,
    subjects: subjectsFor(entry),
  }));

  return (
    <main id="main">
      <div className="page stack-lg">
        <div className="finder-head">
          <h1>{t("dir.h1")}</h1>
          <p className="muted">{t("dir.lead")}</p>
        </div>

        <AuthorityFinder
          locale={locale}
          entries={entries}
          initialQuery={q}
          totalBodies={TOTAL_BODIES}
          labels={{
            searchLabel: t("dir.searchLabel"),
            placeholder: t("dir.searchPlaceholder"),
            submit: t("top.search"),
            headings: t("dir.headings", { n: "{n}", total: "{total}" }),
            under: t("dir.under", { n: "{n}" }),
            total: t("dir.total", { total: "{total}" }),
            empty: t("dir.empty"),
            covers: t("authorities.subjects"),
            childCount: t("dir.childCount", { n: "{n}" }),
            showAll: t("dir.showAll", { n: "{n}" }),
            fileWith: t("authorities.fileWith"),
            noChildren: t("dir.noChildren"),
          }}
        />

        <aside className="callout callout-warn callout-compact" aria-labelledby="dir-only">
          <h2 id="dir-only" className="callout-title">
            <Icon name="alert" /> {t("dir.onlyTitle")}
          </h2>
          <p className="mb-0">{t("dir.onlyBody")}</p>
          <p className="mb-0">
            <a href={RTI_ACT_URL} rel="noopener noreferrer" target="_blank">
              {t("hero.readAct")}
            </a>
          </p>
        </aside>

      </div>
    </main>
  );
}
