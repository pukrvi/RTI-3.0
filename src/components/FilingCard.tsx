import Link from "next/link";
import { formatDateShort, type Translate } from "@/i18n";
import type { AccountItem } from "@/lib/account";
import {
  addDays,
  APPEAL_DAYS,
  daysBetween,
  effectiveNow,
  REPLY_DAYS,
} from "@/lib/deadline";

/**
 * One filing, as it appears in a list.
 *
 * After the Paper "Track Cards G" pattern: the subject and the reference sit
 * on top with a way-in chevron, a thin thirty-day timeline runs underneath,
 * and the foot carries the count beside the date — "Day 6 of 30 · Reply due
 * 27 September 2026" on the left, "24 days left" on the right. The whole card
 * is one link, so there is no Open button and no status badge; the status is a
 * bold word in the foot instead.
 *
 * Only an overdue silence goes red. A reply that is merely due soon stays
 * navy like any other waiting request, because the citizen can do nothing
 * with the difference. An answered request sits at a full bar; an appeal in
 * flight is measured against the FAA's thirty days instead.
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
  const now = effectiveNow(file.clockOffsetDays);
  const href = `/${locale}/track/${file.id}`;

  // Share of the thirty days used, clamped. Purely decorative: the days and
  // the date are both written out beside it.
  const used = Math.min(
    100,
    Math.max(
      0,
      file.appeal
        ? (daysBetween(file.appeal.at, now) / APPEAL_DAYS) * 100
        : clock.state === "replied"
          ? 100
          : ((REPLY_DAYS - clock.daysLeft) / REPLY_DAYS) * 100,
    ),
  );
  const isStop = clock.state === "overdue" && !file.reply && !file.deleted;
  const elapsed = Math.min(
    REPLY_DAYS,
    Math.max(1, REPLY_DAYS - clock.daysLeft),
  );

  // Answered and appealed cards carry no dates in the foot: the section is
  // history, so only the count and the decision date matter.
  const left =
    file.filed && file.appeal
      ? t("track.decisionDue", { date: formatDateShort(addDays(file.appeal.at, APPEAL_DAYS), locale) })
      : file.filed && file.reply
        ? t("track.answeredIn", { n: daysBetween(file.filed.at, file.reply.at) })
        : file.filed && clock.state === "overdue"
          ? `${t("track.daysUsed", { n: REPLY_DAYS, total: REPLY_DAYS })} · ${t("track.wasDue", { date: formatDateShort(clock.deadline, locale) })}`
          : file.filed
            ? `${t("track.dayCount", { n: elapsed, total: REPLY_DAYS })} · ${t("auth.account.due", { date: formatDateShort(clock.deadline, locale) })}`
            : "";

  const daysText =
    clock.daysLeft > 0
      ? t("track.daysLeft", { n: clock.daysLeft })
      : clock.daysLeft === 0
        ? t("track.dueToday")
        : t("track.overdue", { n: Math.abs(clock.daysLeft) });
  const status = file.deleted
    ? { text: t("track.status.withdrawn"), stop: false }
    : file.appeal
      ? { text: t("track.status.appealed"), stop: false }
      : file.reply?.kind === "refused"
        ? { text: t("track.status.refused"), stop: true }
        : clock.state === "overdue"
          ? { text: daysText, stop: true }
          : clock.state === "replied"
            ? { text: t("track.status.replied"), stop: false }
            : { text: daysText, stop: false };

  return (
    <li className="card filing-card">
      <Link href={href} className="filing-hit">
        <div className="filing-top">
          <div className="filing-tx">
            <h3 className="filing-subject" lang={locale}>
              {file.subject}
            </h3>
            {file.filed?.ref && (
              <p className="small muted mb-0">
                <span className="refno">{file.filed.ref}</span>
              </p>
            )}
            {authority && <p className="small muted mb-0">{authority}</p>}
          </div>
          <span className="filing-chev" aria-hidden="true">
            ›
          </span>
        </div>

        {showMeter && (
          <span
            className={`meter filing-track${isStop ? " filing-track-stop" : ""}`}
            aria-hidden="true"
          >
            <span style={{ width: `${used}%` }} />
          </span>
        )}

        <div className="filing-foot">
          <span className="small muted">{left}</span>
          <span className={`filing-status${status.stop ? " is-stop" : ""}`}>
            {status.text}
          </span>
        </div>
      </Link>
    </li>
  );
}
