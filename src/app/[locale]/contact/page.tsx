import Link from "next/link";
import { getT } from "@/i18n";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const blocks = [
    ["contact.liveTitle", "contact.liveBody"],
    ["contact.designTitle", "contact.designBody"],
    ["contact.accessTitle", "contact.accessBody"],
    ["contact.auditTitle", "contact.auditBody"],
  ];

  return (
    <main id="main">
      <div className="page narrow stack-lg">
        <div className="page-head">
          <h1>{t("contact.h1")}</h1>
          <p className="lead muted">{t("contact.lead")}</p>
        </div>

        {blocks.map(([title, body]) => (
          <section className="card" key={title} aria-labelledby={title}>
            <h2 id={title}>{t(title)}</h2>
            <p className="mb-0">{t(body)}</p>
          </section>
        ))}

        <p>
          <Link className="btn btn-secondary" href={`/${locale}/help`}>
            {t("nav.helpFaq")}
          </Link>
        </p>
      </div>
    </main>
  );
}
