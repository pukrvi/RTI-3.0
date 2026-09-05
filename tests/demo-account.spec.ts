import { test, expect, type Page } from "@playwright/test";
import { watchConsole } from "./helpers";

/**
 * The seeded demo account (vish@abc.com) ships with the code, so a fresh
 * clone shows a lived-in account with no setup and no database. These pins
 * hold every tab to its seeded shape: eight requests across every state the
 * account screens can show.
 */

async function loginDemo(page: Page) {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("vish@abc.com");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/account$/);
}

test("demo account shows eight seeded requests in every state", async ({
  page,
}) => {
  const problems = watchConsole(page);
  await loginDemo(page);

  // Dashboard: eight registered, and something waiting on the citizen.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dashboard");
  const cards = page.locator(".count-card");
  await expect(cards.filter({ hasText: "Requests" })).toContainText("Registered8");

  // Track status: open filings and answered-or-appealed ones, side by side.
  await page.getByRole("link", { name: "Track status" }).click();
  await expect(page.getByRole("heading", { name: "Waiting for a reply" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Answered or appealed" })).toBeVisible();

  // History: one row per request, carrying the refused and appealed states
  // alongside the ordinary ones.
  await page.getByRole("link", { name: "View history" }).click();
  await expect(page.getByRole("row")).toHaveCount(9); // header + 8
  await expect(page.getByText(/disposed of by the department/)).toBeVisible();
  await expect(page.getByText("Refused under Sec 8")).toBeVisible();
  await expect(page.getByText("Appeal filed").first()).toBeVisible();

  // Appeals: two ready (overdue silence, recent refusal), one already filed.
  // Each ready card is itself the way into the appeal form.
  await page.getByRole("link", { name: "File appeal" }).click();
  await expect(
    page.locator('ul.card-grid a[href*="/appeal/demo-"]'),
  ).toHaveCount(2);
  await expect(page.getByText(/Window closes/).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Appeals you have filed" })).toBeVisible();

  // Payments: eight request fees plus one free appeal.
  await page.getByRole("link", { name: "Payments and receipts" }).click();
  await expect(page.getByRole("columnheader", { name: "Transaction ID" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Payment mode" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "What for" })).toHaveCount(0);
  await expect(page.getByRole("cell", { name: /TXN\d{10}/ }).first()).toBeVisible();
  await expect(page.getByRole("cell", { name: "₹80" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Nil" })).toBeVisible();

  // Profile: the holder's details arrive filled in.
  await page.getByRole("link", { name: "Account information" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("Puneet Vishnawat");
  await expect(page.getByRole("radio", { name: "Male", exact: true })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Urban" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Illiterate", exact: true })).toBeChecked();
  await expect(
    page
      .getByRole("group", { name: "Are you below the poverty line?" })
      .getByRole("radio", { name: "No" }),
  ).toBeChecked();

  expect(problems, problems.join("\n")).toEqual([]);
});

test("demo seeds resolve by registration number and open read-only", async ({
  page,
  browser,
}) => {
  const problems = watchConsole(page);
  await loginDemo(page);

  // Read one seeded registration number out of history, then find it through
  // the lookup box — the ref index fallback resolving without any stored ref.
  // The hit opens beside the account menu, not on the standalone layout.
  await page.goto("/en/account/history");
  const ref = ((await page.locator(".refno").first().textContent()) ?? "").trim();
  expect(ref).toMatch(/\//);
  await page.goto("/en/account/track");
  await page.getByLabel("Registration number").fill(ref);
  await page.getByRole("button", { name: "Find it" }).click();
  await page.waitForURL(/\/en\/account\/track\/demo-/);
  await expect(page.locator(".refno").first()).toHaveText(ref);
  await expect(
    page
      .getByRole("navigation", { name: "Account menu" })
      .getByRole("link", { name: "Track status" }),
  ).toBeVisible();

  // Seeds are read-only inside the account too: no demo clock to move.
  await expect(
    page.getByRole("button", { name: "Jump past the deadline" }),
  ).toHaveCount(0);
  await expect(page.getByText("Seeded demo record")).toHaveCount(0);

  // The refused seed shows its refusal; the long-answered dopt seed shows
  // its supplied reply.
  await page.goto("/en/account/track/demo-r6-cbdt");
  await expect(page.getByText("Information refused")).toBeVisible();
  await page.goto("/en/account/track/demo-r8-dopt");
  await expect(page.getByText("Information supplied")).toBeVisible();
  // Answered long ago, so the appeal window has shut: no button, but the
  // page still names the date it closed — in the body and in the rail.
  await expect(page.getByText(/Appeal window closed on/)).toHaveCount(2);

  // The standalone tracking link still explains itself to an anonymous
  // visitor: the seed is read-only there, and says so.
  const anon = await browser.newContext();
  const anonPage = await anon.newPage();
  await anonPage.goto("/en/track/demo-r6-cbdt");
  await expect(anonPage.getByText("Seeded demo record")).toBeVisible();
  await anon.close();

  expect(problems, problems.join("\n")).toEqual([]);
});

test("every seeded state shows the same rail, in the same order", async ({
  page,
}) => {
  const problems = watchConsole(page);
  await loginDemo(page);

  const base = ["Status", "Registration number", "With", "Filed on", "Reply due"];
  const cases: Array<[string, string[]]> = [
    ["demo-r1-nh48", base],
    ["demo-r2-railrefund", base],
    ["demo-r3-passport", [...base, "Appeal by"]],
    ["demo-r4-epfo", [...base, "First appeal"]],
    ["demo-r5-mgnrega", [...base, "First appeal"]],
    ["demo-r6-cbdt", [...base, "Appeal by"]],
    ["demo-r7-toll", [...base, "First appeal", "Decision by"]],
    ["demo-r8-dopt", [...base, "First appeal"]],
  ];

  for (const [id, titles] of cases) {
    await page.goto(`/en/account/track/${id}`);
    const rail = page.locator(".rail-card");
    await expect(rail).toBeVisible();
    // One style everywhere: no heading inside the card, every grey title
    // stacked over its value, status first.
    await expect(rail.locator("h2")).toHaveCount(0);
    await expect(rail.locator("dt")).toHaveText(titles);
  }

  expect(problems, problems.join("\n")).toEqual([]);
});

test("an appealed request runs the decision clock, reply last", async ({
  page,
}) => {
  const problems = watchConsole(page);
  await loginDemo(page);
  await page.goto("/en/account/track/demo-r7-toll");

  // The CPIO's thirty days are over and done: no negative reply count, the
  // live figure is the FAA's thirty days to decide.
  await expect(page.getByText(/-\d+ days left/)).toHaveCount(0);
  await expect(page.getByText(/must decide by/)).toBeVisible();

  // Appeal status first, the authority's reply after the citizen's question.
  const ids = await page
    .locator(".detail-grid > .stack > section")
    .evaluateAll((els) =>
      els.map(
        (el) => el.getAttribute("aria-labelledby") ?? el.getAttribute("aria-label") ?? "",
      ),
    );
  expect(ids[0]).toBe("appeal-heading");
  expect(ids.indexOf("reply-heading")).toBeGreaterThan(ids.indexOf("asked-heading"));

  expect(problems, problems.join("\n")).toEqual([]);
});
