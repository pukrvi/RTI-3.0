# RTI 3.0 — a rebuild of India's RTI Online portal

**Unofficial prototype. Not a government service.** Not affiliated with, endorsed by or
connected to the Government of India, DoPT or NIC. No State Emblem, no Government of
India branding, no NIC or DoPT marks are used anywhere. Nothing filed here reaches any
public authority.

---

## The one problem

On `rtionline.gov.in`, a citizen's RTI application can fail before anybody reads it —
because it went to the wrong body, because the answer was already published, or because
the question was unanswerable as written. **The portal takes the ₹10 first and says so
weeks later, without a refund.**

The evidence is our own read-only audit of the live portal on 22 August 2026 — 13
documented gaps, 75 observations, and three international benchmark portals:

| What the audit found | Where |
|---|---|
| Central-only scope stated four times in prose, enforced zero times in software | Gap 02, 03 |
| Out-of-scope applications returned **without refund** — the portal's own banner and status remarks | Gap 03 |
| 2,916 public authorities in an alphabetical accordion: no search, no filter, no Central/State label | F67 |
| The official manual's own screenshot shows the same applicant returned three times | F4 |
| The return message names no correct portal, no address, no next step | F3 |
| The request body accepts only `A-Z a-z 0-9` and some punctuation — excluding every Indian script, in a portal that offers a Hindi interface | Gap 01 |
| No archive, no disclosure log, no search anywhere on the portal | Gap 11, F73, F74 |
| The 30-day statutory deadline is computable from data the portal already stores, and is displayed nowhere | Gap 06, F36, F37 |
| No route at all from a status screen to the appeal form | F53 |

## What we changed

The order of operations. **Everything that can fail is checked before the money.**

| Step | The live portal | This prototype |
|---|---|---|
| 1. Ask | Choose a ministry from 2,916 options, then write in Latin script only | Say what you want to know, in any Indian script |
| 2. Already public? | No search, no archive, no prior-art check | Matched against a published-material corpus first; if it is there, you get it now and never file |
| 3. Who holds it? | You guess. Wrong guesses cost ₹10 and six weeks | Routed and explained; a State subject is **stopped before payment** with a pointer onward |
| 4. Write it | 3,000 characters, no guidance, no draft saving | Two fields, letter scaffolded from your own words, previewed before sending |
| 5. Pay ₹10 | Taken first, scope checked afterwards | Taken last, after everything that could fail has been checked |
| 6. Track | Filing date stored, deadline never computed | 30-day statutory clock computed and shown, with the section it comes from |
| 7. Reply or appeal | No link from status to appeal, no window shown | Appeal prefilled, ground preselected, window and closing date shown |

---

## The portal, not just the journey

The seven-step journey is the argument. The portal around it is what makes it a service
somebody could be handed. Every part of it answers an audited defect:

| Audited defect | What is here instead |
|---|---|
| Homepage explains nothing: not what RTI is, who may use it, what it costs, how long it takes (F5) | "What the law gives you" — ₹10, 30 days, ₹0 to appeal, no reason needed — each with its section of the Act |
| The only prominent call to action is a small text link *inside* a promotional graphic (F7) | Two entry points: **Ask RTI Sahayak** for people who only know what they want to find out, and four named tasks for people who already know |
| 2,581 public authorities in an alphabetical accordion with no search and no filter (F67) | The same official list — 94 ministries and departments, 2,487 authorities under them — filtering as you type, reaching *inside* the headings, opening what it matched, with a shareable URL per department |
| The statutory-process flowchart is a raster image: no text alternative, English-only, on one page (F68) | Seven steps as real text, translated, resizable |
| Announcements scroll in a marquee with no pause control (F71) | A dated list that holds still |
| No archive, no disclosure log, no link to section-4 disclosures (Gap 11, F73) | `/published`, browsable |
| `Login` is the sixth of ten items in a citizen menu, unlabelled (IA) | Five citizen tasks on the left of the nav, `Sign in` on the right — the arrangement both benchmark portals use |
| `View Status`, `View History` and `Submit First Appeal` are three journeys with three different credential prompts, across five screens all titled "Online RTI Status Form" (IA) | One account. Sign in with an email address or a mobile number, get a six-digit code, and every request, deadline and appeal is in one list |
| `User Manual` (a 29-page PDF), `FAQ` and `Payment Reconciliation` are three destinations | One `Help & FAQ` page |
| Two languages in a dropdown, on a portal whose request field accepts the script of neither (Gap 01) | All 23 — English plus the 22 Eighth Schedule languages — named in their own script. Two are live; the rest are listed and disabled, so the gap is visible instead of hidden |
| Accessibility controls are a stray row of `A+ A A-` above the masthead | Text size and contrast in the header, applied on the server from a cookie, working with scripting off |
| Deep links bounce to the homepage without a session token (F72) | Every view is a real URL, filters and department pages included |

### Login and the account, simulated end to end

Log in with an email address or a mobile number, receive a six-digit code, enter any six
digits, and land in an account with its own menu down the side: **Dashboard · File a new
request · Track status · View history · File appeal · Payments and receipts · Account
information**. Every screen in that flow says what it is: **no account is created, no
password exists, no code is generated or sent**, and the brief forbids handling real
one-time-code data — a realistic-looking fake one is not meaningfully safer than a real
one.

Those seven pages replace five unrelated top-level menu items, each with its own
credential prompt and none of them linking to any other. Three things follow from putting
them in one place:

* **The dashboard leads with what needs you.** The live portal's dashboard is six numbers
  in a 2×3 grid — Registered, Disposed of, Pending, twice — with no dates and no marker on
  the filing about to breach thirty days. The six numbers are here, third on the page. The
  first thing is the list of filings waiting on the citizen, each with the reason.
* **Details are typed once.** `Account information` holds every field the live request
  form demands on *every* filing — name, email, mobile, landline, gender, three address
  lines, PIN code, country, State, habitation, educational status, citizenship and the BPL
  block — and fills the request form in from them. It asks for no Aadhaar number, no PAN,
  no card details and no password, and says so on the page. The BPL card fields carry a
  visible demonstration badge telling you not to type a real number.
* **Below the poverty line means no fee.** Section 7(5) sets the fee at nil. Answer the
  BPL question in your details and the payment step disappears instead of asking you to
  pay ₹10 anyway.

Worth recording as a real trade-off rather than a feature: the live portal has no citizen
account at all, and that is one of the few things it gets right, because it avoids
building an identity record around politically sensitive requests. An account buys the
citizen one place to see their filings and costs them that protection. This prototype
takes the account and stores as little as it can — an opaque cookie, a contact string, a
24-hour TTL.

### RTI Sahayak — the assistant

Step 1 is a conversation. The citizen describes what they want to know in any Indian
language; an OpenAI model reads it, decides whether it is a Central or a State subject,
picks candidate authorities **only from our own list**, and suggests a sharper way to ask.

Three constraints on it, all enforced in code:

- It cannot invent an authority. Every id it returns is checked against `authorities.ts`
  before anything is shown.
- It is never the only answer. The deterministic matcher runs regardless, next to it,
  showing which of the citizen's own words produced the match.
- It decides nothing irreversible. Nothing is filed and no money moves until the citizen
  has read the application and pressed the button.

With no `OPENAI_API_KEY` configured the layer reports itself unavailable, the keyword
matcher answers instead, and the badge on screen changes from `AI-assisted` to
`Keyword matching`. The chat is forms and page loads — no streaming, no websocket, no
client-side state — so it works on a 2G connection and with JavaScript switched off.

## What actually works

Everything in the seven-step journey, end to end, in English and Hindi, plus the portal
pages above. Verified, not asserted — see **Verification** below.

- **Routing** over 40 real Central ministries and departments plus 10 real categories of
  State body. Deterministic keyword scoring on the server: no model call, no network, and
  every match shows the citizen which of their own words caused it.
- **Prior-art matching** over a synthetic corpus of published material.
- **The Central/State stop** before payment, with the reason in plain language and a
  pointer to where the citizen should actually go.
- **Full Unicode** in every field. No character allowlist exists anywhere in this
  codebase. The preview screen names the script you wrote in and says it was accepted
  unchanged.
- **The statutory clock** — 30 days to reply under section 7(1), 30 days to appeal under
  section 19(1), a deemed refusal when the first window closes in silence.
- **The appeal**, prefilled from the request, with the ground preselected from what
  actually happened, and no fee, because a first appeal carries none.
- **Hindi throughout**, including routing keywords — a Hindi question routes on Hindi
  words, not on a translation of the interface.
- **No JavaScript required.** Every step is a plain form posting to a server action, and
  the whole seven-step journey — plus the accessibility controls, the notice's close
  button, search and the authority filter — is tested with scripting disabled. Five
  components are client components and none is on the critical path: three pieces of
  chrome that need to know which page you are on (Next preserves a shared layout across
  client navigation and does not re-render it, so a server-rendered path goes stale),
  the print button, which does not render until it has mounted so it is never a dead
  control, and the error boundary, which Next requires to be one.

## What is mocked, and labelled as mocked in the interface

Every item below carries a visible badge on the screen it appears on, not just a line in
this file.

| Mocked | What that means |
|---|---|
| The ₹10 payment | No money moves. **There is no card, UPI, bank or OTP field anywhere in this prototype**, and no fake-looking value of any of those is generated or displayed. The button writes a row to a key-value store. |
| The already-public corpus | All 12 records are invented. No real document is reproduced. In production this layer would index each authority's section-4 proactive disclosures, its published datasets, and previously released RTI replies. |
| Officer replies | Written by us, triggered by a labelled demo button. No officer has seen anything. |
| Registration numbers | Correct shape (`AAAAA/R/E/YY/NNNNN`, from the portal's own manual), generated locally, meaningless outside this prototype. |
| The clock | The demo controls move a display-only date so a 30-day deadline can be shown in a two-minute video. Stored timestamps never move, and the screen says both dates out loud whenever the demo clock is off zero. |
| Draft storage | Cloudflare KV keyed to an opaque cookie, 24-hour TTL, no account, no login. Not durable, and the footer says which driver is live. |

**Not present at all:** no Aadhaar, PAN, OTP, card or bank data; no connection of any kind
to any government system, live or test; no accounts, notifications, officer-side views,
appeal-decision stage, or AI model call.

The `/en/about` page says all of this to the citizen, and is linked from the banner and
the footer of every page.

---

## Accessibility

GIGW 3.0 design language, WCAG 2.1 AA as the target, mobile-first.

- Semantic HTML: one `h1` per page, landmarks, `fieldset`/`legend`, real `label`s on
  **every** input — including the second and third address lines, which the live form
  leaves unlabelled so a screen reader announces them as unnamed text boxes.
- Skip link, visible two-ring focus indicator, 48px minimum touch targets.
- **86/86 colour pairs pass** their WCAG minimum, in the default theme and in high
  contrast — `npm run contrast` checks the tokens straight out of `globals.css`, so the
  check cannot drift from the stylesheet.
- No colour-only signalling: every status has a word and a shape as well as a colour.
- No motion at all, so nothing to pause; `prefers-reduced-motion` and `forced-colors`
  are both honoured.
- Real text alternatives everywhere. **Nothing in this prototype is an image of text** —
  including the wordmark.
- No web fonts: a system stack renders Devanagari without a download on a slow connection.

## Verification

Nothing above is claimed without a check that fails if it stops being true.

```bash
npm run verify     # build + contrast + type scale + unit tests + the full Playwright suite
```

| Check | What it covers |
|---|---|
| `npm run contrast` | 93 foreground/background pairs against WCAG 2.1 AA across both themes, read from the stylesheet |
| `npm run test:clock` | 9 unit tests: the statutory arithmetic (30-day reply window, deemed refusal, both appeal windows, a late-evening IST filing) and the redirect and clock-offset guards against six hostile inputs |
| `npm run test` | 80 tests: the journey, the portal shell and the signed-in account at 390px and 1280px, plus eight no-JS walks |
| axe-core | Runs on 26 screens with `wcag2a wcag2aa wcag21a wcag21aa`, including the whole site in high contrast; zero violations |
| Console | Any `console.error` or uncaught exception fails the test |
| `npm run test:screens` | Walks the journey capturing screenshots, and fails if any page scrolls sideways |
| `npm run test:nojs` | The whole journey with JavaScript disabled |
| `npm run preview` | The same journey against the real Workers runtime, not just `next dev` |

Seven defects were found this way and fixed. The step indicator was a horizontally
scrollable strip that could not be reached from the keyboard (WCAG 2.1.1) — it now wraps.
A Codex review pass found a real statutory-arithmetic bug: a silent CPIO could be
appealed against **on** the 30-day deadline, when the reply was still due rather than
late. The language switcher and the menu were reading a stale path, because Next
preserves a shared layout across client-side navigation and does not re-render it — so
after moving around the site, "हिन्दी" sent you back to the page before last. And in high
contrast the top notice and the footer were painting their own text with the inverted ink
token, which is black in that theme: black on black. A later Codex pass over the new shell found an open redirect in the
"return me to the page I was on" field, and an authorisation gap: putting the case id in
the URL so tracking links would work also let anyone holding one move somebody else's
statutory deadline. Each defect now has a test that fails if it comes back. See [CODEX.md](./CODEX.md) for the review passes, what was accepted, and what
was rejected.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000 — no Cloudflare setup needed
```

```bash
npm run preview      # builds for Workers and serves on http://localhost:8787
```

`next dev` works with no configuration: without a KV binding the draft store falls back to
an in-memory Map. The footer always says which driver is live.

## Deploying

You need your own GitHub repository and your own Cloudflare account — see
`../DEPLOY.md` for the exact commands, including creating the KV namespace and pasting
its id into `wrangler.jsonc`.

---

## How this is built

```
src/
  data/          40 Central authorities + 10 State categories, 12 synthetic published
                 records, and the Hindi keyword packs. Adding Tamil is one file plus
                 one line in subjects.ts — the matcher never learns which languages exist.
  i18n/          en.json, hi.json and the locale registry. Same drop-in rule: adding a
                 language must not touch component code.
  lib/
    match.ts     tokeniser, scorer, matchAuthorities, matchPublished, verdict()
    deadline.ts  the statutory clock; every function takes `now` explicitly
    store.ts     two drivers — Cloudflare KV when bound, in-memory Map otherwise
    ref.ts       mock registration numbers in the portal's documented shape
    script.ts    which writing systems the citizen used (observes, never rejects)
    scaffold.ts  the letter scaffold and the appeal scaffold
    prefs.ts     text size and contrast, in one cookie, applied on the server
  app/[locale]/  the seven steps, the portal pages (home, ask, authorities,
                 published, search, track, help, about) and the server actions
```

**Why keyword scoring and not a model, in v0.** The demo behaves identically every time,
it runs with no network call and no key, and every match can be explained to a citizen:
*matched on: mgnrega*. A citizen being told "you cannot file here" deserves a reason they
can check. The semantic layer is the next increment, and it goes **behind** this one, not
instead of it — deterministic rules first, retrieval to catch what the keywords miss.

One bug worth knowing about: the tokeniser regex must be `/[^\p{L}\p{N}\p{M}\s]/gu`.
Without `\p{M}` it strips Devanagari vowel marks, shatters every Hindi word, and Hindi
routing silently returns nothing — the portal would *appear* to accept an Indian language
while ignoring it. There is a comment in `match.ts` saying so.

---

## Why this stack, for a phone on a slow connection

The constraint that shaped every choice: a ₹6,000 Android phone on a 3G connection, often
on a prepaid data pack, sometimes with the bundle blocked or failing.

| Choice | Why |
|---|---|
| **Server-rendered, server actions** | The page arrives as HTML that already contains the answer. Nothing waits on a round trip after paint, and no state has to be rebuilt on the client. |
| **Almost no client JavaScript** | Five small client components exist and none is on the critical path. The whole seven-step journey, the assistant, search, filters, language and the accessibility controls all work with scripting off — tested, not assumed. |
| **No web fonts** | A system stack renders Devanagari, Tamil and Bengali without a 300 KB download on a metered connection. |
| **No images at all** | Nothing in the interface is an image, including the wordmark. Nothing to download, nothing without alt text, nothing that breaks when images are off. |
| **One stylesheet, no CSS framework** | The design system is a single file of tokens and classes. There is no utility-class runtime and no unused framework to ship. |
| **Preferences on the server** | Text size and contrast are a cookie applied to `<html>` before the response is sent. No flash of the wrong size, and the citizen who most needs large text does not have to run a script to get it. |
| **Cloudflare Workers, at the edge** | Compute close to the user matters more than raw speed when the last mile is the bottleneck. The whole app is one Worker; there is no origin to reach past it. |
| **KV for drafts, 24-hour TTL** | No database to connect to, no session server, no account. The only state is a draft keyed to an opaque cookie, and it expires. |
| **GET forms for search and filters** | Results are real URLs. They cache, they bookmark, they can be sent to somebody over WhatsApp, and the back button works. |
| **`<details>` for the mobile menu and the accordion** | Disclosure without a line of JavaScript. |
| **The AI call is server-side only** | The key never reaches the browser, the model's answer arrives inside the HTML, and a failed or slow call degrades to keyword matching rather than to a spinner. |

What we would add next, in the same spirit: a service worker so a part-written application
survives a dropped connection, `Save-Data` support to skip the assistant call on a metered
connection, and a plain-SMS fallback for the tracking step, which is the one screen a
citizen comes back to repeatedly.

## How this would work at national scale

The prototype is a demonstration of an **ordering change**, and the ordering change is the
part that scales. Four things would have to be real:

1. **The authority index.** 2,916 Central public authorities already exist in the
   portal's database with their 5-letter codes. What is missing is subject metadata:
   what each body actually holds, in the words citizens use. That is a one-time
   cataloguing exercise per authority, maintained by the Nodal Officer who already
   exists in the workflow — not new machinery, a new field on existing machinery.

2. **The prior-art corpus.** Section 4 of the Act already obliges every public authority
   to publish proactively. Nothing indexes it. Indexing what is already legally required
   to be public — plus previously released RTI replies, which are public by definition
   once released — turns a legal obligation into a working search. Every request
   deflected here is ₹10 and 30 days saved for the citizen and one fewer application in
   a CPIO's queue. This is the only intervention in our audit where the citizen and the
   ministry want the same thing.

3. **Federation with the States.** The Central/State stop is honest but incomplete: the
   right answer is a handoff, not a dead end. Mexico's platform routes across federal and
   state bodies from one entry point; that mechanism is worth copying even though the
   institutional changes that came with it are not. Short of federation, three cheaper
   fixes are available today and need no legislation: label every authority Central or
   State in the picker, refuse out-of-scope filings **before** payment rather than after,
   and refund when one slips through. The no-refund rule is administrative, not statutory.

4. **The clock.** This one needs no new data at all. The portal already stores
   `Date of Filing` and `Date of action`. Subtracting them is a display change, and it
   would tell every waiting citizen where they stand and every CPIO which files are
   about to breach.

What we would add next, in order: an OpenAI-powered semantic layer behind the
deterministic matcher; the BPL fee-waiver branch; SMS and email notification at day 25;
the officer-side view; and the 48-hour life-and-liberty path, which the Act provides for
and the live portal has no route for at all.

---

## Provenance

Built for a hackathon from a read-only audit of a public website. Nothing was ever
submitted to the live portal, no account was created there, and no bot detection was
circumvented anywhere. The audit material — 13 gaps with screenshots, 75 observations, a
benchmark scorecard against WhatDoTheyKnow, FOIA.gov and Mexico's PNT — lives in the
parent folder.

Central authority names are public record. Their routing keyword lists, the synthetic
corpus, the interface copy and all the code here are ours.
