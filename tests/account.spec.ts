import { test, expect, type Page } from "@playwright/test";
import { axeScan, beginRequest, continueFromChat, dismissGuidelines, watchConsole } from "./helpers";

/**
 * The signed-in area: one menu, one set of credentials, and details typed once.
 *
 * The live portal does the opposite of all three — five top-level menu items,
 * five different credential checks, and every personal field retyped on every
 * filing. Each test below pins one of those down.
 */

async function login(page: Page, contact: string) {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill(contact);
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/account$/);
}

/** The account menu, which is a scrolling row on a phone and a column on a laptop. */
function side(page: Page) {
  return page.getByRole("navigation", { name: "Account menu" });
}

test("every account page is reachable from the side menu and passes axe", async ({
  page,
}) => {
  const problems = watchConsole(page);
  await login(page, `menu-${Date.now()}@example.org`);

  const pages: Array<[string, string, string]> = [
    ["File a new request", "/en/account/new", "File a new request"],
    ["Track status", "/en/account/track", "Track status"],
    ["View history", "/en/account/history", "View history"],
    ["File appeal", "/en/account/appeals", "File appeal"],
    ["Payments and receipts", "/en/account/payments", "Payments and receipts"],
    ["Account information", "/en/account/profile", "Account information"],
    ["Dashboard", "/en/account", "Dashboard"],
  ];

  for (const [link, url, heading] of pages) {
    await side(page).getByRole("link", { name: link }).click();
    await expect(page).toHaveURL(new RegExp(`${url}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    // The menu says where you are, and not with colour alone.
    await expect(side(page).locator('a[aria-current="page"]')).toContainText(link);
    await axeScan(page, `account: ${heading}`);
  }

  expect(problems, problems.join("\n")).toEqual([]);
});

test("signed-out visitors are sent to login, not shown an empty account", async ({
  page,
}) => {
  await page.goto("/en/account/profile");
  await expect(page).toHaveURL(/\/en\/login$/);
});

test("details are typed once and fill the request form", async ({ page }) => {
  const contact = `profile-${Date.now()}@example.org`;
  await login(page, contact);

  await side(page).getByRole("link", { name: "Account information" }).click();
  await page.getByLabel("Full name").fill("R. Iyer");
  await page.getByLabel("Mobile number").fill("9876500000");
  await page.getByLabel("Address line 1").fill("12 Nehru Road");
  await page.getByLabel("PIN code").fill("560001");
  await page.getByLabel("State or Union Territory").selectOption("Karnataka");
  // Fields the live form asks for and never explains.
  await page.getByRole("radio", { name: "Female" }).check();
  await page.getByRole("radio", { name: "Urban" }).check();
  await page.getByRole("radio", { name: "Literate", exact: true }).check();
  await page.getByRole("button", { name: "Save my details" }).click();

  await expect(page.getByText("Your next request will be filled in")).toBeVisible();
  // And it survives a reload, which the live portal's history screen does not.
  await page.reload();
  await expect(page.getByLabel("Full name")).toHaveValue("R. Iyer");
  await expect(page.getByLabel("State or Union Territory")).toHaveValue("Karnataka");

  // No identity documents are invited anywhere on the form.
  await expect(page.getByText(/Aadhaar|PAN/i).first()).toContainText("No Aadhaar number");
  await expect(page.locator('input[name="aadhaar"], input[name="pan"]')).toHaveCount(0);

  // The whole point: the filing form arrives already filled in, and the
  // one-time details step is already behind them — no gate this time.
  await beginRequest(page, "How many passport applications were rejected last year?");
  await continueFromChat(page);
  await expect(page).toHaveURL(/\/en\/file$/);
  await dismissGuidelines(page);
  await expect(page.getByLabel("Your name")).toHaveValue("R. Iyer");
  await expect(page.getByLabel("PIN code")).toHaveValue("560001");
});

test("below the poverty line means no fee, and no payment screen to get wrong", async ({
  page,
}) => {
  await login(page, `bpl-${Date.now()}@example.org`);

  await page.goto("/en/account/profile");
  await page.getByRole("group", { name: "Are you below the poverty line?" })
    .getByRole("radio", { name: "Yes" })
    .check();
  await page.getByRole("button", { name: "Save my details" }).click();

  await beginRequest(page, "How many passports were issued in the last financial year?");
  await continueFromChat(page);
  await dismissGuidelines(page);
  await page.getByLabel("Your name").fill("S. Devi");
  await page.getByLabel(/Email address/).fill("s.devi@example.org");
  await page.getByRole("button", { name: "Continue to payment" }).click();

  await expect(page).toHaveURL(/\/en\/pay$/);
  await expect(page.getByText("Nothing to pay")).toBeVisible();
  await page.getByRole("button", { name: /no fee/ }).click();
  await page.waitForURL(/\/file\/done$/);

  // And the receipt says nil rather than ₹10.
  await page.goto("/en/account/payments");
  await expect(page.getByRole("cell", { name: "Nil" }).first()).toBeVisible();
});

test("history, tracking and appeals are one account, not four lookups", async ({
  page,
}) => {
  await login(page, `flow-${Date.now()}@example.org`);

  await beginRequest(page, "How many MGNREGA wage payments are pending in my district?");
  await continueFromChat(page);

  // First filing for this account: the details gate, once.
  await expect(page).toHaveURL(/\/en\/file\/details$/);
  await page.getByLabel("Full name").fill("A. Citizen");
  await page.getByLabel("Address line 1").fill("12 Station Road");
  await page.getByLabel("PIN code").fill("110001");
  await page.getByRole("button", { name: "Save and continue filing" }).click();

  await expect(page).toHaveURL(/\/en\/file$/);
  await dismissGuidelines(page);
  await page.getByLabel(/Email address/).fill("a.citizen@example.org");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();
  await page.waitForURL(/\/file\/done$/);
  const ref = ((await page.locator(".refno").first().textContent()) ?? "").trim();

  // It appears in the history table, with its subject and its status.
  await page.goto("/en/account/history");
  const row = page.getByRole("row", { name: new RegExp(ref.replace(/[/&]/g, "\\$&")) });
  await expect(row).toBeVisible();
  await axeScan(page, "history");

  // Nothing can be appealed until the clock has actually run out.
  await page.goto("/en/account/appeals");
  await expect(page.getByText("None of your filings can be appealed today.")).toBeVisible();

  // Push the demo clock past thirty days and the appeal offers itself, with
  // the closing date on it — neither of which the live portal ever tells you.
  // The card itself is the way in — there is no Open button.
  await page.goto("/en/account/track");
  await page.getByRole("link", { name: /MGNREGA wage payments/ }).first().click();
  await page.waitForURL(/\/en\/track\//);
  await page.getByRole("button", { name: "Jump past the deadline" }).click();
  await expect(page.getByText(/Clock moved forward 31 days/)).toBeVisible();
  await page.goto("/en/account/appeals");
  await expect(page.locator('ul.card-grid a[href*="/appeal/"]')).toHaveCount(1);
  await expect(page.getByText(/Window closes/)).toBeVisible();
  await expect(page.getByText(/\d+ days left/)).toBeVisible();

  // The dashboard leads with it rather than burying it in six counts.
  await page.goto("/en/account");
  await expect(
    page.getByLabel("Needs your attention").getByText(/days overdue/),
  ).toBeVisible();
});
