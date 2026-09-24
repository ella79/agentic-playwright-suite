# Agentic Playwright Suite

End to end, API and visual regression test suite for [Automation Exercise](https://automationexercise.com), built with Playwright and TypeScript.

## Tech Stack

- **Node.js 20+** + **Yarn 4** via Corepack (`yarn.lock` is the only lockfile; CI runs `yarn install --immutable`)
- **TypeScript 5**: strict mode
- **Playwright**: Chromium and WebKit for the functional suite, Chromium only for visual regression, fully parallel runs
- **Allure**: reporting, published to GitHub Pages with trend history

## Environment

Yarn 4 through Corepack; there is no global install. Invoke everything with `yarn`. Browser
interaction during development goes through the two MCP servers in `.mcp.json`
(`playwright-test` for authoring, `playwright` for exploration), not a direct
`yarn playwright <args>` invocation; see `.claude/skills/playwright-mcp/SKILL.md`.

## Commands

| Command                                          | Purpose                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| `yarn test:e2e`                                  | Run all functional E2E tests                     |
| `yarn test:api`                                  | Run all API tests                                |
| `yarn test:vr`                                   | Run all visual regression tests                  |
| `yarn docker:vr` / `yarn docker:vr:update`       | Run or regenerate baselines in the image CI uses |
| `yarn typecheck`, `yarn lint`, `yarn stylecheck` | The three static checks. All must be clean       |

The full list, with the headed, UI, debug and report variants, is in
[`docs/architecture.md`](docs/architecture.md).

Base URL defaults to `https://automationexercise.com`. Override with `E2E_BASE_URL`.

## Project Structure

```
tests/               Functional E2E spec files (*.spec.ts), one directory per feature area
api-tests/           API spec files (*.api.spec.ts), one per resource area, no browser
vr-tests/            Visual regression spec files (*.vr.spec.ts) + baseline snapshots
specs/               Test plans (Markdown) + STATUS.md + seed.spec.ts
utils/
  pageObjects/        Page object classes, BaseAppPage (pages) / BaseComponentPage (modals)
  apiClients/         API client classes, one per resource area, wraps `request`
  fixtures/           Custom Playwright fixtures (account lifecycle, third party blocking)
  testData.ts         Unique data generators
  url.ts              URL constants
playwright.config.ts  Playwright configuration (e2e-chromium, e2e-webkit, api, seed, vr projects)
.github/workflows/    CI pipeline: resolve-pr-run, prepare-playwright-image, static-checks,
                       e2e-chromium, e2e-webkit, visual-regression, api, publish-dashboard, ci-gate
```

## Writing Tests

The coding standard is in the skills, not here. Both load automatically for the files they govern:
[page objects and specs](.claude/skills/playwright-pageobject-testing/SKILL.md),
[screenshots](.claude/skills/playwright-visual-regression/SKILL.md).

## Persistent State

`specs/STATUS.md` — coverage, findings, open decisions. Read it at the start of any session.
Reasoning behind the architecture is in [`docs/decisions.md`](docs/decisions.md).

## Agent System

Start with **playwright-test-manager** for any session or coverage question: it owns the cycle and
delegates to the four specialists.

| Agent                       | Role                                | Source        |
| --------------------------- | ----------------------------------- | ------------- |
| `playwright-test-manager`   | Scope, caps, gates, the whole cycle | hand-written  |
| `playwright-test-planner`   | Explores the live app, writes plans | `init-agents` |
| `playwright-test-generator` | Implements one case at a time       | `init-agents` |
| `playwright-test-reviewer`  | Read-only convention audit          | hand-written  |
| `playwright-test-healer`    | Diagnoses failures, edits specs     | `init-agents` |

Planner, generator and healer are regenerated after a Playwright upgrade with
`npx playwright init-agents --loop=claude`; re-append the project rules section each one ends with.

Slash commands in `.claude/commands/` invoke them: `/coverage`, `/plan`, `/implement`, `/review`, `/heal`, `/cycle`, `/baseline`, `/triage`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`), stages `build` → `check` → `end2end`:

0. `resolve-pr-run` — on push to `main`, finds the pull request run that already tested the same files
1. `prepare-playwright-image` — builds and pushes the execution image every later job runs inside
2. `static-checks` — typecheck, lint, format; gates everything after it
3. `e2e-chromium`, `e2e-webkit`, `visual-regression`, `api` — in parallel, on pull requests and on `main`
4. `publish-dashboard` — merges the reports and deploys to Pages, `main` only
5. `ci-gate` — reads every other job's result; the only check branch protection requires

`main` takes no direct pushes. Adding a job means adding it to the gate's `needs`. The reasoning
behind each of these is in [`docs/pipeline.md`](docs/pipeline.md).
