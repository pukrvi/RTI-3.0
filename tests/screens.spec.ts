import { test, expect, type Page } from "@playwright/test";
import { beginRequest, continueFromChat } from "./helpers";

/**
 * Walks the journey taking a screenshot at each step, and asserts that no page
 * scrolls sideways — the commonest way a "mobile-friendly" government form
 * turns out not to be.
 */

async function noSideScroll(page: Page, label: string) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `${label} scrolls horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
}

test("journey screenshots", async ({ page }, testInfo) => {
  const dir = `screens/${testInfo.project.name}`;
  const shot = async (name: string) => {
    await noSideScroll(page, name);
    await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  };

  await page.goto("/en");
  await shot("00-home");

  await page.goto("/en/login");
  await shot("00f-login");

  await page.goto("/en/contact");
  await shot("00g-contact");

  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);
  await shot("00i-account");

  await page.goto("/en/account/new");
  await shot("00i2-account-new");
  await page.goto("/en/account/track");
  await shot("00i3-account-track");
  await page.goto("/en/account/history");
  await shot("00i4-account-history");
  await page.goto("/en/account/appeals");
  await shot("00i5-account-appeals");
  await page.goto("/en/account/payments");
  await shot("00i6-account-payments");
  await page.goto("/en/account/profile");
  await shot("00i7-account-profile");

  await page.goto("/en/authorities?q=passport");
  await expect(page.locator("details.dir-item[open]").first()).toBeVisible();
  await shot("00b-authorities");

  await page.goto("/en/published");
  await shot("00c-published");

  await page.goto("/en/search?q=provident+fund");
  await shot("00d-search");

  await page.goto("/en/help");
  await shot("00e-help");

  await page.goto("/en/chat?intro=1");
  await expect(page.getByRole("dialog")).toBeVisible();
  await shot("01-ask-intro");

  await page.goto("/en/chat");
  await shot("01b-ask-chat");

  await beginRequest(page, "How many MGNREGA wage payments are pending in my district?");
  await shot("01c-ask-answered");

  // Signed in for the first time against a fresh mock store, the personal
  // details come before the form — once. With an account that already has
  // them (a warm dev server), the form is already next. Wait on the control,
  // not the URL: the gate's second redirect commits after the first.
  await continueFromChat(page);
  const details = page.getByRole("button", { name: "Save and continue filing" });
  const cont = page.getByRole("button", { name: "Continue to payment" });
  await Promise.race([
    expect(details).toBeVisible().catch(() => undefined),
    expect(cont).toBeVisible().catch(() => undefined),
  ]);
  if (await details.isVisible()) {
    await shot("03-details-once");
    await page.getByLabel("Full name").fill("A. Citizen");
    await page.getByLabel("Address line 1").fill("12 Station Road");
    await page.getByLabel("PIN code").fill("110001");
    await details.click();
  }
  await expect(cont).toBeVisible();
  await shot("04-file-form");

  await cont.click();
  await page.waitForURL(/\/pay$/);
  await shot("06-pay");

  await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();
  await page.waitForURL(/\/file\/done$/);
  await shot("06b-confirmation");

  await page.getByRole("link", { name: "Track this request" }).click();
  await page.waitForURL(/\/track\//);
  await shot("07-track-day-0");

  await page.getByRole("button", { name: "Jump to day 25" }).click();
  await expect(page.getByText(/5 days left/)).toBeVisible();
  await shot("08-track-day-25");

  await page.getByRole("button", { name: "Jump past the deadline" }).click();
  await expect(page.getByText(/days overdue/)).toBeVisible();
  await shot("09-track-overdue");

  await page.getByRole("link", { name: "Prepare my appeal" }).click();
  await page.waitForURL(/\/appeal\//);
  await shot("10-appeal");

  await page.getByRole("button", { name: /File the appeal/ }).click();
  await page.waitForURL(/\/track\//);
  await expect(page.getByText("First appeal filed").first()).toBeVisible();
  await shot("11-track-appealed");

  await page.goto("/en/about");
  await shot("12-about");

  // High contrast, on the homepage, where the whole shell is visible.
  await page.goto("/en");
  await page.getByRole("button", { name: "Switch to high contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
  await shot("12b-home-high-contrast");
  await page.getByRole("button", { name: "Switch to normal contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "normal");

  // The stop, which is the whole argument.
  await beginRequest(page, "I want a copy of my land record, khasra and mutation entry", "en", {
    fresh: true,
  });
  await shot("13-state-stop");

  await page.goto("/hi");
  await shot("14b-home-hindi");
  await beginRequest(page, "मेरा पीएफ निकासी दावा कितने दिन में निपटा?", "hi", { fresh: true });
  await shot("14c-hindi-ask");
  await continueFromChat(page, "hi");
  await shot("14-hindi-check");
});
