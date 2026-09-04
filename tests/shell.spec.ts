import { test, expect } from "@playwright/test";
import { axeScan, beginRequest, continueFromChat, nav, watchConsole } from "./helpers";

/**
 * The portal around the journey: the homepage, the header controls, the
 * navigation, and the three things the live portal has no equivalent of —
 * search, a searchable authority list, and a disclosure log.
 */

test("homepage leads with the question, and with a way back in", async ({ page }) => {
  const problems = watchConsole(page);
  await page.goto("/en");

  // The primary control is the citizen's own question.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "File a Right to Information request",
  );
  // Three ways in, none of them a form on the homepage.
  await expect(page.getByRole("link", { name: /Search the available records/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /File RTI Request/ })).toBeVisible();

  // Timeline and rights — none of which appear on the live homepage.
  await expect(page.getByRole("heading", { name: "Fees and timelines" }).first()).toBeVisible();
  await expect(page.getByText("30 days", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".stat")).toHaveCount(6);

  // The process as three expandable text cards, not a raster flowchart, and
  // closed until asked. No marquee.
  await expect(page.locator("details.how")).toHaveCount(3);
  await expect(page.locator("details.how[open]")).toHaveCount(0);

  // Scope is stated on the page a citizen actually lands on.
  await expect(page.getByRole("heading", { name: "What cannot be filed here" })).toBeVisible();
  await expect(page.locator(".scope").getByText(/Land records, ration cards/)).toBeVisible();

  // Three panels in the gallery, and the Act itself is one click away.
  await expect(page.locator(".slide")).toHaveCount(3);
  const act = page.getByRole("link", { name: /Read the RTI Act/ });
  await expect(act).toHaveAttribute("href", "https://rti.dopt.gov.in/rtiact.html");

  // The step cards open when asked, with the statutory timeline inside.
  await page.locator("details.how").nth(2).locator("summary").click();
  await expect(page.getByText(/30 days to reply/)).toBeVisible();

  await expect(page.locator("main img")).toHaveCount(0);
  await expect(page.locator("marquee")).toHaveCount(0);

  await axeScan(page, "homepage");
  expect(problems, problems.join("\n")).toHaveLength(0);
});

test("the live portal's own menu items are all reachable", async ({ page }) => {
  await page.goto("/en");
  const menu = await nav(page).open();
  for (const name of [
    "Search records",
    "List of Authorities",
    "Published information",
    "Help & FAQ",
    "Contact",
  ]) {
    await expect(menu.getByRole("link", { name })).toBeVisible();
  }
  // Sign-in sits at the end of the nav, not in the middle of the task list.
  await page.locator(".topbar").getByRole("link", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/en\/login$/);
  await axeScan(page, "login");
});

test("login signs in with anything, because it is a demo", async ({ page }) => {
  await page.goto("/en/login");
  await axeScan(page, "login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("anything-at-all");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();

  await expect(page).toHaveURL(/\/en\/account$/);
  await expect(page.getByText("someone@example.org")).toBeVisible();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dashboard");
  await expect(page.getByText("Logged in as someone@example.org")).toBeVisible();
  await axeScan(page, "account dashboard");

  // Tracking and appeals live in the account menu now, not in the main one.
  const menu = await nav(page).open();
  await expect(menu.getByRole("link", { name: "Track status" })).toHaveCount(0);
  await expect(
    page.locator(".topbar").getByRole("link", { name: "My account" }),
  ).toBeVisible();
  await page.goto("/en/track");
  await expect(page).toHaveURL(/\/en\/account\/track$/);

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/en$/);
});

test("a request filed while logged in appears in the account", async ({ page }) => {
  // A fresh contact each run: the mock store keeps whatever earlier runs filed.
  const contact = `demo-${Date.now()}@example.org`;
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill(contact);
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page.getByText("Nothing filed from this account yet.")).toBeVisible();

  await beginRequest(page, "How many MGNREGA wage payments are pending in my district?");
  await continueFromChat(page);

  // First filing with this account: the personal details are asked once.
  await expect(page).toHaveURL(/\/en\/file\/details$/);
  await expect(page.getByText("This question is asked once. Never again.")).toBeVisible();
  await page.getByLabel("Full name").fill("A. Citizen");
  await page.getByLabel("Address line 1").fill("12 Station Road");
  await page.getByLabel("PIN code").fill("110001");
  await page.getByRole("button", { name: "Save and continue filing" }).click();

  // From here on the form is filled in from the account and the conversation.
  await expect(page).toHaveURL(/\/en\/file$/);
  await expect(page.getByLabel("Your name")).toHaveValue("A. Citizen");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();
  await expect(page).toHaveURL(/\/en\/file\/done$/);
  const ref = ((await page.locator(".refno").first().textContent()) ?? "").trim();

  // And the same details answer for the next request without asking again.
  await page.goto("/en/file");
  await expect(page).toHaveURL(/\/en\/file$/);

  await page.goto("/en/account");
  await expect(page.getByText(ref)).toBeVisible();
  await expect(page.getByText(/Reply due/)).toBeVisible();
});

test("every Eighth Schedule language is listed, two of them work", async ({ page }) => {
  await page.goto("/en");
  const select = page.getByLabel("Language");
  await expect(select.locator("option")).toHaveCount(23);
  // The two that are translated are selectable; the other twenty-one are named
  // in their own script and disabled, so the gap is visible rather than hidden.
  await expect(select.locator("option:not([disabled])")).toHaveCount(2);
  await expect(select.locator("option[disabled]")).toHaveCount(21);
  await expect(select.locator("option", { hasText: "தமிழ்" })).toHaveCount(1);

  // Choosing is the whole action; there is no confirm step.
  await select.selectOption("hi");
  await expect(page).toHaveURL(/\/hi$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "सूचना का अधिकार आवेदन दायर कीजिए",
  );
});

test("text size and high contrast are set on the server and persist", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-text", "base");

  await page.getByRole("button", { name: "Increase text size" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "lg");
  await page.getByRole("button", { name: "Increase text size" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "xl");
  await page.getByRole("button", { name: "Switch to high contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");

  await page.goto("/en/published");
  await expect(page.locator("html")).toHaveAttribute("data-text", "xl");
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
  await axeScan(page, "high contrast");

  await page.getByRole("button", { name: "Switch to normal contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "normal");
});

test("the assistant opens on a disclosure screen, then runs full screen", async ({
  page,
}) => {
  await page.goto("/en/ask");

  // The disclosure screen is an ordinary page: site header and footer,
  // like everywhere else. Only the chat is a tool.
  // (The nav class differs by viewport: .mainnav desktop, .navmenu mobile.)
  await expect(page.locator(".topbar")).toBeVisible();
  await expect(page.locator(".mainnav:visible, .navmenu:visible")).toBeVisible();
  await expect(page.locator(".site-footer")).toBeVisible();
  await axeScan(page, "assistant intro");

  // It says what it does before you start.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hello,");
  await expect(page.getByText(/RTI Mitra reads your question/)).toBeVisible();

  const begin = page.getByRole("link", { name: "Begin" });
  await expect(begin).toBeVisible();

  await begin.click();
  await expect(page).toHaveURL(/\/en\/ask\/chat$/);

  // The chat itself runs full screen: no site header or footer.
  await expect(page.locator(".mainnav")).toHaveCount(0);
  await expect(page.locator(".site-footer")).toHaveCount(0);
  const back = page.locator(".wiz-bar").getByRole("link", { name: "Back", exact: true });
  await expect(back).toBeVisible();
  await axeScan(page, "assistant");

  // And a way back out to the site.
  await back.click();
  await expect(page).toHaveURL(/\/en\/ask$/);
});

test("the header holds only language and accessibility", async ({ page }) => {
  await page.goto("/en");
  const utility = page.locator(".utility");
  await expect(utility.getByLabel("Language")).toBeVisible();
  await expect(utility.getByRole("button", { name: "Increase text size" })).toBeVisible();
  await expect(page.locator(".topbar").getByRole("searchbox")).toHaveCount(0);
  await expect(utility.getByRole("link", { name: "Accessibility statement" })).toHaveCount(0);
  // The language form keeps a submit control for the no-JavaScript case, but
  // nobody is shown it: choosing a language is the whole action.
  await expect(utility.getByRole("button", { name: "Change" })).toHaveClass(
    /visually-hidden/,
  );
  // Login lives at the end of the nav instead.
  // Login is a button in the masthead, where people look for it.
  await expect(page.locator(".topbar").getByRole("link", { name: "Login" })).toBeVisible();
});

test("the text-size control steps, and stops at both ends", async ({ page }) => {
  await page.goto("/en");
  const smaller = page.getByRole("button", { name: "Decrease text size" });
  const reset = page.getByRole("button", { name: "Normal text size" });
  const larger = page.getByRole("button", { name: "Increase text size" });

  // At normal there is nothing to decrease and nothing to reset.
  await expect(smaller).toBeDisabled();
  await expect(reset).toBeDisabled();

  await larger.click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "lg");
  await larger.click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "xl");
  await expect(page.getByRole("button", { name: "Increase text size" })).toBeDisabled();

  await page.getByRole("button", { name: "Decrease text size" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "lg");
  await page.getByRole("button", { name: "Normal text size" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-text", "base");
});

test("the chrome follows client-side navigation, not the page you arrived on", async ({
  page,
}) => {
  // Regression. Next preserves a shared layout across client navigation and does
  // not re-render it, so a server-rendered path went stale: the language menu
  // sent you back to the page before last, and the menu highlighted the wrong item.
  await page.goto("/en");
  await nav(page).go("Help & FAQ");
  await expect(page).toHaveURL(/\/en\/help$/);
  await nav(page).go("List of Authorities");
  await expect(page).toHaveURL(/\/en\/authorities$/);
  await expect(await nav(page).current()).toHaveText(/List of Authorities/);

  await page.getByLabel("Language").selectOption("hi");
  await expect(page).toHaveURL(/\/hi\/authorities$/);
});

test("the authority list filters as you type", async ({ page }) => {
  await page.goto("/en/authorities");
  await expect(page.getByText(/94 of 94 ministries and departments/)).toBeVisible();
  await expect(page.getByText(/2581 bodies in the full list/)).toBeVisible();

  // No search button, no clear button, no A–Z strip.
  // The submit button exists only so that Enter works without JavaScript.
  await expect(page.locator("main").getByRole("button", { name: "Search" })).toHaveClass(
    /visually-hidden/,
  );
  await expect(page.locator(".az")).toHaveCount(0);

  const box = page.getByRole("searchbox", { name: "Search by name or subject" });

  // Typing filters immediately, with no navigation.
  await box.fill("passport");
  await expect(page.getByText(/2 of 94 ministries and departments/)).toBeVisible();
  await expect(page).toHaveURL(/\/en\/authorities$/);
  // And it opens what it matched.
  await expect(page.locator("details.dir-item[open]").first()).toBeVisible();

  // It reaches inside the headings, which the live accordion cannot.
  await box.fill("Chandigarh");
  await expect(page.locator("details.dir-item[open] li").first()).toBeVisible();

  await box.fill("");
  await expect(page.getByText(/94 of 94 ministries and departments/)).toBeVisible();
  await axeScan(page, "authority list");

  // A department with nothing under it is a plain row, with no expander.
  await expect(page.locator(".dir-row").first()).toBeVisible();
  await expect(page.locator(".dir-row summary")).toHaveCount(0);
});

test("one department has its own shareable page", async ({ page }) => {
  await page.goto("/en/authorities?dept=Ministry%20of%20External%20Affairs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ministry of External Affairs",
  );
  await expect(page.getByText("Consulate General of India, Chicago")).toBeVisible();
  await axeScan(page, "one department");
});

test("a tracking link can be read by anyone, but only changed by its owner", async ({
  page,
  browser,
}) => {
  await beginRequest(page, "How many crop insurance claims were rejected?");
  await continueFromChat(page);
  await page.getByLabel("Your name").fill("A. Citizen");
  await page.getByLabel(/Email address/).fill("someone@example.org");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();
  await page.waitForURL(/\/file\/done$/);
  await page.getByRole("link", { name: "Track this request" }).click();
  await page.waitForURL(/\/track\//);
  const url = page.url();
  const ref = ((await page.locator(".refno").first().textContent()) ?? "").trim();
  await expect(page.getByText("30 days left")).toBeVisible();

  const stranger = await browser.newContext();
  const strangerPage = await stranger.newPage();
  await strangerPage.goto(url);
  await expect(strangerPage.getByText("30 days left")).toBeVisible();
  await strangerPage.getByRole("button", { name: "Jump past the deadline" }).click();
  await expect(strangerPage.getByText("30 days left")).toBeVisible();
  await expect(strangerPage.getByText(/days overdue/)).toHaveCount(0);
  await stranger.close();

  // And it can be found again from the registration number alone, from the account.
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.getByRole("link", { name: "Track status" }).click();
  await page.getByLabel("Registration number").fill(ref);
  await page.getByRole("button", { name: "Find it" }).click();
  await expect(page.locator(".refno").first()).toHaveText(ref);
});

test("help and contact answer what the manual, FAQ and help desk answer", async ({ page }) => {
  await page.goto("/en/help");
  await expect(
    page.getByRole("heading", { name: "Frequently asked questions" }),
  ).toBeVisible();
  await expect(page.locator("#accessibility")).toContainText("WCAG 2.1 AA");
  await axeScan(page, "help");

  await page.goto("/en/contact");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contact");
  await axeScan(page, "contact");
});
