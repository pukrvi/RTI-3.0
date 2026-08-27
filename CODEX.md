# Codex in this build

The hackathon brief asks that Codex be a meaningful part of how the prototype is built,
and the video's second minute is about how it was built. This file is the record: every
Codex invocation, what it found, and what was accepted or rejected. It is deliberately
honest about the division of labour, because the division of labour was a choice.

**Codex CLI 0.144.3**, run non-interactively with `codex exec`, sandboxed read-only so
every change went through review before it landed.

## The division of labour

| Who | What |
|---|---|
| Human (Puneet) | The audit of the live portal, the problem choice, the seven-step journey, the hard rules, and the decision to keep v0 deterministic |
| Claude | The i18n layer, design system, seven routes, server actions, storage, statutory clock, and the Playwright / axe / contrast verification |
| **Codex** | **Three independent review passes over the finished build — Hindi interface copy, code defects, and the portal shell — plus the fixes those produced** |

Codex was used as an adversarial second reader rather than a first-draft writer. That was
a deliberate choice for a solo entry against a hard deadline: one model writing and a
different one attacking the result catches more than either alone, and every finding is
attributable. The cost is that Codex arrives late in the build, which this file states
plainly rather than dressing up.

---

## Pass 1 — Hindi interface copy

```
codex exec --skip-git-repo-check --sandbox read-only \
  "Review the Hindi interface copy of this prototype ... Compare src/i18n/hi.json
   against src/i18n/en.json key by key ... Flag only real problems ... Be strict: I
   would rather have 8 real problems than 40 stylistic preferences."
```

Full prompt and reply: `docs/codex/hindi-review.md`.

Eight findings, seven accepted outright:

| Key | Problem Codex found |
|---|---|
| `check.corpusNote` | "धारा-4 स्वतःप्रकटन" reads as machine translation |
| `authority.unclearBody` | "स्वतः मार्ग निर्धारण" is needlessly technical |
| `compose.filingWith` | "आवेदन जा रहा है" is an incomplete sentence |
| `compose.tipsTitle` | does not read as a heading |
| `track.regNoMock` | "भुगतान मिलान" is the wrong sense of *reconciliation* |
| `appeal.intro` | first sentence incomplete |
| `about.mock3` | "बटन से चलते हैं" is meaningless |
| `about.mock6` | "की-वैल्यू भंडार" and "टिकाऊ" are jargon for a first-time filer |

**One suggestion was rejected.** In `appeal.intro` Codex proposed replacing खाना with
खाता for "form field". खाता means an account or a ledger; खाना is the standard word for a
box on a form. The incomplete first sentence was fixed, the word was kept.

## Pass 2 — code review

```
codex exec --skip-git-repo-check --sandbox read-only \
  "Review this Next.js 16 App Router prototype for defects ... WCAG 2.1 AA, GIGW 3.0,
   mobile-first, and it must keep working with JavaScript disabled ... Do not comment on
   styling preferences, naming, or code organisation ... Be strict - only things that are
   actually wrong."
```

Full prompt and reply: `docs/codex/code-review.md`.

Six findings, all acted on:

| Severity | Finding | What was done |
|---|---|---|
| **High** | `deadline.ts` — a silent CPIO could be appealed against **on** the 30-day deadline, when the reply is still due rather than late | Fixed: the window now opens the following IST day for a non-reply, and immediately for a reply. Pinned by six unit tests in `tests/deadline.test.mts` |
| Medium | `Steps.tsx` — a visually-hidden `h2` sat above every page's `h1`, breaking heading order | Now a visually-hidden paragraph |
| Medium | Ask page — `aria-invalid` set, but the error text was not in `aria-describedby` | Fixed |
| Medium | Compose page — four inline errors had no ids and were not associated with their fields | All four given ids and wired up |
| Medium | `PrintButton` — a JavaScript-only control shown to citizens without JavaScript | Now renders only after mount, so it is never a dead button |
| Low | `error.tsx` — a client component, contrary to the "one client component" claim | Claim corrected in the README; the boundary was also localised, which it had not been |

The high-severity one is the interesting result. It is a real statutory-arithmetic bug in
the one calculation the whole prototype argues the live portal should be doing, it was
invisible on screen, and no accessibility tool or end-to-end test would ever have caught
it.

## Pass 3 — the portal shell and the new pages

Run after the homepage, accessibility bar, navigation, search, authority list, disclosure
log, tracking index and help page were added. Full prompt and reply:
`docs/codex/shell-review.md`.

Five findings, all acted on:

| Severity | Finding | What was done |
|---|---|---|
| **High** | `safeNext` accepted `/\evil.example`. A browser normalises the backslash, turning it into a scheme-relative link, so all three preference forms carried an open redirect | Moved into `src/lib/redirect.ts`, rewritten to reject anything that leaves the site, and pinned by unit tests covering six hostile inputs |
| **High** | `demoClock`, `demoReply`, `demoSilence` and `fileAppeal` trusted a form-supplied case id. Anyone holding a tracking link could move somebody else's statutory deadline, or file an appeal in their name | Reading a case by id stays open — that is what a tracking link is for, and there are no accounts here. Mutating one now requires the cookie that filed it. Regression test drives a second browser context |
| Medium | `payAndFile` re-checked only two of the four required fields, so the action could be invoked directly to file a nameless request | All four revalidated at the point of filing |
| Medium | `Number()` on the demo clock accepted `NaN` and `Infinity`, which would have been persisted | `safeOffset` requires a finite integer and clamps it, with its own tests |
| Medium | Two `search` landmarks on `/search`, neither named — a screen-reader landmark list announced two indistinguishable "search" regions | Each form given a distinct `aria-label` |

The two high-severity findings are both mine and both invisible from the interface: an
open redirect I introduced while making the accessibility controls return you to the page
you were on, and an authorisation gap created by putting the case id in the URL so that
tracking links would work. Neither would have been caught by an accessibility audit, an
end-to-end test, or a screenshot.

---

## A pass to run yourself, for the video

This one is left unrun deliberately, so there is footage of Codex working rather than a
transcript of it having worked. From `prototype/app`:

```bash
codex exec --skip-git-repo-check --sandbox read-only "Read src/data/authorities.ts. For each of the 40 Central authorities, judge whether its plain-language `subjects` keywords are what an ordinary citizen would actually type — not what a civil servant would. Flag any authority whose keywords are so narrow that a real question would miss it, and any keyword likely to pull in questions that belong to a different body. Suggest at most three keywords to add or remove per authority, and only where it matters. Do not edit files."
```

It targets the weakest part of the build — routing quality is the product, and the
keyword lists are hand-written — and it produces a visible, explicable diff.

## What Codex did not do

It did not write the app. Saying otherwise would be the kind of claim this prototype
exists to argue against.
