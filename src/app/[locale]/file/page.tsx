import Link from "next/link";
import { redirect } from "next/navigation";
import FileGuidelinesDialog, {
  GuidelinesTrigger,
} from "@/components/FileGuidelinesDialog";
import MinistryAuthoritySelects from "@/components/MinistryAuthoritySelects";
import { formatDate, getT } from "@/i18n";
import { DIRECTORY } from "@/data/directory";
import { publishedTitle } from "@/data/locale-text";
import {
  authorityName,
  currentCase,
  redirectLabel,
  redirectNote,
  suggestDirectory,
} from "@/lib/case";
import { matchPublished, verdict } from "@/lib/match";
import { scaffoldBody, scaffoldSubject } from "@/lib/scaffold";
import { currentSession } from "@/lib/session";
import { getProfile } from "@/lib/store";
import { confirmAndProceed, submitFiling } from "../actions";

/**
 * The whole application, on one page.
 *
 * Three sections: who receives it (apex ministry, then the authority under
 * it), the request itself (one-line subject, full question, one attachment),
 * and the applicant's details — prefilled from the account, editable here for
 * this filing only. The ₹10 fee comes at the end, after every check has run.
 *
 * Coming from the chat, the conversation fills this page in: the question,
 * the letter, the authority it worked out. Everything arrives editable.
 *
 * The Guidelines and Disclaimer dialog opens on every landing, whichever flow
 * led here; the trigger beside the heading brings it back once dismissed.
 */
export default async function FilePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { error, notice } = await searchParams;
  const t = getT(locale);

  const session = await currentSession();
  // Manual filing needs an account. Chat stays open without one — the gate
  // happens at the moment of filing, not the moment of asking.
  if (!session) redirect(`/${locale}/login?next=/${locale}/file`);
  const saved = await getProfile(session.contact);

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

  // The pre-payment checks read whatever the citizen has said so far: the
  // chat question when there is one, else the subject and letter on the form.
  const checkText =
    file?.question ||
    [file?.subject, file?.body].filter(Boolean).join(" ").trim();
  const stateStop =
    error === "state" && checkText ? verdict(checkText) : null;
  const published =
    notice === "published" && checkText ? matchPublished(checkText) : [];

  const errorMessage: Record<string, string> = {
    question: t("file.errQuestion"),
    authorityId: t("file.errAuthority"),
    ministry: t("file.errMinistry"),
    authorityText: t("file.errAuthority"),
    subject: t("compose.errSubject"),
    body: t("compose.errBody"),
    name: t("compose.errName"),
    email: t("compose.errEmail"),
    attachment: t("compose.errAttach"),
  };

  const fromChat = Boolean(file?.chat?.length);

  // A routing suggestion from the citizen's own words, mapped onto the two
  // dropdowns — used only until they choose for themselves.
  let suggested: { ministry: string; authorityText: string } | null = null;
  if (!file?.ministry && !file?.authorityId && checkText) {
    const v = verdict(checkText);
    if (v.kind === "in-scope") suggested = await suggestDirectory(v.central.item.id);
  }
  if (!file?.ministry && !file?.authorityText && file?.authorityId) {
    suggested = await suggestDirectory(file.authorityId);
  }
  const initialMinistry = file?.ministry ?? suggested?.ministry ?? "";
  const initialAuthority = file?.authorityText ?? suggested?.authorityText ?? "";

  const prefill = (key: "name" | "email" | "addr1" | "addr2" | "addr3" | "pin") =>
    file?.[key] ?? saved?.[key] ?? "";

  // A citizen arriving from the conversation never stares at an empty letter:
  // it is started from their own words, and every word stays changeable.
  const subject = file?.subject ?? (file?.question ? scaffoldSubject(file.question, t) : "");
  const body = file?.body ?? (file?.question ? scaffoldBody(file.question, t) : "");

  const guideSections = [
    {
      heading: t("file.guide.s1h"),
      items: [t("file.guide.s1i1"), t("file.guide.s1i2"), t("file.guide.s1i3"), t("file.guide.s1i4")],
    },
    {
      heading: t("file.guide.s2h"),
      items: [t("file.guide.s2i1"), t("file.guide.s2i2"), t("file.guide.s2i3"), t("file.guide.s2i4")],
    },
    {
      heading: t("file.guide.s3h"),
      items: [t("file.guide.s3i1"), t("file.guide.s3i2"), t("file.guide.s3i3"), t("file.guide.s3i4")],
    },
    {
      heading: t("file.guide.s4h"),
      items: [t("file.guide.s4i1"), t("file.guide.s4i2"), t("file.guide.s4i3"), t("file.guide.s4i4")],
    },
  ];

  // The before-you-pay notices render above the form, and the form keeps every
  // word typed — a notice must never cost anybody their draft.
  return (
    <main id="main">
      <div className="wrap stack-lg">
        <div className="file-head">
          <h1>{t("file.h1")}</h1>
          <p className="mb-0">
            <GuidelinesTrigger label={t("file.guide.open")} />
          </p>
        </div>

        <FileGuidelinesDialog
          title={t("file.guide.title")}
          sections={guideSections}
          closeLabel={t("file.guide.close")}
        />

        {fromChat && (
          <div className="callout callout-info">
            <p className="mb-0">{t("file.fromSahayak")}</p>
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
                  <a href={`#${key === "authorityText" ? "authority-select" : key === "ministry" ? "ministry-select" : key}`}>{errorMessage[key] ?? key}</a>
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
          <fieldset className="card file-sec">
            <legend>
              <span className="sec-num" aria-hidden="true">1</span>{" "}
              {t("file.secAuthority")}
            </legend>
            <MinistryAuthoritySelects
              entries={DIRECTORY}
              initialMinistry={initialMinistry}
              initialAuthority={initialAuthority}
              ministryLabel={t("file.ministryLabel")}
              ministryHint={t("file.ministryHint")}
              authorityLabel={t("file.authorityLabel")}
              authorityHint={t("file.authorityHint")}
              ministryError={bad.has("ministry") ? t("file.errMinistry") : undefined}
              authorityError={bad.has("authorityText") ? t("file.errAuthority") : undefined}
            />
            {suggested && !file?.ministry && !file?.authorityText && (
              <p className="small muted mb-0">
                {t("file.suggestedNote")}
              </p>
            )}
            <p className="small mb-0">
              <Link href={`/${locale}/chat`}>{t("file.askInstead")}</Link>
            </p>
          </fieldset>

          {/* -------------------------------------------------- 2. request -- */}
          <fieldset className="card file-sec">
            <legend>
              <span className="sec-num" aria-hidden="true">2</span>{" "}
              {t("file.secRequest")}
            </legend>

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
                {t("compose.bodyHint")} {t("compose.bodyUnicode")} {t("compose.bodyMax")}
              </span>
              <textarea
                id="body"
                name="body"
                rows={10}
                defaultValue={body}
                required
                maxLength={5000}
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

            <div className={`field ${bad.has("attachment") ? "field-error" : ""}`}>
              <label htmlFor="attachment">
                {t("compose.attachLabel")}{" "}
                <span className="muted smaller">({t("common.optional")})</span>
              </label>
              <span className="hint" id="attachment-hint">
                {t("compose.attachHint")}
              </span>
              <input
                type="file"
                id="attachment"
                name="attachment"
                accept=".pdf,.jpg,.jpeg,.png"
                aria-describedby={`attachment-hint${bad.has("attachment") ? " attachment-error" : ""}`}
                aria-invalid={bad.has("attachment") || undefined}
              />
              {file?.attachmentName && (
                <p className="small muted mb-0">
                  {file.attachmentName}
                </p>
              )}
              {bad.has("attachment") && (
                <p className="error-text" id="attachment-error">
                  {t("compose.errAttach")}
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
          <fieldset className="card file-sec">
            <legend>
              <span className="sec-num" aria-hidden="true">3</span>{" "}
              {t("compose.contact")}
            </legend>
            {saved?.updatedAt && (
              <p className="small muted">
                {t("compose.fromProfile")}{" "}
                <Link href={`/${locale}/account/profile`}>{t("common.change")}</Link>
              </p>
            )}

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
