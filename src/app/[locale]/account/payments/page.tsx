import Link from "next/link";
import { formatDate, getT } from "@/i18n";
import { loadAccount } from "@/lib/account";
import { currentSession } from "@/lib/session";
import { getProfile } from "@/lib/store";

/**
 * Payments and receipts.
 *
 * The live portal has a whole top-level menu item called `Payment
 * Reconciliation`, added after the fact, whose entire purpose is to recover
 * money that left a citizen's bank account without a request being created.
 * That item is the clearest evidence of the failure this prototype is about:
 * the portal charges first and validates afterwards.
 *
 * No money moves here, and every row says so.
 */
export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const session = (await currentSession())!;
  const [{ items }, profile] = await Promise.all([
    loadAccount(session.contact, locale),
    getProfile(session.contact),
  ]);

  const bpl = profile?.bpl === "yes";
  const fee = bpl ? 0 : 10;

  interface Row {
    key: string;
    at: string;
    what: string;
    ref: string;
    amount: number;
    id: string;
  }

  const rows: Row[] = [];
  for (const item of items) {
    rows.push({
      key: `${item.file.id}-r`,
      at: item.file.filed!.at,
      what: t("acct.pay.request"),
      ref: item.file.filed!.ref,
      amount: fee,
      id: item.file.id,
    });
    if (item.file.appeal) {
      rows.push({
        key: `${item.file.id}-a`,
        at: item.file.appeal.at,
        what: t("acct.pay.appeal"),
        ref: item.file.appeal.ref,
        amount: 0,
        id: item.file.id,
      });
    }
  }
  rows.sort((a, b) => (a.at < b.at ? 1 : -1));
  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <>
      <div>
        <h1 className="mb-0">{t("acct.pay.h1")}</h1>
        <p className="muted">{t("acct.pay.lead")}</p>
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <p className="mb-0">{t("acct.pay.none")}</p>
        </div>
      ) : (
        <div
          className="tablewrap"
          role="region"
          aria-label={t("acct.pay.caption")}
          tabIndex={0}
        >
          <table className="data">
            <caption className="visually-hidden">{t("acct.pay.caption")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("acct.pay.colDate")}</th>
                <th scope="col">{t("acct.pay.colWhat")}</th>
                <th scope="col">{t("acct.pay.colRef")}</th>
                <th scope="col" className="num">
                  {t("acct.pay.colAmount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <time dateTime={row.at}>{formatDate(row.at, locale)}</time>
                  </td>
                  <td>{row.what}</td>
                  <th scope="row">
                    <Link className="refno" href={`/${locale}/track/${row.id}`}>
                      {row.ref}
                    </Link>
                  </th>
                  <td className="num">{row.amount === 0 ? t("acct.pay.free") : `₹${row.amount}`}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={3}>
                  {t("acct.pay.total")}
                </th>
                <td className="num">₹{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!bpl && <p className="small muted">{t("acct.pay.bplNote")}</p>}

      <section className="callout callout-info" aria-labelledby="recon">
        <h2 id="recon" className="callout-title">
          {t("acct.pay.reconTitle")}
        </h2>
        <p className="mb-0">{t("acct.pay.reconBody")}</p>
      </section>
    </>
  );
}
