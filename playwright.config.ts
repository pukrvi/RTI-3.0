import { defineConfig, devices } from "@playwright/test";

/**
 * Two viewports, because "designed for real Indian users" mostly means a phone.
 * 390px is an iPhone-class screen; 1280px is the desktop a reviewer will use.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 30_000,
  // `next dev` compiles a route on first request, so the very first assertions
  // of a cold run can outlast the 5s default.
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "off",
  },
  // Starts `next dev` if it is not already up. Set BASE_URL to run the same
  // suite against `npm run preview` (the Workers runtime) or a deployed URL.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000/en",
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [
    {
      name: "mobile-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "desktop-1280",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      // Most users are on a phone on a slow connection. The journey must not
      // depend on JavaScript arriving, so this project runs the same walk with
      // scripting switched off.
      name: "no-js",
      testMatch: /nojs\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        javaScriptEnabled: false,
      },
    },
  ],
});
