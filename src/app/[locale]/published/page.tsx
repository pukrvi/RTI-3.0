import Link from "next/link";
import ArchiveFinder, { type ArchiveItem } from "@/components/ArchiveFinder";
import { formatDate, getT } from "@/i18n";
import { PUBLISHED } from "@/data/published";
import { REPLIES } from "@/data/replies";
import { AUTHORITIES } from "@/data/authorities";
import {
  publishedSummary,
  publishedTitle,
  publishedVariants,
  replyAnswer,
  replyQuestion,
  replyVariants,
} from "@/data/locale-text";
import { authorityName } from "@/lib/case";

/**
 * The public record, in one place.
 *
 * The live portal has no archive of any kind: no index of what authorities
 * publish under section 4, and no record of what has already been released in
 * answer to earlier requests. So every request starts from zero, for a fee,
 * even when the same question was answered last month.
 */
export default async function PublishedPage({
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
  const type = sp.type === "disclosure" || sp.type === "reply" ? sp.type : "all";

  const nameOf = (id: string) => {
    const a = AUTHORITIES.find((x) => x.id === id);
    return a ? authorityName(a, locale) : "";
  };

  const norm = (s: string) =>
    s.toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s]/gu, " ").replace(/\s+/g, " ").trim();

  const items: ArchiveItem[] = [
    ...PUBLISHED.map((p) => ({
      id: p.id,
      kind: "disclosure" as const,
      title: publishedTitle(p, locale),
      meta: `${t(`check.kind.${p.kind}`)} · ${t("check.updated", {
        date: formatDate(p.updated, locale),
      })}`,
      body: publishedSummary(p, locale),
      authority: nameOf(p.authorityId),
      haystack: norm(
        [...publishedVariants(p), nameOf(p.authorityId), ...p.keywords].join(" "),
      ),
    })),
    ...REPLIES.map((r) => ({
      id: r.id,
      kind: "reply" as const,
      title: replyQuestion(r, locale),
      meta: t("arch.askedBy", {
        who: r.requester,
        filed: formatDate(r.filed, locale),
        replied: formatDate(r.replied, locale),
      }),
      body: replyAnswer(r, locale),
      authority: nameOf(r.authorityId),
      outcome: {
        label: t(`arch.outcome.${r.outcome}`),
        tone: (r.outcome === "supplied" ? "ok" : r.outcome === "partial" ? "warn" : "stop") as
          | "ok"
          | "warn"
          | "stop",
      },
      haystack: norm(
        [...replyVariants(r), nameOf(r.authorityId), ...r.keywords].join(" "),
      ),
    })),
  ];

  // Server-side filtering, for a browser that never ran the script.
  const terms = norm(q).split(" ").filter(Boolean);
  const initial = items.filter((item) => {
    if (type !== "all" && item.kind !== type) return false;
    return terms.every((term) => item.haystack.includes(term));
  });

  return (
    <main id="main">
      <div className="page stack-lg">
        <div className="finder-head">
          <h1>{t("arch.h1")}</h1>
          <p className="muted">{t("arch.lead")}</p>
        </div>

        <ArchiveFinder
          locale={locale}
          items={q || type !== "all" ? initial : items}
          initialQuery={q}
          initialType={type}
          labels={{
            searchLabel: t("arch.searchLabel"),
            filters: t("arch.filters"),
            placeholder: t("arch.placeholder"),
            submit: t("top.search"),
            all: t("arch.all"),
            disclosures: t("arch.disclosures"),
            replies: t("arch.repliesTab"),
            count: t("arch.count", { n: "{n}", total: "{total}" }),
            empty: t("arch.empty"),
          }}
        />

        <section className="callout callout-info" aria-labelledby="arch-why">
          <h2 id="arch-why" className="callout-title">
            {t("arch.whyTitle")}
          </h2>
          <p className="mb-0">{t("arch.whyBody")}</p>
        </section>

        <p>
          <Link className="btn btn-secondary" href={`/${locale}/chat`}>
            {t("arch.askInstead")}
          </Link>
        </p>
      </div>
    </main>
  );
}
