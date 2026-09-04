import { test, expect, type Page } from "@playwright/test";

/**
 * The RTI journey chart: every stage and statutory day count from the
 * board's reference diagram, redrawn in the prototype's tokens, with the
 * same journey repeated in words below it.
 */
async function login(page: Page) {
  await page.goto("/en/login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/en\/account$/);
}

/** Every label must sit inside its box, with room to spare. */
async function noBoxOverflow(page: Page) {
  const overflows = await page
    .locator(".flow-scroll svg g")
    .evaluateAll((gs) =>
      gs
        .map((g) => {
          const rect = g.querySelector("rect");
          const text = g.querySelector("text");
          if (!rect || !text) return null;
          const r = (rect as SVGGraphicsElement).getBBox();
          const tb = (text as SVGGraphicsElement).getBBox();
          return tb.width <= r.width - 8
            ? null
            : `${text.textContent} (${Math.round(tb.width)}px in ${Math.round(r.width)}px)`;
        })
        .filter(Boolean),
    );
  expect(overflows).toEqual([]);
}

test("process chart carries the whole journey", async ({ page }) => {
  await login(page);
  await page.goto("/en/account/process");

  await expect(
    page.getByRole("heading", { name: "How your request moves" }),
  ).toBeVisible();

  const svg = page.locator(".flow-scroll svg");
  await expect(svg).toBeVisible();
  for (const label of [
    "RTI request",
    "Reply",
    "No reply",
    "Transfer",
    "Not satisfied",
    "Satisfied",
    "First appeal",
    "Decision",
    "No decision",
    "Second appeal",
    "Section 18 complaint",
    "No time limit",
  ]) {
    await expect(svg.locator("text", { hasText: label }).first()).toBeVisible();
  }
  for (const count of ["30 days", "5 days", "45 days", "90 days"]) {
    await expect(svg.locator("text", { hasText: count }).first()).toBeVisible();
  }

  // The words-alternative lists the same six stages.
  await expect(page.locator(".step-list li")).toHaveCount(6);

  await noBoxOverflow(page);
});

test("process chart speaks the reader's language", async ({ page }) => {
  // The Hindi login strings are not translated yet, so the form itself falls
  // back to English — the chart must not.
  await page.goto("/hi/login");
  await page.getByLabel("Email ID").fill("someone@example.org");
  await page.getByLabel("Password").fill("Rti@2026");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/hi\/account$/);
  await page.goto("/hi/account/process");

  const svg = page.locator(".flow-scroll svg");
  for (const label of ["आरटीआई आवेदन", "प्रथम अपील", "निर्णय", "असंतुष्ट", "संतुष्ट"]) {
    await expect(svg.locator("text", { hasText: label }).first()).toBeVisible();
  }

  await noBoxOverflow(page);
});
