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

  // History: one row per request, carrying the withdrawn, refused and
  // appealed states alongside the ordinary ones.
  await page.getByRole("link", { name: "View history" }).click();
  await expect(page.getByRole("row")).toHaveCount(9); // header + 8
  await expect(page.getByText("Withdrawn by the applicant")).toBeVisible();
  await expect(page.getByText("Refused under section 8")).toBeVisible();
  await expect(page.getByText("Appeal filed").first()).toBeVisible();

  // Appeals: two ready (overdue silence, recent refusal), one already filed.
  await page.getByRole("link", { name: "File appeal" }).click();
  await expect(
    page.getByRole("link", { name: "Prepare this appeal" }),
  ).toHaveCount(2);
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
}) => {
  const problems = watchConsole(page);
  await loginDemo(page);

  // Read one seeded registration number out of history, then find it through
  // the lookup box — the ref index fallback resolving without any stored ref.
  await page.goto("/en/account/history");
  const ref = ((await page.locator(".refno").first().textContent()) ?? "").trim();
  expect(ref).toMatch(/\//);
  await page.goto("/en/account/track");
  await page.getByLabel("Registration number").fill(ref);
  await page.getByRole("button", { name: "Find it" }).click();
  await page.waitForURL(/\/en\/track\/demo-/);
  await expect(page.getByText("Seeded demo record")).toBeVisible();

  // The refused seed shows its refusal; the withdrawn seed shows its note.
  await page.goto("/en/track/demo-r6-cbdt");
  await expect(page.getByText("Information refused")).toBeVisible();
  await page.goto("/en/track/demo-r8-dopt");
  await expect(page.getByText("Withdrawn by the applicant").first()).toBeVisible();

  expect(problems, problems.join("\n")).toEqual([]);
});
