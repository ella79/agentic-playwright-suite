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
  subSuite,
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
/**
 * What each project contributes to the report tree. The two functional
 * projects share a parent, so the report reads as one suite on two engines
 * rather than two unrelated ones. Visual stays on Chromium: three engines
 * would mean sixty baselines to review.
 */
const PROJECTS: Record<string, { parent: string; engine: string }> = {
  "e2e-chromium": { parent: "Functional E2E", engine: "Chromium" },
  "e2e-webkit": { parent: "Functional E2E", engine: "WebKit" },
  "visual-regression": { parent: "Visual regression", engine: "Chromium" },
  seed: { parent: "Functional E2E", engine: "Chromium" },
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
  const project = PROJECTS[testInfo.project.name] ?? {
    parent: "Functional E2E",
    engine: "Chromium",
  };
  const area = (testInfo.titlePath[1] ?? "Uncategorised")
    .replace("Visual regression - ", "")
    .replace(/^\w/, (c) => c.toUpperCase());

  await parentSuite(project.parent);

  // Functional cases run twice, once per engine, so the engine is what tells
  // two otherwise identical results apart; the area sits below it. Visual runs
  // on one engine, where that branch would never fork.
  if (isVisual) {
    await suite(area);
  } else {
    await suite(project.engine);
    await subSuite(area);
  }

  await epic(project.parent);
  await feature(area);
  await story(testInfo.title);

  await tag(isVisual ? "visual" : "functional");

  await severity(
    CRITICAL_AREAS.has(area) && !isVisual ? Severity.CRITICAL : Severity.NORMAL,
  );

  // Recorded as a parameter rather than only in the suite name, so Allure
  // treats the same case run on two engines as one case in two configurations
  // instead of two unrelated results.
  await parameter("browser", project.engine);

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
