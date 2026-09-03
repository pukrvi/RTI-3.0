import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getT } from "@/i18n";
import { authorityById, authorityName } from "@/lib/case";
import { getCase } from "@/lib/store";
import { appealWindow, effectiveNow, replyClock } from "@/lib/deadline";
import { appealScaffold } from "@/lib/scaffold";
import { fileAppeal } from "../../actions";

const GROUNDS = ["no-response", "refused", "incomplete", "fee", "other"] as const;

/**
 * Step 7 — the first appeal, prefilled, inside the window.
 *
 * On the live portal there is no link at all from a status screen to the appeal
 * form: the citizen must find a different menu item, re-enter the registration
 * number and the email, and pass another captcha. Nothing tells them the window
 * is open, and nothing tells them when it shuts.
 */
export default async function AppealPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getT(locale);
  const file = await getCase(id);
  if (!file?.filed) notFound();

  const authority = authorityById(file.authorityId);
  const now = effectiveNow(file.clockOffsetDays);
  const clock = replyClock(file.filed.at, now, file.reply?.at);
  const win = appealWindow(file.filed.at, now, file.reply?.at);

  const defaultGround =
    win.reason === "overdue"
      ? "no-response"
      : file.reply?.kind === "refused"
        ? "refused"
        : file.reply?.kind === "partial-refusal"
          ? "incomplete"
          : "other";

  const prefill = appealScaffold(t, {
    ref: file.filed.ref,
    filed: formatDate(file.filed.at, locale),
    deadline: formatDate(clock.deadline, locale),
    replied: file.reply ? formatDate(file.reply.at, locale) : undefined,
  });

  return (
    <>
      <main id="main">
        <div className="wrap stack-lg">
          <div>
            <h1>{t("appeal.h1")}</h1>
            <p>{t("appeal.intro")}</p>
          </div>

          <section className="card" aria-labelledby="against">
            <h2 id="against">{t("appeal.against")}</h2>
            <dl className="kv">
              <div>
                <dt>{t("track.regNo")}</dt>
                <dd className="refno">{file.filed.ref}</dd>
              </div>
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
            </dl>
          </section>

          {!win.isOpen ? (
            <>
              <div className="callout callout-warn">
                <p className="mb-0">{t("appeal.windowClosed")}</p>
              </div>
              <p>
                <Link className="btn" href={`/${locale}/track/${file.id}`}>
                  {t("common.back")}
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="callout callout-info">
                <p className="mb-0">
                  {t("appeal.groundAuto", {
                    reason: t(
                      win.reason === "overdue"
                        ? "appeal.reason.overdue"
                        : "appeal.reason.refused",
                    ),
                  })}
                </p>
              </div>

              <form action={fileAppeal} className="card">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="caseId" value={file.id} />

                <div className="field">
                  <label htmlFor="ground">{t("appeal.groundLabel")}</label>
                  <select id="ground" name="ground" defaultValue={defaultGround}>
                    {GROUNDS.map((g) => (
                      <option key={g} value={g}>
                        {t(`appeal.ground.${g}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="text">{t("appeal.textLabel")}</label>
                  <span className="hint" id="text-hint">
                    {t("appeal.textHint")}
                  </span>
                  <textarea
                    id="text"
                    name="text"
                    rows={10}
                    defaultValue={file.appeal?.text ?? prefill}
                    aria-describedby="text-hint"
                    lang={locale}
                  />
                </div>

                <p className="callout callout-ok">
                  <strong>{t("appeal.fee")}</strong>
                </p>

                <div className="btn-row">
                  <button type="submit" className="btn btn-block">
                    {t("appeal.submit")}
                  </button>
                </div>
              </form>

              <p className="small">
                <Link href={`/${locale}/track/${file.id}`}>{t("common.back")}</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
