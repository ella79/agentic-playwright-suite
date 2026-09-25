# Agentic Playwright Suite

End to end, API and visual regression tests for [Automation Exercise](https://automationexercise.com),
written in Playwright and TypeScript, authored and healed through Claude Code agents over Playwright
MCP, and published from a containerised CI pipeline.

[![CI](https://github.com/ella79/agentic-playwright-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/ella79/agentic-playwright-suite/actions/workflows/ci.yml)

| Live                                                                                                                                                                                                               |                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| [Suite Health](https://ella79.github.io/agentic-playwright-suite/metrics/)                                                                                                                                         | Pass rate, flaky rate, p50 and p95, repeat offenders, against stated thresholds |
| [Test Results](https://ella79.github.io/agentic-playwright-suite/)                                                                                                                                                 | Three suites, Chromium and WebKit split under the functional one                |
| [Functional](https://ella79.github.io/agentic-playwright-suite/functional/), [Visual](https://ella79.github.io/agentic-playwright-suite/visual/) and [API](https://ella79.github.io/agentic-playwright-suite/api/) | Each suite with its own trend                                                   |
| [Trace Viewer](https://ella79.github.io/agentic-playwright-suite/playwright-report/)                                                                                                                               | Every step of every case, replayable                                            |

Built with Playwright, TypeScript, Yarn, Docker, Allure, GitHub Actions and Renovate, with Claude
Code agents reaching the browser over MCP.

## Current Coverage

See [`specs/STATUS.md`](specs/STATUS.md) for the full coverage table, open questions and decisions
needed.

## Run it

```bash
yarn install
yarn playwright:install:chromium
yarn test:e2e          # functional suite
yarn docker:vr         # visual suite, in the image CI uses
```

One case at a time while developing it, the suite afterwards:

```bash
yarn playwright test --grep "TC-12"
yarn test:e2e
```

The full command list is in [`docs/architecture.md`](docs/architecture.md).

Where a run leaves things: `playwright-report/` for the HTML report and its traces,
`reports/junit/results.xml` for the machine readable one, `test-results/` for the artefacts of a
failure, including the expected, actual and diff images of a screenshot comparison.

## What runs when

| Trigger                  | Runs                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| Pull request             | Static checks, functional suite (Chromium and WebKit), visual suite, API suite |
| Push to `main`           | The same, then the dashboards and the suite health page publish                |
| Image or lockfile change | The execution image is rebuilt and pushed to the registry first                |

Every job runs inside an image built by the first job, so browsers and dependencies install once
rather than four times, and a local run uses that same image.

`main` is protected and takes no direct pushes, including from its owner. Every change arrives
through a pull request, and the only check the protection requires is `ci-gate`, a job that reads
the result of all the others. A job that stops running therefore cannot quietly stop being
enforced.

The test jobs run in parallel under a worker budget: one each for the functional (both engines) and
visual jobs, two for the API job, which needs no browser and provisions its own throwaway accounts.
The shared demo host's capacity is inconsistent rather than a fixed limit; see
[`docs/decisions.md`](docs/decisions.md) for why the budget is capped rather than left to the
default.

## When a test goes flaky

A flaky test is a defect in the suite, not weather. The policy, in order:

1. It is never fixed by adding a retry, raising a timeout, or loosening an assertion. Those hide the
   cause and leave the case passing for the wrong reason.
2. The cause is established first, from the trace or by driving the flow live, then classified:
   application changed, test raced the UI, state left behind by another test, third party noise, or
   the application is genuinely broken.
3. If the application is at fault the test is not repaired. It is parked with `test.fixme()` naming
   the defect, and the defect is recorded in [`specs/STATUS.md`](specs/STATUS.md).
4. Above one percent flaky rate over the last 30 runs, no new coverage is added until it is back
   under. A suite nobody believes is worse than no suite.

This has already been exercised once; see [`docs/decisions.md`](docs/decisions.md) for the cause and
the fix.

## Structure

```
tests/        22 functional cases, one directory per feature area
api-tests/    19 API cases, no browser, no shared account
vr-tests/     33 visual cases and their committed Linux baselines
specs/        Test plans, the status report, the agent seed
utils/        Page objects, fixtures, test data, scripts
.claude/      Five agents, three skills, slash commands
env/docker/   Execution images for CI and local use
```

## When something looks broken

**The whole functional suite fails at the same step.** Look at the other engine in that run: if
WebKit passed the same twenty-two cases, the demo host was overloaded, not the suite. Four test jobs
hit it in parallel on `main`. Re-run with that hypothesis rather than editing a test.

**Visual cases fail locally with no obvious diff.** Baselines are Chromium on Linux. A local run on
Windows or macOS compares against a set that was never committed. Use `yarn docker:vr`, which runs
in the image CI uses.

**`yarn` is missing or the wrong version.** The repository pins Yarn 4 through Corepack in
`packageManager`. Run `corepack enable` once; there is nothing to install globally.

**No report after a run.** The HTML report is written by the run itself. Run the suite, then
`yarn test:e2e:report`.

## Read further

| Document                                       | Covers                                                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`specs/STATUS.md`](specs/STATUS.md)           | Coverage per area, findings raised against the application, open decisions                |
| [`docs/architecture.md`](docs/architecture.md) | Page objects, fixtures, locator policy, visual regression                                 |
| [`docs/pipeline.md`](docs/pipeline.md)         | The eight jobs, reusing the pull request's run, the published reports, dependency updates |
| [`docs/agents.md`](docs/agents.md)             | The five agents, the two MCP servers, how the skills are enforced                         |
| [`docs/decisions.md`](docs/decisions.md)       | The calls a reviewer would question, and what broke while building this                   |
