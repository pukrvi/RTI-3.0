import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { formatDate, getT, type Translate } from "@/i18n";
import { authorityById, authorityName } from "@/lib/case";
import { getCase } from "@/lib/store";
import {
  REPLY_DAYS,
  appealWindow,
  effectiveNow,
  replyClock,
} from "@/lib/deadline";
import { demoClock, demoReply, demoSilence } from "../../actions";

/**
 * Step 6 — the statutory clock, computed and shown.
 *
 * The live portal stores the filing date and the date of action, displays both,
 * and never subtracts one from the other. Section 7(1) gives the CPIO 30 days;
 * a citizen has no way to know when that ran out, and no route from a status
 * screen to the appeal form. Both are fixed here.
 */

function DemoControls({
  t,
  locale,
  caseId,
  offset,
  hasReply,
}: {
  t: Translate;
  locale: string;
  caseId: string;
  offset: number;
  hasReply: boolean;
}) {
  const hidden = (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="caseId" value={caseId} />
    </>
  );

  return (
    <section className="callout callout-mock" aria-labelledby="demo-heading">
      <h2 id="demo-heading" className="callout-title">
        {t("demo.title")}
      </h2>
      <p className="small">{t("demo.body")}</p>

      <div className="btn-row" style={{ marginBottom: "0.75rem" }}>
        <form action={demoClock}>
          {hidden}
          <input type="hidden" name="mode" value="add" />
          <input type="hidden" name="days" value="1" />
          <button type="submit" className="btn btn-quiet">
            {t("demo.jump1")}
          </button>
        </form>
        <form action={demoClock}>
          {hidden}
          <input type="hidden" name="mode" value="add" />
          <input type="hidden" name="days" value="7" />
          <button type="submit" className="btn btn-quiet">
            {t("demo.jump7")}
          </button>
        </form>
        <form action={demoClock}>
          {hidden}
          <input type="hidden" name="mode" value="set" />
          <input type="hidden" name="days" value="25" />
          <button type="submit" className="btn btn-quiet">
            {t("demo.jump25")}
          </button>
        </form>
        <form action={demoClock}>
          {hidden}
          <input type="hidden" name="mode" value="set" />
          <input type="hidden" name="days" value={String(REPLY_DAYS + 1)} />
          <button type="submit" className="btn btn-quiet">
            {t("demo.jump31")}
          </button>
        </form>
        {offset > 0 && (
          <form action={demoClock}>
            {hidden}
            <input type="hidden" name="mode" value="reset" />
            <button type="submit" className="btn btn-quiet">
              {t("demo.reset")}
            </button>
          </form>
        )}
      </div>

      <div className="btn-row">
        <form action={demoReply}>
          {hidden}
          <input type="hidden" name="kind" value="full" />
          <button type="submit" className="btn btn-quiet">
            {t("demo.reply")}
          </button>
        </form>
        <form action={demoReply}>
          {hidden}
          <input type="hidden" name="kind" value="partial-refusal" />
          <button type="submit" className="btn btn-quiet">
            {t("demo.replyPartial")}
          </button>
        </form>
        {hasReply && (
          <form action={demoSilence}>
            {hidden}
            <button type="submit" className="btn btn-quiet">
              {t("demo.silence")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getT(locale);
  const file = await getCase(id);

  if (!file?.filed) {
    return (
      <>
        <main id="main">
          <div className="wrap stack">
            <h1>{t("track.h1")}</h1>
            <div className="callout callout-warn">
              <p className="mb-0">{t("track.nothingHere")}</p>
            </div>
            <p>
              <Link className="btn" href={`/${locale}`}>
                {t("track.startAgain")}
              </Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  const authority = authorityById(file.authorityId);
  const now = effectiveNow(file.clockOffsetDays);
  const clock = replyClock(file.filed.at, now, file.reply?.at);
  const appealWin = appealWindow(file.filed.at, now, file.reply?.at);

  const elapsed = Math.min(Math.max(REPLY_DAYS - clock.daysLeft, 0), REPLY_DAYS);
  const percent = Math.round((elapsed / REPLY_DAYS) * 100);

  const statusKey = file.appeal
    ? "track.status.appealed"
    : clock.state === "replied"
      ? "track.status.replied"
      : clock.state === "overdue"
        ? "track.status.overdue"
        : "track.status.waiting";

  const tone =
    clock.state === "overdue"
      ? "stop"
      : clock.state === "replied"
        ? "ok"
        : clock.state === "due-soon" || clock.state === "due-today"
          ? "warn"
          : "info";

  const daysLabel =
    clock.state === "overdue"
      ? t("track.overdue", { n: Math.abs(clock.daysLeft) })
      : clock.daysLeft === 0
        ? t("track.dueToday")
        : t("track.daysLeft", { n: clock.daysLeft });

  return (
    <>
      <main id="main">
        <div className="wrap stack-lg">
          <h1>{t("track.h1")}</h1>

          {file.clockOffsetDays > 0 && (
            <div className="callout callout-mock">
              <p className="mb-0 small">
                {t("demo.now", { date: formatDate(now.toISOString(), locale) })}{" "}
                {t("demo.realNow", {
                  date: formatDate(new Date().toISOString(), locale),
                })}{" "}
                {t("demo.offset", { n: file.clockOffsetDays })}
              </p>
            </div>
          )}

          <section className="card" aria-labelledby="case-heading">
            <div className="card-head">
              <h2 id="case-heading" className="mb-0">
                {t("track.regNo")}
              </h2>
            </div>
            <p className="refno">{file.filed.ref}</p>
            <dl className="kv">
              <div>
                <dt>{t("track.filedOn")}</dt>
                <dd>{formatDate(file.filed.at, locale)}</dd>
              </div>
              <div>
                <dt>{t("track.with")}</dt>
                <dd>{authority ? authorityName(authority, locale) : "—"}</dd>
              </div>
              <div>
                <dt>{t("track.subject")}</dt>
                <dd lang={locale}>{file.subject}</dd>
              </div>
              <div>
                <dt>{t("track.status")}</dt>
                <dd>{t(statusKey)}</dd>
              </div>
            </dl>
          </section>

          <section className={`callout callout-${tone}`} aria-labelledby="clock-heading">
            <h2 id="clock-heading" className="callout-title">
              {t("track.deadlineTitle")}
            </h2>
            <div className="clock">
              <span className="big">{daysLabel}</span>
              <span>
                {t("track.deadlineDate", {
                  date: formatDate(clock.deadline, locale),
                })}
              </span>
            </div>
            <div
              className={`meter ${tone === "stop" ? "meter-stop" : tone === "warn" ? "meter-warn" : ""}`}
              role="img"
              aria-label={`${daysLabel} — ${t("track.deadlineDate", { date: formatDate(clock.deadline, locale) })}`}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <p className="small mb-0">{t("track.statutory")}</p>
          </section>

          {file.reply && (
            <section className="card" aria-labelledby="reply-heading">
              <div className="card-head">
                <h2 id="reply-heading" className="mb-0">
                  {t("track.replyTitle")}
                </h2>
              </div>
              <p className="small muted">
                {formatDate(file.reply.at, locale)} —{" "}
                {t(
                  file.reply.kind === "full"
                    ? "reply.full.subject"
                    : "reply.partial.subject",
                )}
              </p>
              <p>
                {t(
                  file.reply.kind === "full" ? "reply.full.text" : "reply.partial.text",
                )}
              </p>
            </section>
          )}

          {file.appeal ? (
            <section className="callout callout-ok" aria-labelledby="appeal-heading">
              <h2 id="appeal-heading" className="callout-title">
                {t("track.status.appealed")}
              </h2>
              <p>
                {t("track.appealFiled", {
                  ref: file.appeal.ref,
                  date: formatDate(file.appeal.at, locale),
                })}
              </p>
              <p className="mb-0">
                {t("track.appealDue", {
                  date: formatDate(
                    new Date(
                      new Date(file.appeal.at).getTime() + 30 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    locale,
                  ),
                })}
              </p>
            </section>
          ) : (
            appealWin.isOpen && (
              <section className="callout callout-warn" aria-labelledby="can-appeal">
                <h2 id="can-appeal" className="callout-title">
                  {t("track.appealTitle")}
                </h2>
                <p>
                  {appealWin.reason === "overdue"
                    ? t("track.appealWhyOverdue")
                    : t("track.appealWhyReplied")}
                </p>
                <p>
                  {t("track.appealWindow", {
                    date: formatDate(appealWin.closes as string, locale),
                    n: appealWin.daysLeft,
                  })}
                </p>
                <p className="mb-0">
                  <Link className="btn" href={`/${locale}/appeal/${file.id}`}>
                    {t("track.appealStart")}
                  </Link>
                </p>
              </section>
            )
          )}

          <DemoControls
            t={t}
            locale={locale}
            caseId={file.id}
            offset={file.clockOffsetDays}
            hasReply={Boolean(file.reply)}
          />

          <div className="btn-row no-print">
            <PrintButton label={t("track.print")} />
            <Link className="btn btn-quiet" href={`/${locale}/about`}>
              {t("nav.about")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
