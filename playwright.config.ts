import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // Sharded CI runs use the blob reporter, which is the only one that can be
  // merged back into a single correct report across shards; locally the HTML
  // report is more useful. Allure runs in both because the published dashboard
  // is built from its results.
  reporter: process.env.CI
    ? [
        ["blob"],
        ["allure-playwright", { resultsDir: "allure-results" }],
        ["junit", { outputFile: "reports/junit/results.xml" }],
      ]
    : [
        ["html", { open: "never" }],
        ["allure-playwright", { resultsDir: "allure-results" }],
        ["junit", { outputFile: "reports/junit/results.xml" }],
      ],
  use: {
    baseURL: process.env.E2E_BASE_URL || "https://automationexercise.com",
    testIdAttribute: "data-qa",
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",
    screenshot: "only-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    },
  },
  projects: [
    {
      name: "chromium",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      // The agent seed. It has its own project because it is the template
      // generated tests start from rather than coverage: inside the functional
      // project it would run as a twenty-first case. The planner still needs to
      // execute it to prove the environment initialises, so it needs a project
      // to run under. Invoke with --project=seed.
      name: "seed",
      testDir: "./seed",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "visual",
      testDir: "./vr-tests",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
