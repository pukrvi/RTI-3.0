import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { formatDate, type Translate } from "@/i18n";
import { caseAuthorityLabel, readCaseId } from "@/lib/case";
import { isDemoCaseId } from "@/data/demo-account";
import {
  REPLY_DAYS,
  APPEAL_DAYS,
  addDays,
  appealWindow,
  daysBetween,
  effectiveNow,
  replyClock,
} from "@/lib/deadline";
import type { CaseFile } from "@/lib/store";
import { demoClock, demoReply, demoSilence } from "@/app/[locale]/actions";

/**
 * One request, read top to bottom the way the citizen reads it.
 *
 * Shared by the public tracking link (`/[locale]/track/[id]`) and the
 * signed-in detail page (`/[locale]/account/track/[id]`), so both stay the
 * same screen. The order is deliberate: what the request is, what can be done
 * about it today, where the thirty-day clock stands, what the authority said,
 * and only then the filing metadata and the citizen's own letter. The appeal —
 * the one action with a closing window — sits in the action bar under the
 * heading, not at the bottom of the page.
 *
 * `context` changes only the chrome around that order: where the back link
 * goes, and whether the seeded-demo notice appears. Inside an account every
 * record belongs to the signed-in holder, so the notice has nothing to say
 * and is dropped; on the public link it stays, because a seed opened there is
 * read-only by construction.
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

export default async function RequestDetail({
  file,
  locale,
  t,
  context,
}: {
  /** A filed case — both callers return early on anything less. */
  file: CaseFile & { filed: NonNullable<CaseFile["filed"]> };
  locale: string;
  t: Translate;
  context: "account" | "public";
}) {
  const authority = caseAuthorityLabel(file, locale);
  const now = effectiveNow(file.clockOffsetDays);
  const clock = replyClock(file.filed.at, now, file.reply?.at);
  const appealWin = appealWindow(file.filed.at, now, file.reply?.at);
  // Seeded demo records are read-only: no browser cookie filed them, so the
  // demo controls (which act on the cookie-bound case) would silently no-op.
  const seededReadOnly = isDemoCaseId(file.id) && (await readCaseId()) !== file.id;

  const statusKey = file.appeal
    ? "track.status.appealed"
    : file.deleted
      ? "track.status.withdrawn"
      : file.reply?.kind === "refused"
        ? "track.status.refused"
        : clock.state === "replied"
          ? "track.status.replied"
          : clock.state === "overdue"
            ? "track.status.overdue"
            : "track.status.waiting";

  // Once a first appeal is filed, the CPIO's thirty days are moot — the live
  // clock is the First Appellate Authority's thirty days to decide. Showing
  // the reply count past that point reads as "-50 days left".
  const decisionDue = file.appeal ? addDays(file.appeal.at, APPEAL_DAYS) : null;
  const decisionLeft = decisionDue ? daysBetween(now, decisionDue) : 0;

  const daysLabel = file.appeal
    ? decisionLeft > 0
      ? t("track.daysLeft", { n: decisionLeft })
      : decisionLeft === 0
        ? t("track.dueToday")
        : t("track.overdue", { n: Math.abs(decisionLeft) })
    : clock.state === "overdue"
      ? t("track.overdue", { n: Math.abs(clock.daysLeft) })
      : clock.daysLeft === 0
        ? t("track.dueToday")
        : t("track.daysLeft", { n: clock.daysLeft });

  // The one thing on this page with a closing window. Everything else can
  // wait; this cannot, so it sits in the action bar under the heading.
  const canAppeal = appealWin.isOpen && !file.appeal && !file.deleted;

  return (
    <div className="stack">
      <p className="mb-0 no-print">
        <Link
          className="backlink"
          href={context === "account" ? `/${locale}/account/track` : `/${locale}`}
        >
          ← {context === "account" ? t("acct.track") : t("nav.home")}
        </Link>
      </p>

      <div className="detail-head">
        <p className="detail-eyebrow">{t("track.h1")}</p>
        <h1 className="mb-0" lang={locale}>
          {file.subject}
        </h1>
      </div>

      <div className="btn-row detail-actions no-print">
        <span className="push" aria-hidden="true" />
        {canAppeal && (
          <Link className="btn" href={`/${locale}/appeal/${file.id}`}>
            {t("track.appealStart")}
          </Link>
        )}
        <PrintButton label={t("track.print")} />
      </div>

      <div className="detail-grid">
        <div className="stack">
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

          {file.appeal ? (
            <section className="callout callout-ok" aria-labelledby="appeal-heading">
              <h2 id="appeal-heading" className="callout-title">
                {t("track.status.appealed")}
              </h2>
              <p className="mb-0">
                {t("track.appealFiled", {
                  ref: file.appeal.ref,
                  date: formatDate(file.appeal.at, locale),
                })}
              </p>
            </section>
          ) : canAppeal ? (
              <section className="callout callout-warn" aria-labelledby="can-appeal">
                <h2 id="can-appeal" className="callout-title">
                  {t("track.appealTitle")}
                </h2>
                <p className="mb-0">
                  {appealWin.reason === "overdue"
                    ? t("track.appealWhyOverdue")
                    : t("track.appealWhyReplied")}
                </p>
              </section>
            ) : (
              // Answered, refused or long overdue, but the thirty days to appeal
              // have run out: no button any more, but the page still says when
              // the window shut instead of going silent about appeals. Never on
              // a withdrawn request, which needs no action at all.
              !file.deleted &&
              appealWin.closes && (
                <div className="callout callout-compact">
                  <p className="mb-0">
                    {t("track.appealClosed", {
                      date: formatDate(appealWin.closes, locale),
                    })}
                  </p>
                </div>
              )
            )
          }

          {file.deleted && (
            <section className="callout callout-info" aria-labelledby="withdrawn-heading">
              <h2 id="withdrawn-heading" className="callout-title">
                {t("track.withdrawnTitle")}
              </h2>
              <p>
                {t("track.withdrawnBody", {
                  date: formatDate(file.deleted.at, locale),
                })}
              </p>
              {file.deleted.note && <p className="small mb-0">{file.deleted.note}</p>}
            </section>
          )}

          {!file.deleted && (
            <section className="card clock-card" aria-label={t("track.deadlineTitle")}>
              <p className="clock-figure">{daysLabel}</p>
              {file.appeal ? (
                <p className="small mb-0 clock-appeal">
                  {t("track.appealDue", {
                    date: formatDate(decisionDue as string, locale),
                  })}
                </p>
              ) : (
                canAppeal && (
                  <p className="small mb-0 clock-appeal">
                    {t("track.appealWindow", {
                      date: formatDate(appealWin.closes as string, locale),
                      n: appealWin.daysLeft,
                    })}
                  </p>
                )
              )}
            </section>
          )}

          {file.body && (
            <section className="card" aria-labelledby="asked-heading">
              <div className="card-head">
                <h2 id="asked-heading" className="mb-0">
                  {t("compose.bodyLabel")}
                </h2>
              </div>
              <p className="prewrap mb-0" lang={locale}>
                {file.body}
              </p>
            </section>
          )}

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
                    : file.reply.kind === "refused"
                      ? "reply.refused.subject"
                      : "reply.partial.subject",
                )}
              </p>
              <p>
                {t(
                  file.reply.kind === "full"
                    ? "reply.full.text"
                    : file.reply.kind === "refused"
                      ? "reply.refused.text"
                      : "reply.partial.text",
                )}
              </p>
            </section>
          )}

          {context === "public" && seededReadOnly ? (
            <section className="callout callout-mock" aria-labelledby="seeded-heading">
              <h2 id="seeded-heading" className="callout-title">
                {t("demo.seededTitle")}
              </h2>
              <p className="small mb-0">{t("demo.seededBody")}</p>
            </section>
          ) : (
            !seededReadOnly && (
              <DemoControls
                t={t}
                locale={locale}
                caseId={file.id}
                offset={file.clockOffsetDays}
                hasReply={Boolean(file.reply)}
              />
            )
          )}
        </div>

        <aside className="detail-side">
          <section className="card rail-card" aria-label={file.filed.ref}>
            <dl className="kv kv-stacked">
              <div>
                <dt>{t("track.status")}</dt>
                <dd>{t(statusKey)}</dd>
              </div>
              <div>
                <dt>{t("track.regNo")}</dt>
                <dd className="refno">{file.filed.ref}</dd>
              </div>
              <div>
                <dt>{t("track.with")}</dt>
                <dd lang="en">{authority}</dd>
              </div>
              <div>
                <dt>{t("track.filedOn")}</dt>
                <dd>{formatDate(file.filed.at, locale)}</dd>
              </div>
              <div>
                <dt>{t("track.replyDue")}</dt>
                <dd>{formatDate(clock.deadline, locale)}</dd>
              </div>
              {file.appeal ? (
                <>
                  <div>
                    <dt>{t("track.firstAppeal")}</dt>
                    <dd>{formatDate(file.appeal.at, locale)}</dd>
                  </div>
                  <div>
                    <dt>{t("track.decisionBy")}</dt>
                    <dd>{formatDate(decisionDue as string, locale)}</dd>
                  </div>
                </>
              ) : (
                !file.deleted &&
                appealWin.closes &&
                (appealWin.isOpen ? (
                  <div>
                    <dt>{t("track.appealBy")}</dt>
                    <dd>{formatDate(appealWin.closes, locale)}</dd>
                  </div>
                ) : (
                  <div>
                    <dt>{t("track.firstAppeal")}</dt>
                    <dd>
                      {t("track.appealClosed", {
                        date: formatDate(appealWin.closes, locale),
                      })}
                    </dd>
                  </div>
                ))
              )}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
