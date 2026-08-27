# Codex pass 3 — the portal shell and the new pages

Run from `prototype/app` with Codex CLI 0.144.3, after the homepage, the utility bar, the
navigation and five new pages were added:

```bash
codex exec --skip-git-repo-check --sandbox read-only "A portal shell and five new pages were just added to this Next.js 16 App Router prototype. Review only these files: [15 files listed] ... Look for: 1. Semantic HTML and ARIA defects ... 2. Anything that breaks with JavaScript disabled ... 3. Security or correctness bugs in the new server actions, especially the open-redirect surface in the next parameter of setTextSize, setContrast and closeBanner, and the cookie handling in src/lib/prefs.ts. 4. Next.js App Router correctness on Cloudflare Workers. Do not comment on styling preferences, naming, code organisation or test coverage. Only things that are actually wrong."
```

## Codex's reply, verbatim

Found these concrete defects:

| Severity | File / line | Problem | Minimal fix |
|---|---|---|---|
| High | [actions.ts](/Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/actions.ts:239) | `safeNext` accepts `/\evil.example`. Browsers normalize backslashes in URLs, turning it into a scheme-relative external redirect. All three preference actions therefore have an open-redirect path. | Parse against a trusted origin and require the parsed URL’s origin to match it; alternatively allow only a strict, locale-prefixed internal pathname and reject backslashes. |
| High | [actions.ts](/Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/actions.ts:160) | `demoClock`, `demoReply`, `demoSilence`, and `fileAppeal` trust a form-supplied `caseId` rather than verifying it is the caller’s cookie-bound case. Anyone with a case ID can alter its demo state or file an appeal. | Load the cookie case via `requireCase()` and require `existing.id === caseId` before every mutation. |
| Medium | [actions.ts](/Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/actions.ts:140) | `payAndFile` validates only `subject` and `body`; a caller can invoke the action directly and file a draft without the required `name` or `email`. | Revalidate every required composition field (`subject`, `body`, `name`, `email`) before filing. |
| Medium | [actions.ts](/Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/actions.ts:160) | `Number()` accepts `NaN` and infinity; `Math.max(0, offset)` can persist invalid clock data or cause later date handling to fail. | Require a finite integer and clamp it to the supported demo range before updating. |
| Medium | [Masthead.tsx](/Users/vishmac/Downloads/RTI/prototype/app/src/components/Masthead.tsx:37), [search/page.tsx](/Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/search/page.tsx:40) | On the search page there are two `search` landmarks, neither named. A screen-reader landmark list announces two indistinguishable “search” regions. Input labels do not name the landmark. | Add distinct `aria-label`s to the forms, e.g. “Site search” and “Search this portal”. |

I found no other defects in the specified files affecting JavaScript-disabled operation, heading order, nav/current-page semantics, preference-button pressed state, or App Router compatibility with Cloudflare Workers. Server Actions and App Router are supported by the Cloudflare OpenNext adapter. [Cloudflare documentation](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)