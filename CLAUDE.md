# Agentic Playwright Suite

E2E and visual regression test suite for [Automation Exercise](https://automationexercise.com), built with Playwright and TypeScript.

## Tech Stack

- **Node.js 20+** + **Yarn**
- **TypeScript 5** — strict mode
- **Playwright** — Chromium only, fully parallel runs
- **Allure** — reporting, published to GitHub Pages with trend history

## Commands

| Command                             | Purpose                                                |
| ----------------------------------- | ------------------------------------------------------ |
| `yarn test:e2e`                     | Run all functional E2E tests                           |
| `yarn test:e2e:headed`              | Run with visible browser                               |
| `yarn test:e2e:ui`                  | Playwright interactive UI                              |
| `yarn test:vr`                      | Run all visual regression tests                        |
| `yarn test:vr:update`               | Regenerate VR baselines after an intentional UI change |
| `yarn test:report`                  | Open last Playwright HTML report                       |
| `yarn typecheck`                    | TypeScript check (no emit)                             |
| `yarn lint` / `yarn lint:fix`       | ESLint check / auto-fix                                |
| `yarn stylecheck` / `yarn stylefix` | Prettier check / auto-fix                              |

Base URL defaults to `https://automationexercise.com`. Override with `E2E_BASE_URL`.

## Project Structure

```
tests/               Functional E2E spec files (*.spec.ts), one directory per feature area
seed/                Environment seed used as the template for generated tests
vr-tests/            Visual regression spec files (*.vr.spec.ts) + baseline snapshots
specs/               Test plans (Markdown) + STATUS.md + DECISIONS.md
utils/
  pageObjects/        Page object classes — BaseAppPage (pages) / BaseComponentPage (modals)
  fixtures/           Custom Playwright fixtures (account lifecycle)
  testData.ts         Unique data generators
  url.ts              URL constants
playwright.config.ts  Playwright configuration (chromium + visual projects)
.github/workflows/    CI pipeline: static-checks, e2e-tests, visual-regression, publish-dashboard
```

## Writing Tests

Full coding standards: `.claude/skills/playwright-pageobject-testing/SKILL.md`

Quick rules:

- **Locators** — semantic only: `getByRole`, `getByLabel`, `getByText`, `getByTestId` (`data-qa` attribute); CSS as last resort, documented inline when used
- **Page objects** — `BaseAppPage` for URL-addressable pages, `BaseComponentPage` for modals (root-scoped); task-oriented method names; `readonly` locators
- **Spec header** — every spec file starts with `// spec: specs/test-plans/<plan>.md`
- **Grouping** — `test.describe()` per scenario group; `test.step()` for distinct phases of one scenario
- **Known failures** — `test.fixme()` only, never `test.skip()`
- **No hard waits** — no `waitForTimeout` in test code; use condition-based waiting
- **Account lifecycle** — tests needing a logged-in user use the `uniqueAccount` fixture (signs up a throwaway account, cleans it up after) rather than a shared seed account — see `specs/DECISIONS.md` for why

## Persistent State

- `specs/STATUS.md` — current coverage, open questions, next steps. Read at the start of any session.
- `specs/DECISIONS.md` — append-only log of scope/architecture decisions and why they were made.

## Agent System

This project uses a Playwright QA agent hierarchy in `.claude/agents/`. Start with **playwright-test-manager** or **playwright-test-companion** for any new session or coverage question.

| Agent                       | Role                                                                             | Source                        |
| --------------------------- | -------------------------------------------------------------------------------- | ----------------------------- |
| `playwright-test-manager`   | Senior QA authority — strategy, coverage gaps, quality gates, session continuity | hand-written                  |
| `playwright-test-companion` | Orchestrator — drives full plan→implement→review→validate cycles                 | hand-written                  |
| `playwright-test-planner`   | Explores the live app and writes test plans to `specs/`                          | `init-agents` + project rules |
| `playwright-test-generator` | Implements individual test cases from a plan                                     | `init-agents` + project rules |
| `playwright-test-reviewer`  | Read-only auditor — checks code against conventions                              | hand-written                  |
| `playwright-test-healer`    | Debugs and fixes failing tests                                                   | `init-agents` + project rules |

Regenerate the three generated agents after a Playwright upgrade with `npx playwright init-agents --loop=claude`, then re-append the "Project rules for this repository" section each one ends with.

Slash commands in `.claude/commands/` invoke them: `/coverage`, `/plan`, `/implement`, `/review`, `/heal`, `/cycle`.

Browser access goes through the MCP servers in `.mcp.json` — `playwright-test` for authoring (it reads `playwright.config.ts`, so agents inherit `baseURL`, the `data-qa` test id attribute, and the viewport), `playwright` for ad-hoc exploration. See `.claude/skills/playwright-mcp/SKILL.md`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`), four jobs:

1. `static-checks` — every push/PR: typecheck, lint, format check
2. `e2e-tests` — functional suite, sharded
3. `visual-regression` — VR suite, separate job so a broken screenshot doesn't block functional signal
4. `publish-dashboard` — merges results into an Allure report with trend history, deploys to GitHub Pages (push to `main` only)
