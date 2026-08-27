import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/i18n";
import { authorityById, authorityName, currentCase } from "@/lib/case";
import { currentSession } from "@/lib/session";
import { getProfile } from "@/lib/store";
import { payAndFile } from "../actions";

/**
 * The payment page — the only page after the form.
 *
 * Read it as the confirmation step of the single-page form: here is the whole
 * application in miniature, here is exactly what you are about to be charged,
 * and here is the moment to go back and change something. The live portal
 * takes the ₹10 weeks before anybody checks whether the request can succeed;
 * on this journey every check happens before this page exists.
 *
 * There is no card field, no UPI field, no bank selector and no OTP box in
 * this prototype, and there never will be: the brief forbids handling payment
 * or OTP data, and a realistic-looking fake is not meaningfully safer than a
 * real one. The button below writes a row to a key-value store.
 */
export default async function PayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const file = await currentCase();
  if (!file) redirect(`/${locale}/file`);
  const authority = authorityById(file.authorityId);
  if (!authority) redirect(`/${locale}/file?error=authorityId`);
  if (!file.subject || !file.body) redirect(`/${locale}/file`);

  // Section 7(5): no fee at all for an applicant below the poverty line. The
  // live portal asks the BPL question on the request form and then still routes
  // everyone through a payment screen; here the answer removes the screen.
  const session = await currentSession();
  const profile = session ? await getProfile(session.contact) : null;
  const nilFee = profile?.bpl === "yes";
  const fee = nilFee ? "₹0" : "₹10";

  return (
    <main id="main">
      <div className="wrap stack-lg">
        <h1>{t("pay.h1")}</h1>

        <div className="callout callout-warn" role="alert">
          <p className="callout-title">{t("pay.aboutToTitle", { fee })}</p>
          <p className="mb-0">{t("pay.aboutTo", { fee })}</p>
        </div>

        {nilFee && (
          <div className="callout callout-ok">
            <p className="callout-title">{t("pay.nilTitle")}</p>
            <p className="mb-0">{t("pay.nilBody")}</p>
          </div>
        )}

        <section className="card" aria-labelledby="pay-summary">
          <div className="card-head">
            <h2 id="pay-summary" className="mb-0">
              {t("pay.whatYouGet")}
            </h2>
            <Link className="small" href={`/${locale}/file`}>
              {t("common.change")}
            </Link>
          </div>
          <dl className="kv">
            <div>
              <dt>{t("track.with")}</dt>
              <dd>{authorityName(authority, locale)}</dd>
            </div>
            <div>
              <dt>{t("track.subject")}</dt>
              <dd lang={locale}>{file.subject}</dd>
            </div>
            <div>
              <dt>{t("pay.line2")}</dt>
              <dd>{fee}</dd>
            </div>
            <div>
              <dt>{t("pay.total")}</dt>
              <dd>{fee}</dd>
            </div>
          </dl>
        </section>

        <p className="small muted">{t("pay.mockLead")}</p>

        <form action={payAndFile}>
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className="btn btn-block">
            {nilFee ? t("pay.nilSubmit") : t("pay.submit")}
          </button>
        </form>

        <p className="small">
          <Link href={`/${locale}/file`}>{t("common.back")}</Link>
        </p>
      </div>
    </main>
  );
}
