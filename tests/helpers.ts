import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Step 1 now happens in a conversation, so every journey test starts the same
 * way: say what you want to know, then move on to the already-public check.
 */
export async function beginRequest(
  page: Page,
  question: string,
  locale = "en",
  { fresh = false }: { fresh?: boolean } = {},
) {
  // The assistant is the chat itself; there is no intro page in front of it.
  await page.goto(`/${locale}/chat`);

  // First visit shows the intro pop-up over the chat, covering the composer
  // until it is dismissed — dismiss it the way a citizen would. Returning
  // visits have nothing to dismiss, and with scripting disabled the client
  // shell never runs so the pop-up never appears; a short wait covers both
  // without slowing the suite, and also covers hydration arriving late.
  const intro = page.getByRole("dialog");
  try {
    await intro.waitFor({ state: "visible", timeout: 2500 });
  } catch {
    /* nothing to dismiss */
  }
  if (await intro.count()) {
    await intro
      .getByRole("button", { name: locale === "hi" ? "शुरू कीजिए" : "Begin" })
      .click();
    await expect(intro).toHaveCount(0);
  }

  if (fresh) {
    const again = page.getByRole("button", {
      name: locale === "hi" ? "नया प्रश्न" : "New question",
    });
    if (await again.count()) {
      // "New question" clears the conversation and stays in the chat,
      // back at the preset topics.
      await again.click();
      await expect(page.locator(".chat-welcome")).toBeVisible();
    }
  }

  // The post returns to the same URL, so waiting on the URL proves nothing.
  // Waiting for "a bot message exists" is not enough either when the thread
  // already had one — wait for one more than there were. The trace is paced
  // (five stages at two seconds each) before the answer prints, so this wait
  // outlasts it with room for the round trip.
  const before = await page.locator(".msg-bot").count();
  await page.getByRole("textbox").last().fill(question);
  await page.getByRole("button", { name: locale === "hi" ? "भेजें" : "Send" }).click();
  await expect(page.locator(".msg-bot")).toHaveCount(before + 1, { timeout: 25_000 });
}

/**
 * The way out of the assistant is the filing form itself: the conversation
 * carries the question and the suggested authority onto a single page.
 * (A signed-in citizen without saved details passes through /file/details
 * first, which the prefix match also allows for.)
 */
export async function continueFromChat(page: Page, locale = "en") {
  const names = locale === "hi"
    ? /फिर भी आरटीआई आवेदन करें|यह आवेदन दायर करें/
    : /File an RTI anyway|File this request/;
  await page.getByRole("button", { name: names }).click();
  await page.waitForURL(new RegExp(`/${locale}/file`));
}

/**
 * The filing page opens Guidelines and Disclaimer on every landing, covering
 * the form until dismissed — dismiss it the way a citizen would. With
 * scripting disabled the dialog never renders, so a short wait covers both.
 */
export async function dismissGuidelines(page: Page) {
  const dialog = page.getByRole("dialog");
  try {
    await dialog.waitFor({ state: "visible", timeout: 2500 });
  } catch {
    /* nothing to dismiss */
  }
  if (await dialog.count()) {
    await dialog
      .getByRole("button", { name: /read the guidelines/i })
      .click();
    await expect(dialog).toHaveCount(0);
  }
}

export async function axeScan(page: Page, label: string) {
  // After a soft navigation Next applies the document title asynchronously, so
  // wait for the page to settle before auditing it.
  await expect(page).toHaveTitle(/\S/);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const violations = results.violations.map(
    (v) => `${label}: ${v.id} (${v.impact}) — ${v.nodes.length} node(s)`,
  );
  expect(violations, violations.join("\n")).toHaveLength(0);
}

/** Fails the test on any console error or uncaught exception. */
export function watchConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  return problems;
}

/**
 * The navigation collapses into a disclosure menu below 60rem, so a test that
 * only knows about the desktop bar passes on one viewport and fails on the
 * other. This picks whichever one is actually on screen.
 */
export function nav(page: Page) {
  return {
    async open() {
      const bar = page.locator(".mainnav");
      if (await bar.isVisible()) return bar;
      const menu = page.locator("details.navmenu");
      if ((await menu.getAttribute("open")) === null) {
        await menu.getByText("Menu", { exact: true }).click();
      }
      return menu;
    },
    async go(name: string) {
      const container = await this.open();
      await container.getByRole("link", { name }).click();
    },
    async current() {
      const container = await this.open();
      return container.locator('a[aria-current="page"]');
    },
  };
}
