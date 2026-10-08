import fs from "fs";
import path from "path";
import { type TestInfo } from "@playwright/test";
import {
  allureId,
  epic,
  historyId,
  feature,
  issue,
  link,
  parameter,
  parentSuite,
  severity,
  Severity,
  story,
  subSuite,
  suite,
  tag,
  testCaseId,
  tms,
} from "allure-js-commons";

const REPO_BLOB =
  "https://github.com/ella79/agentic-playwright-suite/blob/main";

/** The visual project's name in `playwright.config.ts`. */
const VISUAL_PROJECT = "visual-regression";

/** The API project's name in `playwright.config.ts`. */
const API_PROJECT = "api";

/**
 * What each project contributes to the report tree. Visual stays on Chromium:
 * three engines would mean sixty baselines to review. API has no browser at
 * all, so its own "engine" is the protocol it actually runs over, not a
 * placeholder browser name.
 */
const PROJECTS: Record<string, { parent: string; engine: string }> = {
  "e2e-chromium": { parent: "Functional E2E", engine: "Chromium" },
  "e2e-webkit": { parent: "Functional E2E", engine: "WebKit" },
  [VISUAL_PROJECT]: { parent: "Visual Regression", engine: "Chromium" },
  [API_PROJECT]: { parent: "API", engine: "REST" },
  seed: { parent: "Functional E2E", engine: "Chromium" },
};

/**
 * Cases whose failure means a user cannot buy, or cannot get into their
 * account. Everything else is normal severity; marking every case critical
 * would say nothing. Named after the current per-file areas, which all carry
 * a "Page" suffix (see `area` below) — "Authentication" split into "Login
 * Page" and "Signup Page" when login and signup became separate specs, and
 * this set was never updated to match, so nothing had matched it since.
 */
const CRITICAL_AREAS = new Set(["Cart Page", "Login Page", "Signup Page"]);

/** Where a failure stops a purchase outright, rather than making one harder. */
const BLOCKER_AREAS = new Set(["Checkout Page", "Payment Page"]);

/** `TC-05`, `VR-30`, `API-20`: the identifier every case title opens with. */
const CASE_ID = /^((?:TC|VR|API)-\d+)\b/;

/** A parked case names its defect as `#123` in the `test.fixme` reason. */
const ISSUE_REFERENCE = /#(\d+)/;

/**
 * Visual drift is minor on purpose: worth knowing, not worth paging anyone, and
 * it keeps the chart readable when a browser update moves every baseline at
 * once. The seed is the generator's template, not coverage.
 */
function severityFor(
  area: string,
  isVisual: boolean,
  isSeed: boolean,
): Severity {
  if (isSeed) return Severity.TRIVIAL;
  if (isVisual) return Severity.MINOR;
  if (BLOCKER_AREAS.has(area)) return Severity.BLOCKER;
  if (CRITICAL_AREAS.has(area)) return Severity.CRITICAL;
  return Severity.NORMAL;
}

/** The `// spec:` header every spec file carries, so the link is never stale. */
function readPlanPath(specFile: string): string | undefined {
  const firstLine = fs.readFileSync(specFile, "utf-8").split("\n", 1)[0] ?? "";
  return firstLine.startsWith("// spec:")
    ? firstLine.replace("// spec:", "").trim()
    : undefined;
}

/**
 * Applies the labels the Allure report groups and filters by. Without them the
 * dashboard is a flat list of results that cannot be told apart; with them the
 * three suites separate, each area is its own branch, and a failing case
 * links to the plan that justifies its existence.
 */
export async function applyAllureLabels(testInfo: TestInfo): Promise<void> {
  const isVisual = testInfo.project.name === VISUAL_PROJECT;
  const isApi = testInfo.project.name === API_PROJECT;
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

  await tag(isVisual ? "visual" : isApi ? "api" : "functional");

  await severity(severityFor(area, isVisual, testInfo.project.name === "seed"));

  const caseId = CASE_ID.exec(testInfo.title)?.[1];
  if (caseId) {
    // History and retries key on `historyId`, normally derived from the full
    // name plus the parameters, so a rename orphans a case's history. The
    // engine stays in the key, or Chromium and WebKit share one history and a
    // failure on either hides. `testCaseId` is parameter independent by
    // design; `allureId` is the test plan identifier.
    await historyId(`${caseId}.${project.engine}`);
    await testCaseId(caseId);
    await allureId(caseId);
  }

  // Recorded as a parameter rather than only in the suite name, so Allure
  // treats the same case run on two engines as one case in two configurations
  // instead of two unrelated results.
  await parameter("browser", project.engine);

  // The path alone: the reporter's `links` option turns it into an address.
  const plan = readPlanPath(testInfo.file);
  if (plan) {
    await tms(plan);
  }

  // So the report answers why a skipped case is skipped.
  const parked = testInfo.annotations.find(
    (annotation) => annotation.type === "fixme",
  );
  const defect = parked?.description
    ? ISSUE_REFERENCE.exec(parked.description)?.[1]
    : undefined;
  if (defect) {
    await issue(defect);
  }
  // POSIX separators, so the link works when the run happened on Windows.
  const sourcePath = path
    .relative(process.cwd(), testInfo.file)
    .split(path.sep)
    .join("/");
  await link(`${REPO_BLOB}/${sourcePath}`, "Source", "source");
}
