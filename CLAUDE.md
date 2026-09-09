# Agentic Playwright Suite

E2E and visual regression test suite for [Automation Exercise](https://automationexercise.com), built with Playwright and TypeScript.

## Tech Stack

- **Node.js 20+** + **Yarn 4** via Corepack (`yarn.lock` is the only lockfile; CI runs `yarn install --immutable`)
- **TypeScript 5**: strict mode
- **Playwright**: Chromium only, fully parallel runs
- **Allure**: reporting, published to GitHub Pages with trend history

## Commands

| Command                                          | Purpose                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| `yarn test:e2e`                                  | Run all functional E2E tests                     |
| `yarn test:vr`                                   | Run all visual regression tests                  |
| `yarn docker:vr` / `yarn docker:vr:update`       | Run or regenerate baselines in the image CI uses |
| `yarn typecheck`, `yarn lint`, `yarn stylecheck` | The three static checks. All must be clean       |

The full list, with the headed, UI, debug and report variants, is in
[`docs/architecture.md`](docs/architecture.md).

Base URL defaults to `https://automationexercise.com`. Override with `E2E_BASE_URL`.

## Project Structure

```
tests/               Functional E2E spec files (*.spec.ts), one directory per feature area
vr-tests/            Visual regression spec files (*.vr.spec.ts) + baseline snapshots
specs/               Test plans (Markdown) + STATUS.md + seed.spec.ts
utils/
  pageObjects/        Page object classes, BaseAppPage (pages) / BaseComponentPage (modals)
  fixtures/           Custom Playwright fixtures (account lifecycle)
  testData.ts         Unique data generators
  url.ts              URL constants
playwright.config.ts  Playwright configuration (e2e-chromium, e2e-webkit, visual-regression, seed projects)
.github/workflows/    CI pipeline: prepare-playwright-image, static-checks, e2e-chromium, e2e-webkit, visual-regression, publish-dashboard
```

## Writing Tests

Full coding standards: `.claude/skills/playwright-pageobject-testing/SKILL.md`

Quick rules:

- **Locators**: semantic only: `getByRole`, `getByLabel`, `getByText`, `getByTestId` (`data-qa` attribute); CSS as last resort, documented inline when used
- **Page objects**: `BaseAppPage` for URL-addressable pages, `BaseComponentPage` for modals (root-scoped); task-oriented method names; `readonly` locators
- **Page objects reach tests as fixtures**: `async ({ cartPage })`, declared in `utils/fixtures/testFixtures.ts`. No `new SomePage(page)` in a spec, no `let po` assigned in `beforeEach`
- **Spec headers**: every spec file starts with `// spec: specs/test-plans/<plan>.md` and `// seed: specs/seed.spec.ts`, the format Playwright's generator agent emits
- **Grouping**: `test.describe()` per scenario group; `test.step()` for distinct phases of one scenario
- **Known failures**: `test.fixme()` only, never `test.skip()`
- **No hard waits**: no `waitForTimeout` in test code; use condition-based waiting
- **Account lifecycle**: tests needing a logged-in user use the `uniqueAccount` fixture (signs up a throwaway account, cleans it up after) rather than a shared seed account, see the README for why

## Persistent State

- `specs/STATUS.md`: current coverage, open questions, next steps. Read at the start of any session.
- Architecture decisions and their reasoning live in the README, under "Decisions Worth Defending".

## Agent System

This project uses a Playwright QA agent hierarchy in `.claude/agents/`. Start with **playwright-test-manager** for any new session or coverage question: it owns the cycle and delegates to the four specialists.

| Agent                       | Role                                                                                  | Source                        |
| --------------------------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| `playwright-test-manager`   | Owns scope, the caps, the quality gates, and the plan→implement→review→validate cycle | hand-written                  |
| `playwright-test-planner`   | Explores the live app and writes test plans to `specs/`                               | `init-agents` + project rules |
| `playwright-test-generator` | Implements individual test cases from a plan                                          | `init-agents` + project rules |
| `playwright-test-reviewer`  | Read-only auditor, checks code against conventions                                    | hand-written                  |
| `playwright-test-healer`    | Debugs and fixes failing tests                                                        | `init-agents` + project rules |

Regenerate the three generated agents after a Playwright upgrade with `npx playwright init-agents --loop=claude`, then re-append the "Project rules for this repository" section each one ends with.

Slash commands in `.claude/commands/` invoke them: `/coverage`, `/plan`, `/implement`, `/review`, `/heal`, `/cycle`.

Browser access goes through the MCP servers in `.mcp.json`: `playwright-test` for authoring (it reads `playwright.config.ts`, so agents inherit `baseURL`, the `data-qa` test id attribute, and the viewport), `playwright` for ad-hoc exploration. See `.claude/skills/playwright-mcp/SKILL.md`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`), seven jobs in three stages:

1. **build**: `prepare-playwright-image` builds `env/docker/e2e-playwright.Dockerfile` and pushes it to ghcr.io. Every later job runs inside that image, so dependencies and browsers install once. The tag hashes `package.json` plus `yarn.lock`, so a dependency change forces a rebuild.
2. **check**: `static-checks` runs typecheck, lint and format check, and uploads lint findings to code scanning. It gates everything after it.
3. **end2end**: `e2e-chromium` and `e2e-webkit` are two entries of one `e2e` matrix job, and run in parallel with `visual-regression` under a worker budget against the shared demo host. `e2e-webkit` replays the same twenty functional cases on WebKit and is skipped on pull requests; its results join the Chromium ones in the published report, as a second branch under Functional E2E. `publish-dashboard` then merges the reports, restores Allure trend history, builds the suite health page, verifies the result against the portfolio's published contract in `env/contract/`, and deploys everything to GitHub Pages, on `main` only. A report that no longer fits the contract fails the job and leaves the previous dashboard up.

`ci-gate` runs last and reads every other job's result. It is the single check the branch protection requires: `main` takes no direct pushes, from anyone, and a pull request cannot merge until the gate is green. Adding a job means adding it to the gate's `needs` list rather than editing repository settings.
