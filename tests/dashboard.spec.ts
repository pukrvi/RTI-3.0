import { test, expect } from "@playwright/test";

/**
 * The filing front door (`account/new`), after the Paper frames.
 *
 * "File an RTI Manually" and "File with RTI Mitra AI" share the first row in
 * two equal columns; the three helper cards follow in one row of three with
 * every description exactly two lines, so no card outgrows its neighbours.
 * The track / appeal / history cards that used to sit between them are gone —
 * those live in the account menu now.
 */
test("new request actions stand level", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);
  await page.goto("/en/account/new");

  const nav = page.locator("nav.dash-actions");
  await expect(nav).toBeVisible();

  const titles = await nav.locator(".action-t").allTextContents();
  expect(titles).toEqual([
    "File an RTI Manually",
    "File with RTI Mitra AI",
    "Understand the process",
    "Learn about RTI",
    "List of Authorities",
  ]);

  // Manual filing goes straight to the one-page form; Mitra goes to chat.
  await expect(nav.getByRole("link", { name: /^File an RTI Manually/ })).toHaveAttribute(
    "href",
    /\/file$/,
  );
  await expect(nav.getByRole("link", { name: /^File with RTI Mitra AI/ })).toHaveAttribute(
    "href",
    /\/chat$/,
  );

  // Learn about RTI leaves for the Act on the DoPT site; Understand the
  // process stays inside, on the chart page.
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

  // Secondary descriptions: all three the same height (exactly two lines).
  const descHeights = await nav
    .locator(".card-grid .action-d")
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  expect(descHeights).toHaveLength(3);
  for (const h of descHeights) {
    expect(Math.abs(h - descHeights[0])).toBeLessThanOrEqual(1);
  }

  // Secondary cards: level within the row.
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

  // No whitespace below the footer in the document. And when the content
  // is shorter than the viewport (desktop), the footer rests at the fold
  // instead of floating mid-page. Not position:sticky — the footer still
  // scrolls with the document on taller viewports.
  const geom = await page.evaluate(() => {
    const footer = document.querySelector(".site-footer")!;
    const rect = footer.getBoundingClientRect();
    return {
      scroll: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      below: document.documentElement.scrollHeight - (window.scrollY + rect.bottom),
      fold: window.innerHeight - rect.bottom,
    };
  });
  expect(Math.abs(geom.below)).toBeLessThanOrEqual(1);
  if (geom.scroll <= 1) expect(Math.abs(geom.fold)).toBeLessThanOrEqual(1);
});
