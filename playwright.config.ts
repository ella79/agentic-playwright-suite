import {
  defineConfig,
  devices,
  type ReporterDescription,
} from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "https://automationexercise.com";

/**
 * The published dashboard is built from these results. environmentInfo fills
 * the report's Environment widget, so a run says what it executed against
 * instead of leaving a reader to guess which branch or host produced it.
 */
const allureReporter: ReporterDescription = [
  "allure-playwright",
  {
    resultsDir: "allure-results",
    environmentInfo: {
      base_url: BASE_URL,
      browser: "Chromium",
      viewport: "1920x1080",
      node: process.version,
      os: `${process.platform} ${process.arch}`,
      ci: process.env.CI ? "GitHub Actions" : "local",
      commit: process.env.GITHUB_SHA?.slice(0, 8) ?? "working tree",
      branch: process.env.GITHUB_REF_NAME ?? "local",
    },
  },
];

export default defineConfig({
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // CI uses the blob reporter because the functional and visual jobs each
  // produce one, and only blobs merge into a single correct HTML report;
  // locally the HTML report is more useful directly. Allure runs in both,
  // since the published dashboard is built from its results.
  reporter: process.env.CI
    ? [
        ["blob"],
        allureReporter,
        ["junit", { outputFile: "reports/junit/results.xml" }],
        // The metrics page is built from this. It is the only reporter that
        // states flaky as a first class outcome, which is the number the page
        // exists to track.
        ["json", { outputFile: "reports/results.json" }],
      ]
    : [
        ["html", { open: "never" }],
        allureReporter,
        ["junit", { outputFile: "reports/junit/results.xml" }],
      ],
  use: {
    baseURL: BASE_URL,
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
      name: "e2e-playwright",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      // The agent seed. It has its own project because it is the template
      // generated tests start from rather than coverage: inside the functional
      // project it would run as a twenty-first case. The planner still needs to
      // execute it to prove the environment initialises, so it needs a project
      // to run under. It sits in specs/ beside the plans it bootstraps, matched
      // by name so the rest of that directory stays Markdown.
      name: "seed",
      testDir: "./specs",
      testMatch: /seed\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "visual-regression",
      testDir: "./vr-tests",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
