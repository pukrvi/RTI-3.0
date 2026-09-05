import { test, expect } from "@playwright/test";
import { axeScan, beginRequest, continueFromChat, dismissGuidelines, loginIfNeeded, watchConsole } from "./helpers";

/**
 * The whole citizen journey, end to end, on a phone-sized screen and a desktop.
 * A reviewer has to be able to finish this. So does this test.
 */

const REF = /^[A-Z]{5}\/[RA]\/E\/\d{2}\/\d{5}$/;

test.describe("pre-filing journey", () => {
  test("Central subject: ask → one-page form → pay → confirm → track → appeal", async ({
    page,
  }) => {
    const problems = watchConsole(page);

    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);

    // 1 — Ask, in plain language, through the assistant.
    await beginRequest(page, "How many MGNREGA wage payments are pending in my district?");
    await expect(page.locator(".msg-user")).toContainText("MGNREGA");
    await expect(page.locator(".msg-bot")).toHaveCount(1);

    // Pathway one: it is already published, so that comes back as a card and
    // filing becomes the secondary action.
    await expect(page.locator(".chat-card-found").first()).toBeVisible();
    // Both sources of "already out there": what the ministry published, and
    // what it released to somebody who asked before — now two distinct cards.
    await expect(page.locator(".chat-card-found")).toHaveCount(1);
    await expect(page.locator(".chat-card-replies")).toHaveCount(1);
    await expect(page.getByText("Someone already asked this")).toBeVisible();
    await expect(page.getByText(/MGNREGA wage payment status/)).toBeVisible();
    await expect(page.getByRole("button", { name: "File an RTI anyway" })).toBeVisible();
    await axeScan(page, "step 1 ask");
    await continueFromChat(page);
    // Filing needs an account; chatting did not. Sign in at the gate and
    // land back on the form with the conversation's draft intact.
    await loginIfNeeded(page);

    // 2 — One page for the whole application, filled in from the conversation:
    // the authority it worked out, the question, the letter started.
    // Fresh account: the one-time details step comes first.
    if (/\/file\/details/.test(page.url())) {
      await page.getByLabel("Full name").fill("A. Citizen");
      await page.getByLabel("Address line 1").fill("12 Station Road");
      await page.getByLabel("PIN code").fill("110001");
      await page.getByRole("button", { name: "Save and continue filing" }).click();
    }
    // Pathname, not the full URL: /login?next=/en/file ends in "/en/file" too.
    await expect.poll(async () => new URL(page.url()).pathname).toBe("/en/file");
    await dismissGuidelines(page);
    await expect(page.locator("#ministry-select")).not.toHaveValue("");
    await expect(page.locator("#authority-select")).not.toHaveValue("");
    await expect(page.locator("#authority-select option:checked")).toContainText(
      "Ministry of Rural Development",
    );
    await expect(page.getByLabel(/In one line/)).not.toHaveValue("");
    await page.getByLabel("Your name").fill("A. Citizen");
    await page.getByLabel(/Email address/).fill("someone@example.org");
    await page.getByLabel("Address line 2").fill("Second line, properly labelled");
    await axeScan(page, "filing form");
    await page.getByRole("button", { name: "Continue to payment" }).click();

    // 3 — Pay. A confirmation first: what you are about to pay, and for what.
    // No payment field exists anywhere; the full disclosure is on /about.
    await expect(page).toHaveURL(/\/en\/pay$/);
    await expect(page.getByText(/You are about to pay ₹10/)).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.locator('input[name*="card" i]')).toHaveCount(0);
    await axeScan(page, "pay");
    await page.getByRole("button", { name: /Pay ₹10 and file/ }).click();

    // 4 — The confirmation screen: registration number, nothing else to do.
    await expect(page).toHaveURL(/\/en\/file\/done$/);
    await expect(
      page.getByRole("heading", { name: "Your application is filed" }),
    ).toBeVisible();
    const doneRef = ((await page.locator(".refno").first().textContent()) ?? "").trim();
    expect(doneRef).toMatch(REF);
    await axeScan(page, "confirmation");
    await page.getByRole("link", { name: "Track this request" }).click();

    // 5 — Track. The statutory clock is computed and shown.
    await expect(page).toHaveURL(/\/en\/(account\/)?track\//);
    const ref = ((await page.locator(".refno").first().textContent()) ?? "").trim();
    expect(ref).toMatch(REF);
    await expect(page.getByText("30 days left")).toBeVisible();
    // The due date lives in the summary rail beside the clock, not inside it.
    await expect(page.getByText("Reply due", { exact: true })).toBeVisible();
    await axeScan(page, "track");

    await page.getByRole("button", { name: "Jump past the deadline" }).click();
    await expect(page.getByText(/days overdue/)).toBeVisible();
    await expect(page.getByText("You can appeal")).toBeVisible();
    // The appeal window date sits in the summary rail too.
    await expect(page.getByText("Appeal by", { exact: true })).toBeVisible();
    await expect(page.getByText(/Appeal window closes on/)).toBeVisible();

    // 7 — Appeal, prefilled, inside the window.
    await page.getByRole("link", { name: "Prepare my appeal" }).click();
    await expect(page).toHaveURL(/\/en\/(account\/)?appeal\//);
    await expect(page.getByLabel("Ground for appeal")).toHaveValue("no-response");
    expect(await page.getByLabel(/Your appeal, in full/).inputValue()).toContain(ref);
    await axeScan(page, "appeal");
    await page.getByRole("button", { name: /File the appeal/ }).click();

    await expect(page).toHaveURL(/\/en\/(account\/)?track\//);
    await expect(page.getByText("First appeal filed").first()).toBeVisible();

    expect(problems, problems.join("\n")).toHaveLength(0);
  });

  test("State subject is stopped before payment", async ({ page }) => {
    const problems = watchConsole(page);

    await beginRequest(page, "I want a copy of my land record, khasra and mutation entry");

    // The stop happens in the conversation, before the citizen has gone
    // anywhere near a fee, and there is no file button on offer.
    await expect(page.locator(".chat-card-stop").first()).toBeVisible();
    await expect(page.getByText("You have been charged nothing. ₹0.")).toBeVisible();
    await expect(page.getByRole("button", { name: /File an RTI anyway|File this request/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /payment/i })).toHaveCount(0);
    await axeScan(page, "state stop");

    expect(problems, problems.join("\n")).toHaveLength(0);
  });

  test("Hindi: Devanagari is accepted and routed", async ({ page }) => {
    const problems = watchConsole(page);

    await page.goto("/hi");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "सूचना का अधिकार आवेदन दायर कीजिए",
    );

    await beginRequest(page, "मेरा पीएफ निकासी दावा कितने दिन में निपटा?", "hi");
    await expect(page.locator(".msg-user")).toContainText("पीएफ");
    await expect(page.getByText(/ईपीएफओ/).first()).toBeVisible();
    await axeScan(page, "hindi chat");
    await continueFromChat(page, "hi");
    await loginIfNeeded(page, `e2e-${Date.now()}@example.org`, "hi");
    // Fresh account: the one-time details step comes first.
    if (/\/file\/details/.test(page.url())) {
      await page.getByLabel("पूरा नाम").fill("क. नागरिक");
      await page.getByLabel("पता पंक्ति 1").fill("12 स्टेशन रोड");
      await page.getByLabel("पिन कोड").fill("110001");
      await page.getByRole("button", { name: "सहेजें और आवेदन जारी रखें" }).click();
    }
    await expect.poll(async () => new URL(page.url()).pathname).toBe("/hi/file");

    expect(problems, problems.join("\n")).toHaveLength(0);
  });

  test("Devanagari survives all the way to the filed request", async ({ page }) => {
    await beginRequest(page, "मेरे जिले में मनरेगा की कितनी मजदूरी लंबित है?", "hi");
    await continueFromChat(page, "hi");
    await loginIfNeeded(page, `e2e-${Date.now()}@example.org`, "hi");

    // Fresh account: the one-time details step comes first.
    if (/\/file\/details/.test(page.url())) {
      await page.getByLabel("पूरा नाम").fill("क. नागरिक");
      await page.getByLabel("पता पंक्ति 1").fill("12 स्टेशन रोड");
      await page.getByLabel("पिन कोड").fill("110001");
      await page.getByRole("button", { name: "सहेजें और आवेदन जारी रखें" }).click();
    }
    await expect.poll(async () => new URL(page.url()).pathname).toBe("/hi/file");
    await dismissGuidelines(page);
    await page.getByLabel("आपका नाम").fill("क. नगरिक");
    await page.getByLabel("ईमेल पता").fill("someone@example.org");
    await page.getByRole("button", { name: "भुगतान पर जारी रखें" }).click();

    await expect(page).toHaveURL(/\/hi\/pay$/);
    await page.getByRole("button", { name: "₹10 देकर आवेदन करें (नकली)" }).click();

    // The whole point: the Devanagari the citizen typed is still there,
    // now on the confirmation screen under the registration number.
    await expect(page).toHaveURL(/\/hi\/file\/done$/);
    await expect(page.locator(".refno")).toHaveText(/^[A-Z]{5}\/R\/E\/\d{2}\/\d{5}$/);
    await expect(page.locator(".kv dd").filter({ hasText: "मनरेगा" }).first()).toBeVisible();
  });

  test("keyboard: the first main control shows a focus outline", async ({ page }) => {
    await page.goto("/en");

    const outline = await page.evaluate(() => {
      const el = document.querySelector("main a.btn") as HTMLElement;
      el.focus();
      return getComputedStyle(el).outlineStyle;
    });
    expect(outline).not.toBe("none");
  });

  test("about page states what is real and what is mocked", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "What is real, and what is mocked",
    );
    await expect(page.getByText(/No Aadhaar, PAN, OTP, card or bank data/)).toBeVisible();
    await axeScan(page, "about");
  });
});
