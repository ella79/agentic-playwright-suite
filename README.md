# Agentic Playwright Suite

End to end and visual regression tests for [Automation Exercise](https://automationexercise.com),
written in Playwright and TypeScript, authored and healed through Claude Code agents over Playwright
MCP, and published from a containerised CI pipeline.

[![CI](https://github.com/ella79/agentic-playwright-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/ella79/agentic-playwright-suite/actions/workflows/ci.yml)

| Live                                                                                                                                                |                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Suite health](https://ella79.github.io/agentic-playwright-suite/metrics/)                                                                          | Pass rate, flaky rate, p50 and p95, repeat offenders, against stated thresholds |
| [Test results](https://ella79.github.io/agentic-playwright-suite/)                                                                                  | Both suites, with trend history                                                 |
| [Functional](https://ella79.github.io/agentic-playwright-suite/functional/) and [visual](https://ella79.github.io/agentic-playwright-suite/visual/) | Each suite with its own trend                                                   |
| [Trace viewer](https://ella79.github.io/agentic-playwright-suite/playwright-report/)                                                                | Every step of every case, replayable                                            |

**20 functional cases and 20 visual cases, both capped.** The functional cases also run on WebKit
and on a phone viewport, so the same coverage is proven on the engine behind Safari and on the
layout a phone gets. Visual baselines stay Chromium on Linux, generated in the same image CI runs. New coverage replaces an existing case rather than growing the
suite, because twenty cases that can each be justified demonstrate more than two hundred nobody can
explain.

The target is a public demo storefront, so every run crosses a real network and hits a real database
with third party advertising on the page. The failures that produces are the failures a real
pipeline produces.

## Run it

```bash
yarn install
yarn playwright:install:chromium
yarn test:e2e          # functional suite
yarn docker:vr         # visual suite, in the image CI uses
```

The full command list is in [`docs/architecture.md`](docs/architecture.md).

## What runs when

| Trigger                  | Runs                                                                  |
| ------------------------ | --------------------------------------------------------------------- |
| Pull request             | Static checks, functional suite, visual suite                         |
| Push to `main`           | The same, then the dashboards and the suite health page are published |
| Image or lockfile change | The execution image is rebuilt and pushed to the registry first       |

Every job runs inside an image built by the first job, so browsers and dependencies install once
rather than three times, and a local run uses that same image.

The cross browser job waits for the other two rather than running beside them. The target is a
shared public host, and six concurrent browsers against it made the two heaviest cases time out
while the same cases passed elsewhere in the same run. Three minutes of wall clock is the cost of
not being the cause of your own flakiness.

## When a test goes flaky

A flaky test is a defect in the suite, not weather. The policy, in order:

1. It is never fixed by adding a retry, raising a timeout, or loosening an assertion. Those hide the
   cause and leave the case passing for the wrong reason.
2. The cause is established first, from the trace or by driving the flow live, then classified:
   application changed, test raced the UI, state left behind by another test, third party noise, or
   the application is genuinely broken.
3. If the application is at fault the test is not repaired. It is parked with `test.fixme()` naming
   the defect, and the defect is recorded in [`specs/STATUS.md`](specs/STATUS.md).
4. Above one percent flaky rate, no new coverage is added until it is back under. A suite nobody
   believes is worse than no suite.

This has already been exercised. Five cases failed only under parallel load, and the cause was not
timing pressure but the cart's controls being anchors without `href` whose handlers had not bound
yet, so the clicks landed as silent no operations. The investigation is in
[`docs/decisions.md`](docs/decisions.md).

## Structure

```
tests/        20 functional cases, one directory per feature area
vr-tests/     20 visual cases and their committed Linux baselines
specs/        Test plans, the status report, the agent seed
utils/        Page objects, fixtures, test data, scripts
.claude/      Six agents, three skills, slash commands
env/docker/   Execution images for CI and local use
```

## Read further

| Document                                       | Covers                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| [`specs/STATUS.md`](specs/STATUS.md)           | Coverage per area, findings raised against the application, open decisions |
| [`docs/architecture.md`](docs/architecture.md) | Page objects, fixtures, locator policy, visual regression                  |
| [`docs/pipeline.md`](docs/pipeline.md)         | The five jobs, the published reports, dependency updates                   |
| [`docs/agents.md`](docs/agents.md)             | The six agents, the two MCP servers, how the skills are enforced           |
| [`docs/decisions.md`](docs/decisions.md)       | The calls a reviewer would question, and what broke while building this    |
