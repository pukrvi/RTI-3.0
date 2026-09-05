import { test, expect } from "@playwright/test";
import { beginRequest, continueFromChat } from "./helpers";

/**
 * The same service with JavaScript switched off.
 *
 * Every step — including the assistant, which is a chat made of form posts and
 * page loads rather than a websocket — must still work for a citizen on a
 * low-end phone, a slow connection, or a browser that never finished loading
 * the bundle. If these fail, the prototype has quietly become a single-page app.
 */
test("the whole journey works with scripting disabled", async ({ page }) => {
  // Filing needs an account; chatting does not. Sign in first so the chat's
  // draft carries straight onto the form after the login gate.
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill(`nojs-${Date.now()}@example.org`);
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);

  await beginRequest(page, "How many MGNREGA wage payments are pending in my district?");
  await expect(page.locator(".msg-bot")).toHaveCount(1);

  await expect(page.getByText(/MGNREGA wage payment status/)).toBeVisible();
  await continueFromChat(page);
  // First filing for a fresh account: the one-time details step.
  await page.waitForURL(/\/en\/file\/details/);
  await page.getByLabel("Full name").fill("A. Citizen");
  await page.getByLabel("Address line 1").fill("12 Station Road");
  await page.getByLabel("PIN code").fill("110001");
  await page.getByRole("button", { name: "Save and continue filing" }).click();
  await page.waitForURL(/\/en\/file$/);

  await expect(page.locator("#ministry-select")).not.toHaveValue("");
  await expect(page.locator("#authority-select option:checked")).toContainText(
    "Ministry of Rural Development",
  );

  await page.getByLabel("Your name").fill("A. Citizen");
  await page.getByLabel(/Email address/).fill("someone@example.org");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.waitForURL(/\/pay$/);
  await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();
  await page.waitForURL(/\/file\/done$/);
  await expect(page.locator(".refno").first()).toHaveText(/^[A-Z]{5}\/R\/E\/\d{2}\/\d{5}$/);

  await page.getByRole("link", { name: "Track this request" }).click();
  await page.waitForURL(/\/track\//);

  await page.getByRole("button", { name: "Jump past the deadline" }).click();
  await expect(page.getByText(/days overdue/)).toBeVisible();

  await page.getByRole("link", { name: "Prepare my appeal" }).click();
  await page.waitForURL(/\/appeal\//);
  await page.getByRole("button", { name: /File the appeal/ }).click();
  await page.waitForURL(/\/track\//);
  await expect(page.getByText("First appeal filed").first()).toBeVisible();
});

test("the language menu is a form, not a script", async ({ page }) => {
  // With JavaScript, choosing a language submits on the spot. Without it, the
  // form still has a submit control — it is just not shown to anyone who does
  // not need it.
  await page.goto("/en/help");
  const select = page.getByLabel("Language");
  await select.selectOption("hi");
  // No script to listen for the change, so the form is submitted the way a
  // form has always been submitted.
  await select.press("Enter");
  await expect(page).toHaveURL(/\/hi\/help$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hi-IN");
});

test("the accessibility controls work with scripting disabled", async ({ page }) => {
  // This is the point of doing them on the server. The citizen most likely to
  // need larger text is often the one whose browser never ran the script that
  // would have provided it.
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-text", "base");

  await page.getByRole("button", { name: "Increase text size" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "lg");

  await page.getByRole("button", { name: "Switch to high contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");

  await page.goto("/en/authorities");
  await expect(page.locator("html")).toHaveAttribute("data-text", "lg");
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
});

test("the mobile menu opens without scripting", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const menu = page.locator("details.navmenu");
  await expect(menu).not.toHaveAttribute("open", "");
  await menu.getByText("Menu").click();
  await expect(menu).toHaveAttribute("open", "");
  await menu.getByRole("link", { name: "List of Authorities" }).click();
  await expect(page).toHaveURL(/\/en\/authorities$/);
});

test("the authority filter is a plain GET form when the script never arrives", async ({
  page,
}) => {
  // With JavaScript, this input filters as you type. Without it, Enter submits
  // the form and the server filters instead — same input, same result.
  await page.goto("/en/authorities");
  await page.getByRole("searchbox", { name: "Search by name or subject" }).fill("passport");
  await page.getByRole("searchbox", { name: "Search by name or subject" }).press("Enter");
  await expect(page).toHaveURL(/\/en\/authorities\?q=passport/);
  await expect(page.getByText("Ministry of External Affairs")).toBeVisible();

  // And one department in full is a real URL.
  await page.goto("/en/authorities?dept=Ministry%20of%20Coal");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ministry of Coal");
});

test("logging in works with scripting disabled", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("nojs@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);
  await expect(page.getByText("Logged in as nojs@example.org")).toBeVisible();
});

test("the account works with scripting disabled", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("nojs-acct@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);

  // The side menu is plain links, so it needs nothing to arrive.
  const side = page.getByRole("navigation", { name: "Account menu" });
  await side.getByRole("link", { name: "Account information" }).click();
  await page.waitForURL(/\/en\/account\/profile$/);

  // And the details form is a plain POST.
  await page.getByLabel("Full name").fill("No Script");
  await page.getByLabel("Address line 1").fill("4 Station Road");
  await page.getByRole("radio", { name: "Rural" }).check();
  await page.getByRole("button", { name: "Save my details" }).click();
  await page.waitForURL(/saved=1/);
  await expect(page.getByLabel("Full name")).toHaveValue("No Script");
  await expect(page.getByRole("radio", { name: "Rural" })).toBeChecked();
});
