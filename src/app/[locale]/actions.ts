"use server";

import { redirect } from "next/navigation";
import { getT, normaliseLocale } from "@/i18n";
import { EIGHTH_SCHEDULE } from "@/i18n/languages";
import { readQuestion } from "@/lib/ai";
import { matchPublished, verdict } from "@/lib/match";
import { scaffoldBody, scaffoldSubject } from "@/lib/scaffold";
import {
  newCaseId,
  putCase,
  getCase,
  updateCase,
  deleteCase,
  indexRef,
  findByRef,
  addToAccount,
  getProfile,
  putProfile,
  type CaseFile,
  type Profile,
} from "@/lib/store";
import {
  currentSession,
  methodFor,
  pendingSession,
  setPending,
  signIn,
  signOut,
} from "@/lib/session";
import { readPrefs, writePrefs, type Contrast, type TextSize } from "@/lib/prefs";
import { safeNext, safeOffset } from "@/lib/redirect";
import {
  readCaseId,
  setCaseCookie,
  clearCaseCookie,
  authorityById,
} from "@/lib/case";
import { makeRef } from "@/lib/ref";
import { effectiveNow, appealWindow } from "@/lib/deadline";

/**
 * Server actions for the whole journey.
 *
 * Every one of these is reachable from a plain <form> with no JavaScript: the
 * citizen may be on a low-end phone on a slow connection, and a form that only
 * works once 200 KB of script has downloaded is not a service.
 *
 * Note what is absent. Nothing here validates the character set of anything the
 * citizen writes. The live portal restricts the request body to A-Z, a-z, 0-9
 * and a handful of punctuation marks, which excludes every Indian script; that
 * restriction is the bug this prototype exists to fix, and reintroducing it
 * anywhere — even as a "sanity check" — would undo the point.
 */

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireCase(): Promise<CaseFile | null> {
  return getCase(await readCaseId());
}

/**
 * Step 1, conversational.
 *
 * One turn of the assistant: append what the citizen said, ask the model to read
 * it, append the answer, and stay on the page. If no model is configured — or the
 * call fails — the deterministic matcher answers instead and the interface says
 * which of the two is speaking.
 */
export async function askAssistant(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const question = str(form, "question");
  if (!question) redirect(`/${locale}/ask/chat?error=empty`);

  let file = await requireCase();
  if (!file || file.filed) {
    const id = newCaseId();
    file = {
      id,
      createdAt: new Date().toISOString(),
      locale,
      question,
      clockOffsetDays: 0,
      chat: [],
    };
    await putCase(file);
    await setCaseCookie(id);
  }

  const history = (file.chat ?? []).slice(-6);
  const languageName =
    EIGHTH_SCHEDULE.find((l) => l.code === locale)?.english ?? "English";
  const read = await readQuestion(question, languageName, history);

  const t = getT(locale);
  let reply = read.reply;
  if (!read.available || !reply) {
    // The deterministic answer, phrased for a conversation. Two pathways: if
    // something is already published, that is the more useful thing to say
    // first — the citizen may not need to file at all.
    const v = verdict(question);
    if (matchPublished(question).length) reply = t("ai.replyPublished");
    else if (v.kind === "out-of-scope") reply = t("ai.replyState");
    else if (v.kind === "in-scope") reply = t("ai.replyCentral");
    else reply = t("ai.replyUnclear");
  }

  await updateCase(file.id, {
    question,
    chat: [
      ...(file.chat ?? []),
      { role: "user" as const, text: question },
      { role: "app" as const, text: reply },
    ],
    aiUsed: read.available,
    betterQuestion: read.betterQuestion,
  });

  redirect(`/${locale}/ask/chat`);
}

/** Take the assistant's sharper wording instead of your own. */
export async function useBetterQuestion(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const file = await requireCase();
  if (!file?.betterQuestion) redirect(`/${locale}/ask/chat`);
  await updateCase(file.id, { question: file.betterQuestion });
  redirect(`/${locale}/ask/chat`);
}

/**
 * The way out of RTI Sahayak into the filing form.
 *
 * Everything the conversation learned travels with the citizen: the question,
 * and — when the routing was certain — the authority, which arrives on the form
 * filled in and editable, never decided for them.
 */
export async function continueToRouting(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const existing = await requireCase();
  if (!existing) redirect(`/${locale}`);

  const patch: Partial<CaseFile> = { dismissedPublished: true };
  if (!existing.authorityId) {
    const v = verdict(existing.question);
    if (v.kind === "in-scope") patch.authorityId = v.central.item.id;
  }
  await updateCase(existing.id, patch);
  redirect(`/${locale}/file`);
}

/**
 * The single filing form. Saved first, validated second, so nothing typed is
 * ever lost, and every guardrail runs before the money, not after it.
 */
export async function submitFiling(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const existing = await requireCase();

  const values = {
    question: str(form, "question"),
    authorityId: str(form, "authorityId"),
    subject: str(form, "subject"),
    body: str(form, "body"),
    name: str(form, "name"),
    email: str(form, "email"),
    addr1: str(form, "addr1"),
    addr2: str(form, "addr2"),
    addr3: str(form, "addr3"),
    pin: str(form, "pin"),
  };

  let file = existing;
  if (!file || file.filed) {
    const id = newCaseId();
    file = { id, createdAt: new Date().toISOString(), locale, clockOffsetDays: 0, ...values };
    await putCase(file);
    await setCaseCookie(file.id);
  } else {
    file = (await updateCase(file.id, values)) ?? file;
  }

  const missing = (["question", "authorityId", "subject", "body", "name", "email"] as const).filter(
    (k) => !values[k],
  );
  if (missing.length) redirect(`/${locale}/file?error=${missing.join(",")}`);
  if (!authorityById(values.authorityId)) redirect(`/${locale}/file?error=authorityId`);

  // The two checks that the live portal does after taking the ₹10, done here
  // before it. Both are gates on this journey, and both offer a way through —
  // the citizen may know better than the keyword matcher.
  if (str(form, "confirmed") !== "1") {
    const v = verdict(values.question);
    if (v.kind === "out-of-scope") redirect(`/${locale}/file?error=state`);
    if (!file?.dismissedPublished && matchPublished(values.question).length) {
      redirect(`/${locale}/file?notice=published`);
    }
  }
  redirect(`/${locale}/pay`);
}

/** On the single page, the citizen says: the stop does not apply, take me on. */
export async function confirmAndProceed(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const existing = await requireCase();
  if (!existing || existing.filed) redirect(`/${locale}/file`);
  if (str(form, "dismiss") === "1") await updateCase(existing.id, { dismissedPublished: true });
  redirect(`/${locale}/pay`);
}

/**
 * Scaffold the letter from the question, on the same page.
 *
 * No JavaScript is involved: the button posts the form, the question is saved,
 * the letter comes back started. A citizen who never presses it loses nothing.
 */
export async function draftLetter(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const existing = await requireCase();

  const question = str(form, "question");
  if (!question) redirect(`/${locale}/file?error=question`);

  if (!existing || existing.filed) {
    const id = newCaseId();
    await putCase({
      id,
      createdAt: new Date().toISOString(),
      locale,
      clockOffsetDays: 0,
      question,
      authorityId: str(form, "authorityId") || undefined,
      subject: scaffoldSubject(question, getT(locale)),
      body: scaffoldBody(question, getT(locale)),
      name: str(form, "name") || undefined,
      email: str(form, "email") || undefined,
      addr1: str(form, "addr1") || undefined,
      addr2: str(form, "addr2") || undefined,
      addr3: str(form, "addr3") || undefined,
      pin: str(form, "pin") || undefined,
    });
    await setCaseCookie(id);
  } else {
    await updateCase(existing.id, {
      question,
      authorityId: str(form, "authorityId") || existing.authorityId,
      subject: scaffoldSubject(question, getT(locale)),
      body: scaffoldBody(question, getT(locale)),
    });
  }
  redirect(`/${locale}/file?scaffolded=1`);
}

/** The mocked ₹10. No money moves and no payment field exists. */
export async function payAndFile(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const existing = await requireCase();
  if (!existing) redirect(`/${locale}/file`);

  const authority = authorityById(existing.authorityId);
  if (!authority) redirect(`/${locale}/file?error=authorityId`);
  const missing = (["subject", "body", "name", "email"] as const).filter(
    (k) => !existing[k],
  );
  if (missing.length) redirect(`/${locale}/file?error=${missing.join(",")}`);

  const at = new Date().toISOString();
  const session = await currentSession();
  const ref = makeRef(authority.code, "R", at, existing.id);
  await updateCase(existing.id, {
    filed: { ref, at },
    owner: session?.contact,
  });
  await indexRef(ref, existing.id);
  if (session) {
    await addToAccount(session.contact, existing.id);
    // What was typed at filing joins the account, so the next request starts
    // from it. The account is what makes the second filing short.
    const saved = (await getProfile(session.contact)) ?? {};
    await putProfile(session.contact, {
      ...saved,
      name: existing.name || saved.name,
      email: existing.email || saved.email,
      addr1: existing.addr1 || saved.addr1,
      addr2: existing.addr2 || saved.addr2,
      addr3: existing.addr3 || saved.addr3,
      pin: existing.pin || saved.pin,
      updatedAt: new Date().toISOString(),
    });
  }

  redirect(`/${locale}/file/done`);
}

/* ------------------------------------------------------------------ demo --
 * Labelled demo affordances, not hidden query parameters. A 30-day statutory
 * deadline cannot be demonstrated in a two-minute video without one, and the
 * honest way to do that is a visible control that says what it is.
 * ------------------------------------------------------------------------ */

/**
 * A case can be read by anyone holding its id — that is how a tracking link
 * works, and there are no accounts here. Changing one is different: only the
 * browser that filed it may do that, or a shared link would let a stranger
 * move somebody's deadline or file an appeal in their name.
 */
async function ownCase(id: string): Promise<CaseFile | null> {
  if (!id || (await readCaseId()) !== id) return null;
  return getCase(id);
}

export async function demoClock(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const id = str(form, "caseId");
  const mode = str(form, "mode");
  const amount = safeOffset(str(form, "days"));

  const existing = await ownCase(id);
  if (!existing) redirect(id ? `/${locale}/track/${id}` : `/${locale}`);

  let offset = existing.clockOffsetDays;
  if (mode === "reset") offset = 0;
  else if (mode === "set") offset = amount;
  else offset = offset + amount;

  await updateCase(id, { clockOffsetDays: safeOffset(String(Math.max(0, offset))) });
  redirect(`/${locale}/track/${id}`);
}

export async function demoReply(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const id = str(form, "caseId");
  const rawKind = str(form, "kind");
  const kind =
    rawKind === "partial-refusal" || rawKind === "refused" ? rawKind : "full";

  const existing = await ownCase(id);
  if (!existing) redirect(id ? `/${locale}/track/${id}` : `/${locale}`);

  await updateCase(id, {
    reply: { at: effectiveNow(existing.clockOffsetDays).toISOString(), kind },
  });
  redirect(`/${locale}/track/${id}`);
}

export async function demoSilence(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const id = str(form, "caseId");

  const existing = await ownCase(id);
  if (!existing) redirect(id ? `/${locale}/track/${id}` : `/${locale}`);

  await updateCase(id, { reply: undefined });
  redirect(`/${locale}/track/${id}`);
}

/** Step 7 — the first appeal. No fee: that is statutory, not a concession. */
export async function fileAppeal(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const id = str(form, "caseId");
  const ground = str(form, "ground") || "other";
  const text = str(form, "text");

  const existing = await ownCase(id);
  if (!existing?.filed) redirect(id ? `/${locale}/track/${id}` : `/${locale}`);

  const authority = authorityById(existing.authorityId);
  if (!authority) redirect(`/${locale}/file?error=authorityId`);

  const now = effectiveNow(existing.clockOffsetDays);
  const window = appealWindow(existing.filed.at, now, existing.reply?.at);
  if (!window.isOpen) redirect(`/${locale}/track/${id}?error=window`);

  const at = now.toISOString();
  const ref = makeRef(authority.code, "A", at, existing.id);
  await updateCase(id, { appeal: { ref, at, ground, text } });
  await indexRef(ref, id);
  redirect(`/${locale}/track/${id}`);
}

/**
 * Clear everything and go back to the start.
 *
 * The chat's own "New question" posts `to=chat` and lands back on the empty
 * conversation, where the preset topics are — restarting a question should
 * not leave the tool. Everywhere else a restart returns to the homepage.
 */
export async function restart(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const id = await readCaseId();
  if (id) await deleteCase(id);
  await clearCaseCookie();
  redirect(str(form, "to") === "chat" ? `/${locale}/ask/chat` : `/${locale}`);
}

/* ------------------------------------------------- display preferences ----
 * Text size, contrast and the top notice. Plain form buttons posting to the
 * server, so the citizen who has JavaScript switched off still gets larger
 * text — which is very often the same citizen who needs it.
 * ------------------------------------------------------------------------ */

const TEXT_STEPS: TextSize[] = ["xs", "sm", "base", "lg", "xl"];

/**
 * A stepper, not three toggles. "A−" and "A+" move one step and "A" goes back
 * to normal, which is what those symbols promise — three buttons where the
 * current one happens to be labelled "A−" reads as a broken control.
 */
export async function setTextSize(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const next = safeNext(str(form, "next"), locale);
  const value = str(form, "value");
  const prefs = await readPrefs();

  const at = TEXT_STEPS.indexOf(prefs.text);
  let text: TextSize = prefs.text;
  if (value === "larger") text = TEXT_STEPS[Math.min(at + 1, TEXT_STEPS.length - 1)];
  else if (value === "smaller") text = TEXT_STEPS[Math.max(at - 1, 0)];
  else if (value === "reset") text = "base";
  else if (TEXT_STEPS.includes(value as TextSize)) text = value as TextSize;

  await writePrefs({ ...prefs, text });
  redirect(next);
}

export async function setContrast(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const next = safeNext(str(form, "next"), locale);
  const value = str(form, "value") as Contrast;
  const prefs = await readPrefs();
  await writePrefs({ ...prefs, contrast: value === "high" ? "high" : "normal" });
  redirect(next);
}

/** Language menu: swap the locale segment and stay on the same page. */
export async function switchLanguage(form: FormData) {
  const current = normaliseLocale(str(form, "locale"));
  const target = str(form, "code");
  const next = safeNext(str(form, "next"), current);
  const chosen = normaliseLocale(target);
  redirect(`/${chosen}${next.replace(/^\/[^/]+/, "")}`);
}

/** Find a filed request from its registration number alone. */
export async function lookupByRef(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const ref = str(form, "ref");
  const found = await findByRef(ref);
  if (!found?.filed) redirect(`/${locale}/account/track?error=notfound`);
  redirect(`/${locale}/track/${found.id}`);
}

/* ------------------------------------------------------------- sign-in ----
 * Simulated end to end. No account is created, no password exists, no code is
 * generated or sent, and the code screen accepts any six digits. Every screen
 * in the flow says so.
 * ------------------------------------------------------------------------ */

export async function startLogin(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const contact = str(form, "contact");
  if (!contact) redirect(`/${locale}/login?error=contact`);

  await setPending({ contact, method: methodFor(contact) });
  redirect(`/${locale}/login/code`);
}

/**
 * The Aadhaar way in: a labelled demo, like everything else in this flow. A
 * real integration would hand off to UIDAI eKYC and come back with a verified
 * identity; there is no such handoff here, so the button sets a visibly
 * masked demo identity and continues into the same simulated code step as the
 * contact flow — any six digits, nothing sent.
 */
export async function startAadhaarLogin(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  await setPending({ contact: getT(locale)("auth.login.aadhaarDemo"), method: "email" });
  redirect(`/${locale}/login/code`);
}

/**
 * The card on /login signs in directly: any username and any password work.
 * The password is read by nobody and stored nowhere — there is no credential
 * here to steal, only a demo of the step. Anything already filed in this
 * browser joins the account, exactly as in verifyCode.
 */
export async function signInWithPassword(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const contact = str(form, "contact");
  if (!contact) redirect(`/${locale}/login?error=contact`);

  const session = { contact, method: methodFor(contact) };
  await signIn(session);

  const draft = await requireCase();
  if (draft?.filed) {
    await updateCase(draft.id, { owner: session.contact });
    await addToAccount(session.contact, draft.id);
  }

  redirect(`/${locale}/account`);
}

export async function verifyCode(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const code = str(form, "code").replace(/\s/g, "");
  const pending = await pendingSession();

  if (!pending) redirect(`/${locale}/login`);
  if (!/^\d{6}$/.test(code)) redirect(`/${locale}/login/code?error=code`);

  await signIn(pending);

  // Anything already filed in this browser joins the account.
  const draft = await requireCase();
  if (draft?.filed) {
    await updateCase(draft.id, { owner: pending.contact });
    await addToAccount(pending.contact, draft.id);
  }

  redirect(`/${locale}/account`);
}

/**
 * Save the applicant's details once, instead of on every form.
 *
 * Nothing is mandatory here. A half-filled profile still saves half the typing
 * at filing time, and a form that refuses to remember your name because you
 * have not chosen a habitation type is worse than no form.
 */
export async function saveProfile(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  const session = await currentSession();
  if (!session) redirect(`/${locale}/login`);

  const pick = <T extends string>(key: string, allowed: readonly T[]): T | undefined => {
    const value = str(form, key);
    return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
  };

  const bpl = pick("bpl", ["yes", "no"] as const);

  const profile: Profile = {
    ...((await getProfile(session.contact)) ?? {}),
    name: str(form, "name"),
    email: str(form, "email"),
    mobile: str(form, "mobile"),
    phone: str(form, "phone"),
    gender: pick("gender", ["male", "female", "third"] as const),
    addr1: str(form, "addr1"),
    addr2: str(form, "addr2"),
    addr3: str(form, "addr3"),
    pin: str(form, "pin"),
    country: pick("country", ["india", "other"] as const),
    state: str(form, "state"),
    habitation: pick("habitation", ["rural", "urban"] as const),
    education: pick("education", ["literate", "illiterate"] as const),
    citizenship: pick("citizenship", ["indian", "other"] as const),
    bpl,
    bplCard: bpl === "yes" ? str(form, "bplCard") : "",
    bplYear: bpl === "yes" ? str(form, "bplYear") : "",
    bplAuthority: bpl === "yes" ? str(form, "bplAuthority") : "",
    updatedAt: new Date().toISOString(),
  };

  await putProfile(session.contact, profile);
  const next = str(form, "next");
  redirect(next.startsWith(`/${locale}/`) ? next : `/${locale}/account/profile?saved=1`);
}

export async function signOutAction(form: FormData) {
  const locale = normaliseLocale(str(form, "locale"));
  await signOut();
  redirect(`/${locale}`);
}
