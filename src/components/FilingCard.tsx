import Link from "next/link";
import { formatDate, type Translate } from "@/i18n";
import type { AccountItem } from "@/lib/account";
import { REPLY_DAYS } from "@/lib/deadline";

/**
 * One filing, as it appears in a list.
 *
 * A single row, not a stack. The subject is the heading and the link — it is
 * what the citizen recognises — with the reference number, authority and dates
 * as one quiet meta line beneath it. Status and the way in live in a column on
 * the right, which collapses under the text on a phone.
 *
 * The status badge never carries the meaning on its own: it is a word, in a
 * shape, with a colour — and the same sentence appears in the line underneath.
 * The live portal's status strings are free text in capitals with no visual
 * treatment at all, so `RTI REQUEST APPLICATION RETURNED TO APPLICANT` and
 * `REQUEST FORWARDED TO CPIO` look identical while meaning opposite things.
 */
export default function FilingCard({
  item,
  locale,
  t,
  showMeter = false,
}: {
  item: AccountItem;
  locale: string;
  t: Translate;
  showMeter?: boolean;
}) {
  const { file, clock, authority } = item;
  const badge = file.deleted
    ? { cls: "badge-plain", text: t("track.status.withdrawn") }
    : file.appeal
      ? { cls: "badge-info", text: t("auth.account.appealed") }
      : file.reply?.kind === "refused"
        ? { cls: "badge-stop", text: t("track.status.refused") }
        : clock.state === "overdue"
          ? { cls: "badge-stop", text: t("track.status.overdue") }
          : clock.state === "replied"
            ? { cls: "badge-ok", text: t("track.status.replied") }
            : { cls: "badge-plain", text: t("track.status.waitingShort") };

  // Elapsed share of the thirty days, clamped. Purely decorative: the days and
  // the date are both written out beside it.
  const used = Math.min(100, Math.max(0, ((REPLY_DAYS - clock.daysLeft) / REPLY_DAYS) * 100));
  const meterClass =
    clock.state === "overdue" ? "meter-stop" : clock.daysLeft <= 5 ? "meter-warn" : "";

  const href = `/${locale}/track/${file.id}`;
  const daysText =
    clock.daysLeft > 0
      ? t("track.daysLeft", { n: clock.daysLeft })
      : clock.daysLeft === 0
        ? t("track.dueToday")
        : t("track.overdue", { n: Math.abs(clock.daysLeft) });

  return (
    <li className="card filing filing-row">
      <div className="filing-main">
        <h3 className="mb-0 filing-subject" lang={locale}>
          <Link href={href}>{file.subject}</Link>
        </h3>
        {(file.filed?.ref || authority) && (
          <p className="small muted mb-0">
            {file.filed?.ref && <span className="refno">{file.filed.ref}</span>}
            {file.filed?.ref && authority ? " · " : ""}
            {authority}
          </p>
        )}
        {file.filed && (
          <p className="small muted mb-0">
            {t("auth.account.filed", { date: formatDate(file.filed.at, locale) })}
            {clock.state !== "replied" && (
              <> · {t("auth.account.due", { date: formatDate(clock.deadline, locale) })}</>
            )}
          </p>
        )}

        {showMeter && clock.state !== "replied" && (
          <p className="filing-meter mb-0">
            <span className={`meter ${meterClass}`.trim()} aria-hidden="true">
              <span style={{ width: `${used}%` }} />
            </span>
            <span className="nowrap">{daysText}</span>
          </p>
        )}
      </div>

      <p className="filing-side mb-0">
        <span className={`badge ${badge.cls}`}>{badge.text}</span>
        <Link className="btn btn-secondary btn-sm" href={href}>
          {t("auth.account.open")}
        </Link>
      </p>
    </li>
  );
}
