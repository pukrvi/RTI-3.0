import Link from "next/link";
import Icon from "@/components/Icon";
import ScrollToLatest from "@/components/ScrollToLatest";
import { formatDate, getT } from "@/i18n";
import { authorityName, currentCase, redirectLabel, redirectNote } from "@/lib/case";
import { publishedTitle, replyAnswer, replyQuestion } from "@/data/locale-text";
import { matchPublished, matchReplies, verdict } from "@/lib/match";
import { askAssistant, continueToRouting, restart } from "../../actions";

/**
 * RTI Sahayak.
 *
 * Full screen, no site header or footer, its own bar and its own way out. It
 * does the job FOIA.gov's wizard does — work out which body holds what you are
 * after — and two more the RTI Act makes possible: tell you when the answer is
 * already published or was already released to somebody else, and stop you
 * before payment when the subject belongs to a State department.
 *
 * Two pathways out, deliberately different shapes:
 *   1. Something is already out there. It comes back as a card you can read,
 *      and filing becomes the secondary action.
 *   2. Nothing is. The routing result comes back and filing is primary.
 *
 * Forms and page loads throughout — no streaming, no websocket, no client
 * state — so it works on a slow connection and with scripting switched off.
 */
export default async function WizardChat({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = getT(locale);
  const file = await currentCase();
  const chat = file?.chat ?? [];

  const result = file?.question ? verdict(file.question) : null;
  const published = file?.question ? matchPublished(file.question) : [];
  const replies = file?.question ? matchReplies(file.question) : [];
  const lastBot = chat.map((c) => c.role).lastIndexOf("app");
  const alreadyOut = published.length + replies.length > 0;
  const canFile = Boolean(file?.question) && result?.kind !== "out-of-scope";

  const topicIcons = [
    "search",
    "building",
    "clock",
    "rupee",
    "archive",
    "act",
    "help",
    "chat",
  ] as const;
  const topics = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    label: t(`wiz.topic${n}`),
    question: t(`wiz.q${n}`),
    icon: topicIcons[n - 1],
  }));

  return (
    <main id="main" className="wiz">
      <div className="wiz-bar">
        <Link className="wiz-link" href={`/${locale}/ask`}>
          <span aria-hidden="true">‹</span> {t("wiz.back")}
        </Link>
        <span className="who">
          <span className="avatar" aria-hidden="true">
            RS
          </span>
          <span className="name">{t("ai.title")}</span>
        </span>
        {chat.length > 0 ? (
          <form action={restart}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="to" value="chat" />
            <button type="submit" className="btn btn-quiet btn-sm">
              {t("ai.newQuestion")}
            </button>
          </form>
        ) : (
          <Link className="wiz-link" href={`/${locale}`}>
            {t("wiz.exit")}
          </Link>
        )}
      </div>

      <div className="wiz-chat">
        <div className="chat-scroll">
          <div className="chat">
            {chat.length === 0 ? (
              <div className="chat-welcome">
                <span className="chat-hi" aria-hidden="true">
                  <Icon name="chat" />
                </span>
                <h1>{t("ai.title")}</h1>
                <p className="lede">{t("ai.subtitle")}</p>
                <h2 className="eyebrow">{t("wiz.topics")}</h2>
                <ul className="topics">
                  {topics.map((topic) => (
                    <li key={topic.label}>
                      <form action={askAssistant}>
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="question" value={topic.question} />
                        <button type="submit" className="topic-card">
                          <Icon name={topic.icon} />
                          <span>{topic.label}</span>
                          <span className="go" aria-hidden="true">
                            ›
                          </span>
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
                <p className="orask">{t("wiz.orAsk")}</p>
              </div>
            ) : (
              <>
              <ol className="chat-log">
                {chat.map((turn, i) => (
                  <li key={`${turn.role}-${i}`}>
                    <div className={`msg ${turn.role === "user" ? "msg-user" : "msg-bot"}`}>
                      <span className="avatar" aria-hidden="true">
                        {turn.role === "user" ? "You" : "RS"}
                      </span>
                      <div className="bubble">
                        <span className="visually-hidden">
                          {turn.role === "user" ? t("ai.you") : t("ai.app")}:{" "}
                        </span>
                        <p lang={locale}>{turn.text}</p>
                      </div>
                    </div>

                    {/* -- already published by the authority ---------------- */}
                    {i === lastBot && published.length > 0 && (
                      <div className="chat-card chat-card-found">
                        <div className="head">
                          <span className="ic" aria-hidden="true">
                            <Icon name="archive" />
                          </span>
                          <span className="t">{t("ai.foundTitle")}</span>
                        </div>
                        <div className="body">
                          <ul className="found-list">
                            {published.map(({ item }) => (
                              <li key={item.id}>
                                <span className="t">
                                  {publishedTitle(item, locale)}
                                </span>
                                <span className="k">
                                  {t(`check.kind.${item.kind}`)} ·{" "}
                                  {t("check.updated", {
                                    date: formatDate(item.updated, locale),
                                  })}
                                </span>
                                <p className="cta">
                                  <Link
                                    className="btn btn-secondary btn-sm"
                                    href={`/${locale}/public-answer/${item.id}`}
                                  >
                                    {t("ai.readThis")}
                                  </Link>
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* -- already released to somebody who asked before ----- */}
                    {i === lastBot && replies.length > 0 && (
                      <div className="chat-card chat-card-replies">
                        <div className="head">
                          <span className="ic" aria-hidden="true">
                            <Icon name="chat" />
                          </span>
                          <span className="t">{t("ai.repliesTitle")}</span>
                        </div>
                        <div className="body">
                          <ul className="found-list">
                            {replies.map(({ item }) => (
                              <li key={item.id}>
                                <span className="t">
                                  {replyQuestion(item, locale)}
                                </span>
                                <span className="k">
                                  {t("arch.askedBy", {
                                    who: item.requester,
                                    filed: formatDate(item.filed, locale),
                                    replied: formatDate(item.replied, locale),
                                  })}
                                </span>
                                <p className="ans">
                                  {replyAnswer(item, locale)}
                                </p>
                              </li>
                            ))}
                          </ul>
                          <p className="mb-0">
                            <Link className="btn btn-secondary btn-sm" href={`/${locale}/published`}>
                              {t("ai.replySeeIt")}
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* -- nothing out there, so where does it go? ----------- */}
                    {i === lastBot && !alreadyOut && result?.kind === "in-scope" && (
                      <div className="chat-card chat-card-route">
                        <div className="head">
                          <span className="ic" aria-hidden="true">
                            <Icon name="building" />
                          </span>
                          <span className="t">{t("ai.routeTitle")}</span>
                        </div>
                        <div className="body">
                          <p>
                            <strong>{authorityName(result.central.item, locale)}</strong>
                          </p>
                          {result.central.matched.length > 0 && (
                            <p className="muted">
                              {t("ai.matched")}: {result.central.matched.slice(0, 5).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* -- the stop, before any money changes hands ---------- */}
                    {i === lastBot && result?.kind === "out-of-scope" && (
                      <div className="chat-card chat-card-stop">
                        <div className="head">
                          <span className="ic" aria-hidden="true">
                            <Icon name="alert" />
                          </span>
                          <span className="t">{t("ai.stopTitle")}</span>
                        </div>
                        <div className="body">
                          <p>
                            {redirectNote(result.state.item, locale)}
                          </p>
                          <p>
                            <strong>{t("authority.outOfScopeGo")}: </strong>
                            {redirectLabel(result.state.item, locale)}
                          </p>
                          <p>
                            <strong>{t("authority.charged")}</strong>
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ol>

              {/* The next step lives with the result it follows — read what is
                  already out there, or carry on and file — not floating in the
                  composer. */}
              {(canFile || result?.kind === "out-of-scope") && (
                <div className="chat-actions">
                  {canFile && (
                    <form action={continueToRouting}>
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className={alreadyOut ? "btn btn-secondary" : "btn"}
                      >
                        {alreadyOut ? t("ai.fileAnyway") : t("ai.fileThis")}
                      </button>
                    </form>
                  )}
                  {result?.kind === "out-of-scope" && (
                    <form action={restart}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="to" value="chat" />
                      <button type="submit" className="btn btn-secondary">
                        {t("authority.askAgain")}
                      </button>
                    </form>
                  )}
                </div>
              )}
              </>
            )}
          </div>
        </div>

        <div className="chat-dock">
          <div className="inner">
            {error === "empty" && (
              <p className="error-text" role="alert">
                {t("ask.error")}
              </p>
            )}

            <form action={askAssistant}>
              <input type="hidden" name="locale" value={locale} />
              <div className="row">
                <label className="visually-hidden" htmlFor="question">
                  {t("ai.placeholder")}
                </label>
                <textarea
                  id="question"
                  name="question"
                  rows={1}
                  required
                  lang={locale}
                  placeholder={t("ai.placeholder")}
                />
                <button type="submit" className="btn send">
                  {t("ai.send")}
                </button>
              </div>
            </form>

            {file?.aiUsed && <p className="foot">{t("ai.disclaimer")}</p>}
          </div>
        </div>
      </div>

      {/* Progressive enhancement only: open the conversation on the latest turn,
          not the oldest. Renders nothing and holds no state, so with scripting
          off the transcript still reads top to bottom and every control works. */}
      {chat.length > 0 && <ScrollToLatest turn={chat.length} />}
    </main>
  );
}
