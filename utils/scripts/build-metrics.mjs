// Builds the suite health page from Playwright's JSON reports.
//
// This is deliberately not the Allure dashboard. Allure answers what a given
// run found, case by case. This answers whether the suite is trustworthy and
// which way it is moving: how often it is flaky, how long it takes at the
// ninety fifth percentile, which cases cost the most, and whether any of that
// has crossed the threshold where someone should act. Nothing here repeats a
// per test status list, because that already exists one click away.
//
// Usage:
//   node utils/scripts/build-metrics.mjs \
//     --suite functional=reports/functional.json \
//     --suite visual=reports/visual.json \
//     --history previous/history.json \
//     --out site/metrics
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** Pass rate at or above this is a healthy suite. Below the second, it is not. */
const PASS_RATE_GOOD = 90;
const PASS_RATE_ACCEPTABLE = 85;

/** Above one percent, flakiness starts costing trust in the suite. */
const FLAKY_RATE_GOOD = 1;
const FLAKY_RATE_ACCEPTABLE = 5;

/** How many runs the trends and the offender tables look back over. */
const WINDOW = 30;

/**
 * Suites with a deliberate ceiling on case count. Cross browser has none: it is
 * the same twenty cases on other engines, so a cap there would be meaningless.
 */
const CAPS = { functional: 20, visual: 20 };

const args = process.argv.slice(2);
const options = {
  suites: [],
  history: undefined,
  out: "metrics",
  categories: undefined,
};
for (let i = 0; i < args.length; i += 2) {
  const [flag, value] = [args[i], args[i + 1]];
  if (flag === "--suite") options.suites.push(value);
  if (flag === "--history") options.history = value;
  if (flag === "--out") options.out = value;
  if (flag === "--categories") options.categories = value;
}

const percentile = (values, p) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil((p / 100) * sorted.length) - 1,
  );
  return sorted[Math.max(0, index)];
};

const round = (value, digits = 1) => Number(value.toFixed(digits));

/** Playwright nests specs inside suites, arbitrarily deep. */
function collectCases(node, cases = []) {
  for (const spec of node.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const attempts = test.results ?? [];
      cases.push({
        title: spec.title,
        status: test.status,
        duration: attempts.reduce((sum, r) => sum + (r.duration ?? 0), 0),
      });
    }
  }
  for (const child of node.suites ?? []) collectCases(child, cases);
  return cases;
}

async function readSuite(spec) {
  const [name, path] = spec.split("=");
  const report = JSON.parse(await readFile(path, "utf-8"));
  const cases = (report.suites ?? []).flatMap((s) => collectCases(s));
  const durations = cases.map((c) => c.duration);
  const stats = report.stats ?? {};
  const total = cases.length;
  const flaky = stats.flaky ?? 0;
  const failed = stats.unexpected ?? 0;
  const skipped = stats.skipped ?? 0;

  return {
    name,
    total,
    passed: total - failed - skipped,
    failed,
    flaky,
    skipped,
    passRate: total ? round(((total - failed - skipped) / total) * 100) : 0,
    flakyRate: total ? round((flaky / total) * 100, 2) : 0,
    durationMs: Math.round(stats.duration ?? 0),
    p50: Math.round(percentile(durations, 50)),
    p95: Math.round(percentile(durations, 95)),
    slowest: [...cases]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map((c) => ({ title: c.title, duration: c.duration })),
    unstable: cases
      .filter((c) => c.status !== "expected" && c.status !== "skipped")
      .map((c) => ({ title: c.title, status: c.status })),
  };
}

const suites = [];
for (const spec of options.suites) suites.push(await readSuite(spec));

let history = [];
if (options.history) {
  try {
    history = JSON.parse(await readFile(options.history, "utf-8"));
  } catch {
    history = [];
  }
}

const entry = {
  run: Number(process.env.GITHUB_RUN_NUMBER ?? history.length + 1),
  date: new Date().toISOString(),
  commit: (process.env.GITHUB_SHA ?? "local").slice(0, 8),
  branch: process.env.GITHUB_REF_NAME ?? "local",
  runUrl: process.env.GITHUB_RUN_URL ?? null,
  suites: Object.fromEntries(
    suites.map((s) => [
      s.name,
      {
        total: s.total,
        passed: s.passed,
        failed: s.failed,
        flaky: s.flaky,
        skipped: s.skipped,
        passRate: s.passRate,
        flakyRate: s.flakyRate,
        durationMs: s.durationMs,
        p50: s.p50,
        p95: s.p95,
      },
    ]),
  ),
  // Only the cases that misbehaved are kept, so the file stays small enough to
  // read at a glance after a hundred runs.
  unstable: suites.flatMap((s) =>
    s.unstable.map((c) => ({ suite: s.name, ...c })),
  ),
};

history = [...history, entry].slice(-200);
const window = history.slice(-WINDOW);

const verdict = (value, good, acceptable, higherIsBetter = true) => {
  const ok = higherIsBetter ? value >= good : value <= good;
  const middling = higherIsBetter ? value >= acceptable : value <= acceptable;
  return ok ? "good" : middling ? "warn" : "bad";
};

/** Offenders are counted across the window, not the last run alone. */
const offenders = new Map();
for (const run of window) {
  for (const c of run.unstable ?? []) {
    const key = `${c.suite}::${c.title}`;
    const current = offenders.get(key) ?? {
      suite: c.suite,
      title: c.title,
      count: 0,
    };
    current.count += 1;
    offenders.set(key, current);
  }
}
const topOffenders = [...offenders.values()]
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

function sparkline(values, { width = 260, height = 40, min, max }) {
  if (values.length < 2) return "<span class=none>not enough runs yet</span>";
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = hi - lo || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - lo) / span) * height;
      return `${round(x, 2)},${round(y, 2)}`;
    })
    .join(" ");
  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img"><polyline points="${points}" /></svg>`;
}

/**
 * Allure's own Categories tab only lists failures, so it reads as empty while
 * the suite is green. The taxonomy is worth showing regardless: it says what
 * this suite expects to go wrong and how it will be named when it does.
 */
let categories = [];
if (options.categories) {
  try {
    categories = JSON.parse(await readFile(options.categories, "utf-8"));
  } catch {
    categories = [];
  }
}

const seconds = (ms) => `${round(ms / 1000, 1)}s`;
const escape = (text) =>
  String(text).replace(
    /[<>&]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c],
  );

const suiteRows = suites
  .map((s) => {
    const pass = verdict(s.passRate, PASS_RATE_GOOD, PASS_RATE_ACCEPTABLE);
    const flake = verdict(
      s.flakyRate,
      FLAKY_RATE_GOOD,
      FLAKY_RATE_ACCEPTABLE,
      false,
    );
    return `<tr>
      <th scope="row">${escape(s.name)}</th>
      <td>${CAPS[s.name] ? `${s.total} / ${CAPS[s.name]}` : s.total}</td>
      <td class="${pass}">${s.passRate}%</td>
      <td class="${flake}">${s.flakyRate}%</td>
      <td>${seconds(s.p50)}</td>
      <td>${seconds(s.p95)}</td>
      <td>${seconds(s.durationMs)}</td>
    </tr>`;
  })
  .join("");

const trendRows = suites
  .map((s) => {
    const passRates = window
      .map((r) => r.suites?.[s.name]?.passRate)
      .filter((v) => typeof v === "number");
    const p95s = window
      .map((r) => r.suites?.[s.name]?.p95)
      .filter((v) => typeof v === "number");
    return `<tr>
      <th scope="row">${escape(s.name)}</th>
      <td class="spark">${sparkline(passRates, { min: 0, max: 100 })}</td>
      <td class="spark">${sparkline(p95s, {})}</td>
    </tr>`;
  })
  .join("");

const slowestRows = suites
  .flatMap((s) => s.slowest.map((c) => ({ suite: s.name, ...c })))
  .sort((a, b) => b.duration - a.duration)
  .slice(0, 5)
  .map(
    (c) =>
      `<tr><th scope="row">${escape(c.title)}</th><td>${escape(c.suite)}</td><td>${seconds(c.duration)}</td></tr>`,
  )
  .join("");

const offenderRows = topOffenders.length
  ? topOffenders
      .map(
        (o) =>
          `<tr><th scope="row">${escape(o.title)}</th><td>${escape(o.suite)}</td><td>${o.count} of ${window.length}</td></tr>`,
      )
      .join("")
  : `<tr><td colspan="3" class="none">No case failed or retried in the last ${window.length} runs.</td></tr>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Suite health</title>
<style>
  :root { color-scheme: light dark; --line:#8884; --good:#1a7f37; --warn:#9a6700; --bad:#cf222e; }
  body { font: 15px/1.55 -apple-system, "Segoe UI", system-ui, sans-serif; margin: 0 auto; padding: 2rem 1.25rem 4rem; max-width: 60rem; }
  h1 { margin: 0 0 .25rem; font-size: 1.6rem; }
  h2 { margin: 2.5rem 0 .5rem; font-size: 1.1rem; }
  p.sub { margin: 0 0 1.5rem; opacity: .7; }
  table { border-collapse: collapse; width: 100%; margin-top: .5rem; }
  th, td { text-align: left; padding: .5rem .6rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
  thead th { font-size: .78rem; letter-spacing: .04em; text-transform: uppercase; opacity: .65; }
  tbody th { font-weight: 600; }
  td.good { color: var(--good); font-weight: 600; }
  td.warn { color: var(--warn); font-weight: 600; }
  td.bad  { color: var(--bad);  font-weight: 600; }
  .spark svg { width: 260px; height: 40px; }
  .spark polyline { fill: none; stroke: currentColor; stroke-width: 1.5; opacity: .8; }
  .none { opacity: .6; font-style: italic; }
  nav a { margin-right: 1rem; }
  footer { margin-top: 3rem; opacity: .7; font-size: .9rem; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: .35rem 1rem; margin: .5rem 0 0; }
  dt { font-weight: 600; }
  dd { margin: 0; }
</style>
</head>
<body>
<h1>Suite health</h1>
<p class="sub">Run ${entry.run} &middot; ${entry.commit} on ${escape(entry.branch)} &middot; ${new Date(entry.date).toUTCString()}</p>

<nav>
  <a href="../">Test results</a>
  <a href="../functional/">Functional report</a>
  <a href="../visual/">Visual report</a>
  <a href="../cross-browser/">Cross browser</a>
  <a href="https://github.com/ella79/agentic-playwright-suite">Repository</a>
</nav>

<h2>Current run</h2>
<table>
  <thead><tr><th>Suite</th><th>Cases, cap</th><th>Pass rate</th><th>Flaky rate</th><th>p50</th><th>p95</th><th>Wall clock</th></tr></thead>
  <tbody>${suiteRows}</tbody>
</table>

<h2>Last ${window.length} runs</h2>
<table>
  <thead><tr><th>Suite</th><th>Pass rate, 0 to 100</th><th>p95 duration</th></tr></thead>
  <tbody>${trendRows}</tbody>
</table>

<h2>Slowest cases in this run</h2>
<table>
  <thead><tr><th>Case</th><th>Suite</th><th>Duration</th></tr></thead>
  <tbody>${slowestRows}</tbody>
</table>

<h2>Repeat offenders</h2>
<table>
  <thead><tr><th>Case</th><th>Suite</th><th>Runs affected</th></tr></thead>
  <tbody>${offenderRows}</tbody>
</table>

<h2>How a failure gets classified</h2>
<p class="sub">Applied automatically to any failure in the report. Empty while everything passes, which is the point.</p>
<table>
  <thead><tr><th>Category</th><th>Matches</th></tr></thead>
  <tbody>${
    categories.length
      ? categories
          .map(
            (c) =>
              `<tr><th scope="row">${escape(c.name)}</th><td>${escape(c.description ?? (c.matchedStatuses ?? []).join(", "))}</td></tr>`,
          )
          .join("")
      : '<tr><td colspan="2" class="none">No categories file was provided.</td></tr>'
  }</tbody>
</table>

<h2>Thresholds</h2>
<dl>
  <dt>Pass rate</dt><dd>${PASS_RATE_GOOD}% or above is healthy, ${PASS_RATE_ACCEPTABLE} to ${PASS_RATE_GOOD}% is acceptable during active development, below ${PASS_RATE_ACCEPTABLE}% means the suite has a stability problem rather than the application.</dd>
  <dt>Flaky rate</dt><dd>Below ${FLAKY_RATE_GOOD}% is the target. Past ${FLAKY_RATE_ACCEPTABLE}% the suite stops being believed, and a suite nobody believes is worse than no suite.</dd>
  <dt>Duration</dt><dd>Tracked as a trend, not a fixed limit. What matters is whether it is growing faster than coverage.</dd>
  <dt>Coverage cap</dt><dd>Twenty cases for the functional suite and twenty for the visual one. New coverage replaces an existing case rather than adding to the count. Cross browser has no cap of its own: it runs the same functional cases on WebKit and on a phone viewport.</dd>
</dl>

<footer>
  Built from Playwright's JSON report on every run and accumulated on the published branch.
  Case level results, traces and screenshots live in the <a href="../">Allure report</a>; this page
  deliberately does not repeat them.
</footer>
</body>
</html>
`;

await mkdir(options.out, { recursive: true });
await writeFile(join(options.out, "history.json"), JSON.stringify(history));
await writeFile(join(options.out, "index.html"), html);

console.log(`Metrics written to ${options.out} (${history.length} runs kept)`);
for (const s of suites) {
  console.log(
    `  ${s.name}: ${s.passRate}% pass, ${s.flakyRate}% flaky, p95 ${seconds(s.p95)}`,
  );
}
