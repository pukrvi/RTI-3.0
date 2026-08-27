# Codex pass 2 — code review

Run from `prototype/app` with Codex CLI 0.144.3:

```bash
codex exec --skip-git-repo-check --sandbox read-only "Review this Next.js 16 App Router prototype for defects. Read src/app, src/components, src/lib and src/app/globals.css.

Target: WCAG 2.1 AA, GIGW 3.0, mobile-first, and it must keep working with JavaScript disabled (every step is a plain form posting to a server action; there is exactly one client component, the language switcher).

Look specifically for:
1. Semantic HTML and ARIA defects: heading order, landmarks, invalid nesting, labels missing or wrongly associated, aria-* used incorrectly, status carried by colour alone, focus management after a redirect.
2. Anything that would break with JavaScript disabled.
3. Next.js App Router correctness: server/client boundary mistakes, awaiting params and searchParams, redirect() misuse, cookies() usage, anything that would behave differently on Cloudflare Workers than on next dev.
4. Real bugs in the deadline arithmetic in src/lib/deadline.ts, especially around timezone handling and the appeal window.

Do not comment on styling preferences, naming, or code organisation. Do not suggest adding tests. For each finding give: file and line, severity (high/medium/low), what is wrong, and the minimal fix. Be strict - only things that are actually wrong. Do not edit any files."
```

## Codex's reply, verbatim

Found these concrete defects:

- **Medium — [src/components/Steps.tsx:25](</Users/vishmac/Downloads/RTI/prototype/app/src/components/Steps.tsx:25>)**  
  Every journey page exposes a hidden `h2` before its visible `h1`, breaking the document heading hierarchy.  
  Minimal fix: remove this heading (the `<nav>` already has an accessible label and current-step text), or render it as non-heading text.

- **Medium — [src/app/[locale]/page.tsx:56](</Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/page.tsx:56>)**  
  On validation failure, the textarea is marked invalid but its error message (`#question-error`) is not included in `aria-describedby`. A screen-reader user who reaches the field is not told why it is invalid.  
  Minimal fix: conditionally append `question-error` to `aria-describedby`.

- **Medium — [src/app/[locale]/compose/page.tsx:101](</Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/compose/page.tsx:101>), [compose/page.tsx:125](</Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/compose/page.tsx:125>), [compose/page.tsx:158](</Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/compose/page.tsx:158>), [compose/page.tsx:179](</Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/compose/page.tsx:179>)**  
  The four invalid fields have `aria-invalid`, but their inline errors have no IDs and are not associated with the controls.  
  Minimal fix: give each inline error an ID and conditionally add that ID to the corresponding field’s `aria-describedby`.

- **Medium — [src/components/PrintButton.tsx:1](</Users/vishmac/Downloads/RTI/prototype/app/src/components/PrintButton.tsx:1>)**  
  This is a second client component, contrary to the stated “exactly one client component” constraint. With JavaScript disabled, its visible Print button does nothing.  
  Minimal fix: remove the custom print button and rely on browser printing/print CSS, or explicitly exempt this client component from the requirement.

- **Low — [src/app/[locale]/error.tsx:1](</Users/vishmac/Downloads/RTI/prototype/app/src/app/[locale]/error.tsx:1>)**  
  This is also a client component, and its “Try again” action is JavaScript-only. `error.tsx` must be client-side in Next.js, so it cannot be converted to a server component.  
  Minimal fix: remove the custom error boundary if the one-client-component rule is absolute; the existing “Start again” link remains the no-JavaScript recovery route.

- **High — [src/lib/deadline.ts:92](</Users/vishmac/Downloads/RTI/prototype/app/src/lib/deadline.ts:92>)**  
  A no-response appeal opens on the reply deadline itself: `daysBetween(now, opened) > 0` allows it when the result is `0`. Elsewhere the same date is explicitly treated as “due today,” not overdue. This permits filing an appeal before the authority’s final response day has expired.  
  Minimal fix: for the no-reply case, keep the window closed while `daysBetween(now, opened) >= 0`; open it from the following IST calendar day.

I found no incorrect un-awaited `params`/`searchParams`, `cookies()` usage, or `redirect()` use in the reviewed files. The IST calendar conversion itself is sound because IST has no daylight-saving transitions.