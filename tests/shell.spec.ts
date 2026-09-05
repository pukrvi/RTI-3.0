import { test, expect } from "@playwright/test";
import { axeScan, beginRequest, continueFromChat, dismissGuidelines, nav, watchConsole } from "./helpers";

/**
 * The portal around the journey: the homepage, the header controls, the
 * navigation, and the three things the live portal has no equivalent of —
 * search, a searchable authority list, and a disclosure log.
 */

test("homepage leads with the question, and with a way back in", async ({ page }) => {
  const problems = watchConsole(page);
  await page.goto("/en");

  // The primary control is the citizen's own question.
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(
    "File a Right to Information request",
  );
  // Two ways in on the first panel, none of them a form on the homepage.
  // Primary goes to the chat (no login needed to ask); manual filing asks
  // for login at the form.
  await expect(page.getByRole("link", { name: "File with RTI Mitra AI", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "File RTI manually", exact: true })).toBeVisible();
  // The assistant gets the second panel, with the only way to open it.
  await expect(page.getByRole("link", { name: "Ask RTI Mitra" })).toBeVisible();

  // Timeline and rights — none of which appear on the live homepage.
  await expect(page.getByRole("heading", { name: "Fees and timelines" }).first()).toBeVisible();
  await expect(page.getByText("30 Days to answer", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".stat")).toHaveCount(6);

  // The process as three expandable text cards, not a raster flowchart, and
  // closed until asked. No marquee.
  await expect(page.locator("details.how")).toHaveCount(3);
  await expect(page.locator("details.how[open]")).toHaveCount(0);

  // Scope is stated on the page a citizen actually lands on.
  await expect(page.getByRole("heading", { name: "What cannot be filed here" })).toBeVisible();
  await expect(page.locator(".scope").getByText(/Land records, ration cards/)).toBeVisible();

  // Four panels in the gallery, and the Act itself sits in the header,
  // between Published information and Help. Contact closes the menu; Mitra
  // lives beside login, not in the menu.
  await expect(page.locator(".slide")).toHaveCount(4);
  const act = page.locator('header nav.mainnav ul li a[href="https://rti.dopt.gov.in/rtiact.html"]');
  await expect(act).toHaveText("RTI Act");
  const navLabels = await page.locator("header nav.mainnav ul li").allTextContents();
  const at = (s: string) => navLabels.findIndex((t) => t.includes(s));
  expect(at("Published information")).toBeLessThan(at("RTI Act"));
  expect(at("RTI Act")).toBeLessThan(at("Help"));
  expect(at("Help")).toBeLessThan(at("Contact"));
  expect(at("Chat with Mitra AI")).toBe(-1);
  expect(at("Search records")).toBe(-1);

  // The Mitra call-to-action sits immediately before login and stands the
  // same height as it — same button box, different paint.
  const cta = page.locator(".topbar-cta").getByRole("link", { name: /Chat with Mitra AI/ });
  const login = page.locator(".topbar-cta").getByRole("link", { name: "Login" });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", /\/en\/chat$/);
  const ctaBox = await cta.boundingBox();
  const loginBox = await login.boundingBox();
  expect(ctaBox && loginBox ? Math.abs(ctaBox.height - loginBox.height) : -1).toBeLessThanOrEqual(1);

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
    "List of Authorities",
    "Published information",
    "Help & FAQ",
    "Contact",
  ]) {
    await expect(menu.getByRole("link", { name })).toBeVisible();
  }
  // Mitra is not a menu item: it is the colourful call-to-action beside login.
  await expect(menu.getByRole("link", { name: /Chat with Mitra AI/ })).toHaveCount(0);
  const mitra = page.locator(".topbar-cta").getByRole("link", { name: /Chat with Mitra AI/ });
  await expect(mitra).toBeVisible();
  await expect(mitra).toHaveAttribute("href", /\/en\/chat$/);
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
  await dismissGuidelines(page);
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

test("the assistant opens directly in the chat, with a first-visit intro", async ({
  page,
}) => {
  await page.goto("/en/chat?intro=1");

  // The chat itself runs full screen: no site header or footer.
  await expect(page.locator(".mainnav")).toHaveCount(0);
  await expect(page.locator(".site-footer")).toHaveCount(0);
  await axeScan(page, "assistant");

  // First visit: the old intro page arrives as a pop-up over the chat, with
  // the essential words emphasised.
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("Hello,");
  await expect(dialog.getByText(/RTI Mitra reads your question/)).toBeVisible();
  await expect(dialog.locator("strong", { hasText: "2,581" })).toBeVisible();
  await axeScan(page, "assistant intro");

  // Dismissing it lands straight in the conversation, and it stays dismissed.
  await dialog.getByRole("button", { name: "Begin" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("RTI Mitra");
  await expect(
    page.getByRole("button", { name: "What does this tool do?" }),
  ).toBeVisible();

  // The retired intro URLs redirect to the chat.
  await page.goto("/en/ask");
  await expect(page).toHaveURL(/\/en\/chat$/);
  await page.goto("/en/ask/chat");
  await expect(page).toHaveURL(/\/en\/chat$/);

  // And a way back out to the site, pinned to the foot of the sidebar.
  await page.goto("/en/chat");
  await page.locator(".wiz-side").getByRole("link", { name: "Back to main site", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
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

  // The Search button sits inside the search box, after the published
  // archive. No separate clear button, no A–Z strip.
  await expect(page.locator("main").getByRole("button", { name: "Search" })).toHaveClass(
    /btn/,
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
  // Filing needs an account since the hero-CTAs change; sign in first with a
  // fresh contact so the one-time details gate is predictable.
  const contact = `track-${Date.now()}@example.org`;
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill(contact);
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/account$/);

  await beginRequest(page, "How many crop insurance claims were rejected?");
  await continueFromChat(page);
  await expect(page).toHaveURL(/\/en\/file\/details$/);
  await page.getByLabel("Full name").fill("A. Citizen");
  await page.getByLabel("Address line 1").fill("12 Station Road");
  await page.getByLabel("PIN code").fill("110001");
  await page.getByRole("button", { name: "Save and continue filing" }).click();
  await expect(page).toHaveURL(/\/en\/file$/);
  await dismissGuidelines(page);
  // The router suggests an authority when it recognises the question; when it
  // does not, the citizen picks — this test is about the tracking link, not
  // the matcher, so choose explicitly rather than depending on it.
  if ((await page.locator("#ministry-select").inputValue()) === "") {
    await page.locator("#ministry-select").selectOption("Department of Agriculture, Cooperation & Farmers Welfare");
    await page.locator("#authority-select").selectOption("Department of Agriculture, Cooperation & Farmers Welfare");
  }
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();
  await page.waitForURL(/\/file\/done$/);
  await page.getByRole("link", { name: "Track this request" }).click();
  await page.waitForURL(/\/track\//);
  // Signed-in filings land inside the account shell; the shareable link is
  // the same case id on the public track page.
  const accountUrl = page.url();
  const url = accountUrl.replace("/account/track/", "/track/");
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
  // Already signed in above, so go straight to the account's track page.
  await page.goto("/en/account/track");
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
