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

/** The visual project's name in `playwright.config.ts`. */
const VISUAL_PROJECT = "vr";

/**
 * What each project contributes to the report tree. Visual stays on Chromium:
 * three engines would mean sixty baselines to review.
 */
const PROJECTS: Record<string, { parent: string; engine: string }> = {
  "e2e-chromium": { parent: "Functional E2E", engine: "Chromium" },
  "e2e-webkit": { parent: "Functional E2E", engine: "WebKit" },
  [VISUAL_PROJECT]: { parent: "Visual regression", engine: "Chromium" },
  seed: { parent: "Functional E2E", engine: "Chromium" },
};

/**
 * Cases whose failure means a user cannot buy, or cannot get into their
 * account. Everything else is normal severity; marking all twenty critical
 * would say nothing.
 */
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
  const isVisual = testInfo.project.name === VISUAL_PROJECT;
  const project = PROJECTS[testInfo.project.name] ?? {
    parent: "Functional E2E",
    engine: "Chromium",
  };
  const area = (testInfo.titlePath[1] ?? "Uncategorised")
    .replace("Visual regression - ", "")
    .replace(/^\w/, (c) => c.toUpperCase());

  // The engine rides on the parent, not a level below it. The overview charts
  // the top of the suites tree, so a shared "Functional E2E" parent drew both
  // engines as one bar and a WebKit failure stayed invisible until someone
  // expanded the tree. Split here, each engine gets its own row and its own
  // count.
  await parentSuite(`${project.parent} · ${project.engine}`);
  await suite(area);
  // allure-playwright fills subSuite from the describe titles whenever a test
  // leaves it unset, which restates the area one level below itself. The spec
  // file is the honest third level: it is the same today and forks the day an
  // area grows a second file.
  await subSuite(path.basename(testInfo.file));

  // Behaviour is not per engine: the same case proves the same thing on both,
  // so the epic stays unqualified and the Behaviors tab does not fork in two.
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
