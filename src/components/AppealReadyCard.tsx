import Link from "next/link";
import { formatDateShort, type Translate } from "@/i18n";
import type { AccountItem } from "@/lib/account";
import { APPEAL_DAYS } from "@/lib/deadline";

/**
 * One request the citizen can appeal today.
 *
 * The track card's anatomy, pointed at the appeal form instead of the status
 * page: subject and reference up top with a way-in chevron, the thirty-day
 * appeal window as a thin timeline under it, and the count beside the closing
 * date at the foot — "Day 15 of 30 · Window closes 23 Oct 2026" on the left,
 * "15 days left" on the right. The whole card is the way in; the grounds and
 * the explanation live on the form itself, not here.
 */
export default function AppealReadyCard({
  item,
  locale,
  t,
}: {
  item: AccountItem;
  locale: string;
  t: Translate;
}) {
  const { file, authority } = item;
  const win = item.window;

  // Share of the thirty-day window used, clamped. Purely decorative: the days
  // and the date are both written out beside it.
  const used = Math.min(
    100,
    Math.max(0, ((APPEAL_DAYS - win.daysLeft) / APPEAL_DAYS) * 100),
  );
  const elapsed = Math.min(
    APPEAL_DAYS,
    Math.max(1, APPEAL_DAYS - win.daysLeft),
  );

  return (
    <li className="card filing-card">
      <Link href={`/${locale}/appeal/${file.id}`} className="filing-hit">
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

        <span className="meter filing-track" aria-hidden="true">
          <span style={{ width: `${used}%` }} />
        </span>

        <div className="filing-foot">
          <span className="small muted">
            {t("track.dayCount", { n: elapsed, total: APPEAL_DAYS })} ·{" "}
            {t("acct.appeals.closes", {
              date: formatDateShort(win.closes!, locale),
            })}
          </span>
          <span className="filing-status">
            {t("track.daysLeft", { n: win.daysLeft })}
          </span>
        </div>
      </Link>
    </li>
  );
}
