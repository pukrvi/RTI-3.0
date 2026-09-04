import { test, expect } from "@playwright/test";

/**
 * Dashboard top actions, after the Paper "Dashboard Top Buttons" frame.
 *
 * "File an RTI" and "Try RTI Mitra AI" share the first row in two equal
 * columns; the six secondary cards follow in rows of three with every
 * description exactly two lines, so no card outgrows its neighbours.
 */
test("dashboard top actions stand level", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);

  const nav = page.locator("nav.dash-actions");
  await expect(nav).toBeVisible();

  const titles = await nav.locator(".action-t").allTextContents();
  expect(titles).toEqual([
    "File an RTI",
    "Try RTI Mitra AI",
    "Track an RTI",
    "Submit first appeal",
    "View history",
    "Understand the process",
    "Learn about RTI",
    "List of Authorities",
  ]);

  // Learn about RTI leaves for the Act on the DoPT site; Understand the
  // process stays inside, on the new chart page.
  const learn = nav.getByRole("link", { name: /^Learn about RTI/ });
  await expect(learn).toHaveAttribute("href", "https://rti.dopt.gov.in/rtiact.html");
  await expect(learn).toHaveAttribute("target", "_blank");
  await expect(nav.getByRole("link", { name: /^Understand the process/ })).toHaveAttribute(
    "href",
    /\/account\/process$/,
  );

  // Top pair: two equal columns.
  const topWidths = await nav
    .locator(".dash-actions-top .action-card")
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(topWidths).toHaveLength(2);
  expect(Math.abs(topWidths[0] - topWidths[1])).toBeLessThanOrEqual(1);

  // Secondary descriptions: all six the same height (exactly two lines).
  const descHeights = await nav
    .locator(".card-grid .action-d")
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  expect(descHeights).toHaveLength(6);
  for (const h of descHeights) {
    expect(Math.abs(h - descHeights[0])).toBeLessThanOrEqual(1);
  }

  // Secondary cards: level within each row.
  const rows = await nav.locator(".card-grid").evaluateAll((grids) =>
    grids.map((grid) =>
      Array.from(grid.querySelectorAll(".action-card")).map(
        (el) => el.getBoundingClientRect().height,
      ),
    ),
  );
  for (const row of rows) {
    for (const h of row) {
      expect(Math.abs(h - row[0])).toBeLessThanOrEqual(1);
    }
  }
});
