import fs from "fs";
import path from "path";
import { type TestInfo } from "@playwright/test";
import {
  epic,
  feature,
  link,
  parameter,
  parentSuite,
  severity,
  Severity,
  story,
  suite,
  tag,
} from "allure-js-commons";

const REPO_BLOB =
  "https://github.com/ella79/agentic-playwright-suite/blob/main";

/**
 * Cases whose failure means a user cannot buy, or cannot get into their
 * account. Everything else is normal severity; marking all twenty critical
 * would say nothing.
 */
/** What each project actually drives, for the report's parameter. */
const ENGINES: Record<string, string> = {
  "e2e-playwright": "Chromium",
  "visual-regression": "Chromium",
  webkit: "WebKit",
  "mobile-safari": "WebKit on iPhone 15",
  seed: "Chromium",
};

const CRITICAL_AREAS = new Set(["Checkout", "Authentication", "Cart"]);

/** The `// spec:` header every spec file carries, so the link is never stale. */
function readPlanPath(specFile: string): string | undefined {
  const firstLine = fs.readFileSync(specFile, "utf-8").split("\n", 1)[0] ?? "";
  return firstLine.startsWith("// spec:")
    ? firstLine.replace("// spec:", "").trim()
    : undefined;
}

/**
 * Applies the labels the Allure report groups and filters by. Without them the
 * dashboard is a flat list of forty results that cannot be told apart; with
 * them the two suites separate, each area is its own branch, and a failing case
 * links to the plan that justifies its existence.
 */
export async function applyAllureLabels(testInfo: TestInfo): Promise<void> {
  const isVisual = testInfo.project.name === "visual-regression";

  // The report groups by this name. Cross browser runs the same cases twice,
  // once per engine, so without a name per project both appear under one node
  // and a reader cannot tell which engine a result came from.
  const SUITE_NAMES: Record<string, string> = {
    "e2e-playwright": "Functional E2E",
    "visual-regression": "Visual regression",
    webkit: "WebKit",
    "mobile-safari": "Mobile Safari",
  };
  const suiteName = SUITE_NAMES[testInfo.project.name] ?? testInfo.project.name;
  const area = (testInfo.titlePath[1] ?? "Uncategorised")
    .replace("Visual regression - ", "")
    .replace(/^\w/, (c) => c.toUpperCase());

  await parentSuite(suiteName);
  await suite(area);

  await epic(suiteName);
  await feature(area);
  await story(testInfo.title);

  await tag(isVisual ? "visual" : "functional");

  await severity(
    CRITICAL_AREAS.has(area) && !isVisual ? Severity.CRITICAL : Severity.NORMAL,
  );

  // Recorded as a parameter rather than only in the suite name, so Allure
  // treats the same case run on two engines as one case in two configurations
  // instead of two unrelated results.
  await parameter("browser", ENGINES[testInfo.project.name] ?? "Chromium");

  const plan = readPlanPath(testInfo.file);
  if (plan) {
    await link(`${REPO_BLOB}/${plan}`, "Test plan", "test-plan");
  }
  // POSIX separators, so the link works when the run happened on Windows.
  const sourcePath = path
    .relative(process.cwd(), testInfo.file)
    .split(path.sep)
    .join("/");
  await link(`${REPO_BLOB}/${sourcePath}`, "Source", "source");
}
