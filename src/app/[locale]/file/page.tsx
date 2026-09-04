import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import MatchedTokens from "@/components/MatchedTokens";
import { formatDate, getT } from "@/i18n";
import { authorityName, centralAuthorities, currentCase, redirectLabel, redirectNote } from "@/lib/case";
import { publishedTitle } from "@/data/locale-text";
import { matchPublished, verdict } from "@/lib/match";
import { scaffoldBody, scaffoldSubject } from "@/lib/scaffold";
import { currentSession } from "@/lib/session";
import { getProfile } from "@/lib/store";
import { confirmAndProceed, draftLetter, submitFiling } from "../actions";

/**
 * The whole application, on one page.
 *
 * The live portal spreads twelve fields and four screens of scrolling across a
 * seven-step bar that always starts at RTI Mitra, whether you wanted it or
 * not. Here there are two doors — this form, and the assistant — and behind
 * both of them the same single page. Who holds the information, whether it is
 * already published and whether the subject is even Central are still checked
 * before the ₹10 is asked for; the checks just happen on submit instead of
 * occupying three screens of their own.
 *
 * Coming from the chat, the conversation fills this page in: the question, the
 * letter, the authority it worked out. Everything arrives editable.
 */
export default async function FilePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { error, notice, scaffolded } = await searchParams;
  const t = getT(locale);

  const session = await currentSession();
  const saved = session ? await getProfile(session.contact) : null;

  // Signed in for the first time: the personal details are asked once, here,
  // before any form is filled — and never asked again.
  if (session && !saved?.updatedAt) redirect(`/${locale}/file/details`);

  const stored = await currentCase();

  // "File another" must not refill the last application: if the draft in this
  // browser has already been filed, this page starts the next one empty. A
  // render cannot write the cookie that points at a fresh case, so the new
  // case is created by the server actions the next time the citizen submits.
  const file = stored?.filed ? null : stored;

  const bad = new Set(
    typeof error === "string" && error !== "state"
      ? error.split(",").filter(Boolean)
      : [],
  );
  const stateStop = error === "state" && file ? verdict(file.question) : null;
  const published =
    notice === "published" && file ? matchPublished(file.question) : [];

  const errorMessage: Record<string, string> = {
    question: t("file.errQuestion"),
    authorityId: t("file.errAuthority"),
    subject: t("compose.errSubject"),
    body: t("compose.errBody"),
    name: t("compose.errName"),
    email: t("compose.errEmail"),
  };

  const result = file?.question ? verdict(file.question) : null;
  const fromChat = Boolean(file?.chat?.length);
  const suggested =
    result?.kind === "in-scope" && !file?.authorityId
      ? result.central.item
      : undefined;
  const chosen = file?.authorityId
    ? centralAuthorities().find((a) => a.id === file.authorityId)
    : undefined;
  const prefill = (key: "name" | "email" | "addr1" | "addr2" | "addr3" | "pin") =>
    file?.[key] ?? saved?.[key] ?? "";

  // A citizen arriving from the conversation never stares at an empty letter:
  // it is started from their own words, and every word stays changeable.
  const subject = file?.subject ?? (file?.question ? scaffoldSubject(file.question, t) : "");
  const body = file?.body ?? (file?.question ? scaffoldBody(file.question, t) : "");

  // The before-you-pay notices render above the form, and the form keeps every
  // word typed — a notice must never cost anybody their draft.
  return (
    <main id="main">
      <div className="wrap stack-lg">
        <div>
          <h1>{t("file.h1")}</h1>
          <p>{t("file.intro")}</p>
        </div>

        {fromChat && (
          <div className="callout callout-info">
            <p className="mb-0">
              <Icon name="chat" /> {t("file.fromSahayak")}
            </p>
          </div>
        )}

        {/* --------------------------------------- stop: this is a State subject */}
        {stateStop?.kind === "out-of-scope" && (
          <section className="callout callout-stop" role="alert" aria-labelledby="stop-heading">
            <h2 id="stop-heading" className="callout-title">
              <span className="badge badge-stop">{t("authority.outOfScope")}</span>
            </h2>
            <p>
              {t("authority.outOfScopeLead", {
                name: authorityName(stateStop.state.item, locale),
              })}
            </p>
            <p>
              <strong>{t("authority.outOfScopeWhy")}: </strong>
              {redirectNote(stateStop.state.item, locale)}
            </p>
            <p>
              <strong>{t("authority.outOfScopeGo")}: </strong>
              {redirectLabel(stateStop.state.item, locale)}
            </p>
            <p>
              <strong>{t("authority.charged")}</strong>
            </p>
            <div className="btn-row">
              <form action={confirmAndProceed}>
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className="btn btn-secondary">
                  {t("file.forcePay")}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* ------------------------------------ notice: this may be published */}
        {published.length > 0 && (
          <section className="callout callout-warn" aria-labelledby="published-heading">
            <h2 id="published-heading" className="callout-title">
              {t("file.publishedLead")}
            </h2>
            <ul className="list-tight">
              {published.map(({ item }) => (
                <li key={item.id}>
                  <Link href={`/${locale}/public-answer/${item.id}`}>
                    {publishedTitle(item, locale)}
                  </Link>{" "}
                  <span className="small muted">
                    {t(`check.kind.${item.kind}`)} ·{" "}
                    {t("check.updated", { date: formatDate(item.updated, locale) })}
                  </span>
                </li>
              ))}
            </ul>
            <div className="btn-row">
              <form action={confirmAndProceed}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="dismiss" value="1" />
                <button type="submit" className="btn">
                  {t("file.publishedGo")}
                </button>
              </form>
              <Link className="btn btn-secondary" href={`/${locale}/file`}>
                {t("file.backToForm")}
              </Link>
            </div>
          </section>
        )}

        {bad.size > 0 && (
          <div className="callout callout-stop" role="alert">
            <p className="callout-title">{t("error.title")}</p>
            <ul className="list-tight mb-0">
              {[...bad].map((key) => (
                <li key={key}>
                  <a href={`#${key}`}>{errorMessage[key] ?? key}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form action={submitFiling} className="stack-lg">
          <input type="hidden" name="locale" value={locale} />
          {stateStop?.kind === "out-of-scope" && (
            <input type="hidden" name="confirmed" value="1" />
          )}

          {/* ------------------------------------------------ 1. authority -- */}
          <fieldset className="card">
            <legend>{t("file.secAuthority")}</legend>
            <div className={`field ${bad.has("authorityId") ? "field-error" : ""}`}>
              <label htmlFor="authority-select">{t("authority.selectLabel")}</label>
              <span className="hint" id="authority-select-hint">
                {t("authority.selectHint")}
              </span>
              <select
                id="authority-select"
                name="authorityId"
                defaultValue={file?.authorityId ?? suggested?.id ?? ""}
                aria-describedby={`authority-select-hint${bad.has("authorityId") ? " authority-select-error" : ""}`}
                aria-invalid={bad.has("authorityId") || undefined}
                required
              >
                <option value="" disabled>
                  —
                </option>
                {centralAuthorities().map((a) => (
                  <option key={a.id} value={a.id}>
                    {authorityName(a, locale)}
                    {a.ministry ? ` — ${a.ministry}` : ""}
                  </option>
                ))}
              </select>
              {bad.has("authorityId") && (
                <p className="error-text" id="authority-select-error">
                  {t("file.errAuthority")}
                </p>
              )}
            </div>

            {chosen && result?.kind === "in-scope" && result.central.item.id === chosen.id && (
              <div className="callout callout-ok">
                <p className="callout-title">{t("authority.inScope")}</p>
                <p className="mb-0">{t("authority.inScopeBody")}</p>
                <MatchedTokens t={t} matched={result.central.matched} />
              </div>
            )}
            {suggested && (
              <p className="small muted mb-0">
                {t("authority.inScope")} —{" "}
                <strong>{authorityName(suggested, locale)}</strong>.{" "}
                {t("file.suggestedNote")}
              </p>
            )}
            <p className="small mb-0">
              <Link href={`/${locale}/ask`}>{t("file.askInstead")}</Link>
            </p>
          </fieldset>

          {/* -------------------------------------------------- 2. question -- */}
          <fieldset className="card">
            <legend>{t("file.secRequest")}</legend>

            <div className={`field ${bad.has("question") ? "field-error" : ""}`}>
              <label htmlFor="question">{t("file.qLabel")}</label>
              <span className="hint" id="question-hint">
                {t("file.qHint")}
              </span>
              <textarea
                id="question"
                name="question"
                rows={3}
                required
                lang={locale}
                defaultValue={file?.question ?? ""}
                aria-describedby={`question-hint${bad.has("question") ? " question-error" : ""}`}
                aria-invalid={bad.has("question") || undefined}
              />
              {bad.has("question") && (
                <p className="error-text" id="question-error">
                  {t("file.errQuestion")}
                </p>
              )}
            </div>

            <p className="small mb-0">
              <button type="submit" className="btn btn-quiet" formAction={draftLetter}>
                {t("file.draftLetter")}
              </button>
            </p>

            {scaffolded && (
              <p className="callout callout-info small mb-0">
                <Icon name="check" /> {t("compose.scaffoldNote")}
              </p>
            )}

            <div className={`field ${bad.has("subject") ? "field-error" : ""}`}>
              <label htmlFor="subject">
                {t("compose.subjectLabel")}{" "}
                <span className="req" aria-hidden="true">*</span>
                <span className="visually-hidden"> ({t("common.required")})</span>
              </label>
              <span className="hint" id="subject-hint">
                {t("compose.subjectHint")}
              </span>
              <input
                type="text"
                id="subject"
                name="subject"
                defaultValue={subject}
                required
                lang={locale}
                aria-describedby={`subject-hint${bad.has("subject") ? " subject-error" : ""}`}
                aria-invalid={bad.has("subject") || undefined}
              />
              {bad.has("subject") && (
                <p className="error-text" id="subject-error">
                  {t("compose.errSubject")}
                </p>
              )}
            </div>

            <div className={`field ${bad.has("body") ? "field-error" : ""}`}>
              <label htmlFor="body">
                {t("compose.bodyLabel")}{" "}
                <span className="req" aria-hidden="true">*</span>
                <span className="visually-hidden"> ({t("common.required")})</span>
              </label>
              <span className="hint" id="body-hint">
                {t("compose.bodyHint")} {t("compose.bodyUnicode")}
              </span>
              <textarea
                id="body"
                name="body"
                rows={10}
                defaultValue={body}
                required
                lang={locale}
                aria-describedby={`body-hint${bad.has("body") ? " body-error" : ""}`}
                aria-invalid={bad.has("body") || undefined}
              />
              {bad.has("body") && (
                <p className="error-text" id="body-error">
                  {t("compose.errBody")}
                </p>
              )}
            </div>

            <details className="callout callout-info">
              <summary>{t("compose.tipsTitle")}</summary>
              <ul className="list-tight" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                <li>{t("compose.tip1")}</li>
                <li>{t("compose.tip2")}</li>
                <li>{t("compose.tip3")}</li>
                <li>{t("compose.tip4")}</li>
              </ul>
            </details>
          </fieldset>

          {/* -------------------------------------------------- 3. details -- */}
          <fieldset className="card">
            <legend>{t("compose.contact")}</legend>
            <p className="small muted">{t("compose.contactNote")}</p>
            {saved?.updatedAt && (
              <p className="small muted">
                {t("compose.fromProfile")}{" "}
                <Link href={`/${locale}/account/profile`}>{t("common.change")}</Link>
              </p>
            )}
            {!session && <p className="small muted">{t("file.signInNote")}</p>}

            <div className="form-row">
              <div className={`field ${bad.has("name") ? "field-error" : ""}`}>
                <label htmlFor="name">
                  {t("compose.name")}{" "}
                  <span className="req" aria-hidden="true">*</span>
                  <span className="visually-hidden"> ({t("common.required")})</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  defaultValue={prefill("name")}
                  required
                  aria-describedby={bad.has("name") ? "name-error" : undefined}
                  aria-invalid={bad.has("name") || undefined}
                />
                {bad.has("name") && (
                  <p className="error-text" id="name-error">
                    {t("compose.errName")}
                  </p>
                )}
              </div>

              <div className={`field ${bad.has("email") ? "field-error" : ""}`}>
                <label htmlFor="email">
                  {t("compose.email")}{" "}
                  <span className="req" aria-hidden="true">*</span>
                  <span className="visually-hidden"> ({t("common.required")})</span>
                </label>
                <span className="hint" id="email-hint">
                  {t("compose.emailHint")}
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  defaultValue={prefill("email")}
                  required
                  aria-describedby={`email-hint${bad.has("email") ? " email-error" : ""}`}
                  aria-invalid={bad.has("email") || undefined}
                />
                {bad.has("email") && (
                  <p className="error-text" id="email-error">
                    {t("compose.errEmail")}
                  </p>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="addr1">
                {t("compose.addr1")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input
                type="text"
                id="addr1"
                name="addr1"
                autoComplete="address-line1"
                defaultValue={prefill("addr1")}
              />
            </div>
            <div className="field">
              <label htmlFor="addr2">
                {t("compose.addr2")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input
                type="text"
                id="addr2"
                name="addr2"
                autoComplete="address-line2"
                defaultValue={prefill("addr2")}
              />
            </div>
            <div className="field">
              <label htmlFor="addr3">
                {t("compose.addr3")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input
                type="text"
                id="addr3"
                name="addr3"
                autoComplete="address-line3"
                defaultValue={prefill("addr3")}
              />
            </div>
            <div className="field">
              <label htmlFor="pin">
                {t("compose.pin")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <input
                type="text"
                id="pin"
                name="pin"
                inputMode="numeric"
                autoComplete="postal-code"
                defaultValue={prefill("pin")}
                style={{ maxWidth: "12rem" }}
              />
            </div>
          </fieldset>

          <div className="btn-row">
            <button type="submit" className="btn btn-block">
              {t("file.submit")}
            </button>
          </div>
          <p className="small muted">{t("file.beforePay")}</p>
        </form>
      </div>
    </main>
  );
}
