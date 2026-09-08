# Agentic Playwright Suite

End-to-end and visual regression tests for [Automation Exercise](https://automationexercise.com),
written with Playwright and TypeScript, driven by a Claude Code agent workflow, and gated by a
GitHub Actions pipeline that publishes its own results.

- **Live dashboard:** https://ella79.github.io/agentic-playwright-suite/ (Allure, with pass-rate
  trend across runs)
- **Scope:** 20 functional cases, 20 visual cases, one browser, one viewport
- **Target:** a public demo storefront, so every run hits a real network, real third-party ads, and
  a real database

The suite is deliberately small. Twenty well-argued cases with a green pipeline say more about
judgment than two hundred that nobody can explain.

## Quick Start

```bash
yarn install
yarn playwright:install
yarn test:e2e
```

| Command                                            | Purpose                                          |
| -------------------------------------------------- | ------------------------------------------------ |
| `yarn test:e2e`                                    | Functional suite                                 |
| `yarn test:vr`                                     | Visual suite against committed baselines         |
| `yarn docker:vr`                                   | Visual suite in the same Linux image CI uses     |
| `yarn docker:vr:update`                            | Regenerate baselines with CI-identical rendering |
| `yarn test:report`                                 | Open the last HTML report                        |
| `yarn typecheck` / `yarn lint` / `yarn stylecheck` | The three static gates CI runs first             |

## Architecture

```
tests/          20 functional cases, one directory per feature area
vr-tests/       20 visual cases plus their committed baselines
specs/          Test plans, STATUS.md, DECISIONS.md
utils/
  pageObjects/  BaseAppPage (pages) and BaseComponentPage (modals)
  fixtures/     Account lifecycle and third-party request blocking
.claude/        Agents, skills, and slash commands
env/docker/     Images for local and CI execution
```

**Two page object bases, not one.** `BaseAppPage` owns navigation and shared chrome.
`BaseComponentPage` takes a root locator and resolves every child inside it, so two modals sharing
a label can never cross-match. Every locator is a `readonly` property; no spec reaches the DOM
directly.

**Semantic locators, with the exceptions documented.** Priority runs `getByRole` → `getByLabel` →
`getByPlaceholder` → `getByText` → `getByTestId`. The application ships `data-qa` attributes, which
`testIdAttribute` maps onto `getByTestId`, so test ids here are a semantic option rather than an
escape hatch. Where a control genuinely has no accessible name — icon-only buttons, layout
wrappers — the CSS fallback carries an inline comment saying why.

**Every test owns its data.** Tests needing a signed-in user take a `uniqueAccount` fixture that
registers a throwaway account and deletes it afterwards, asserting the deletion actually happened.
No shared seed account, no shared storage state, nothing to contend over between parallel workers.

**Third-party noise is blocked, not tolerated.** Ad, analytics, and consent-management hosts are
aborted at the route level. They are not the product under test, and they inject layout shifts that
would make visual comparison meaningless.

## Decisions Worth Defending

The full log is in [`specs/DECISIONS.md`](specs/DECISIONS.md). Three that a reviewer would question:

**No shared authenticated storage state.** The usual optimization is to log in once and reuse the
session. It is the right call when login is an expensive OAuth redirect; here it is a two-field
POST. Reusing one account would mean the account-deletion test destroys the session every other
test depends on, and parallel shards racing over one identity. Isolation is worth more than the
second it saves.

**No custom screenshot runtime.** A wrapper enforcing named capture strategies pays for itself
across hundreds of visual tests. Across twenty it is indirection with no payer. Native
`toHaveScreenshot()` with documented thresholds does the same work in less code.

**Baselines are generated in CI, never on a laptop.** Screenshots are platform-specific. A baseline
produced on Windows will not match a Linux runner, so locally generated ones are gitignored and a
separate manual workflow regenerates the authoritative set on the platform that compares them.

## The Agent Workflow

`.claude/` holds six agents, three skills, an MCP server configuration, and the slash commands that
connect them. They are not documentation — they were used to build and audit this suite.

| Agent                       | Owns                                                   |
| --------------------------- | ------------------------------------------------------ |
| `playwright-test-manager`   | Strategy, coverage gaps, the suite caps, quality gates |
| `playwright-test-companion` | Full plan → implement → review → validate cycles       |
| `playwright-test-planner`   | Live exploration through MCP, then a written plan      |
| `playwright-test-generator` | One case at a time, from an existing plan              |
| `playwright-test-reviewer`  | Read-only convention audit                             |
| `playwright-test-healer`    | Root-cause diagnosis of failures                       |

| Command             | Effect                                                                  |
| ------------------- | ----------------------------------------------------------------------- |
| `/coverage`         | Manager audits plans against implementations and proposes the next move |
| `/plan <area>`      | Planner explores the live site through MCP and writes a plan            |
| `/implement <case>` | Generator implements exactly that case                                  |
| `/review [files]`   | Reviewer audits against the checklist                                   |
| `/heal <case>`      | Healer diagnoses before touching anything                               |
| `/cycle <area>`     | Companion runs the whole loop                                           |

Browser access goes through the official
[Playwright MCP server](https://github.com/microsoft/playwright-mcp), configured in `.mcp.json` with
`--test-id-attribute data-qa` so an agent exploring the site resolves test ids exactly as the suite
does.

**The skills are enforced, not suggested.** Four rules from
`.claude/skills/playwright-pageobject-testing/SKILL.md` — no hard waits, no skipped tests, no forced
clicks, every test must assert — are configured as ESLint errors scoped to spec files. A violation
fails `static-checks` before any test runs. A standard that only lives in prose is a standard that
erodes.

### What the agents actually found

Both of these were live in the suite and would have shipped:

- The reviewer caught that a visual case masked the exact element it was capturing. The delivery
  address screenshot was a rectangle of mask boxes — it would have passed against a blank address
  block. The case asserted nothing.
- The healer traced a visual case that could never pass to a defect in the application: the payment
  form wraps fields in Bootstrap 4 `.form-row` markup while the site ships Bootstrap 3 CSS. With no
  clearfix rule, every row and the `<form>` itself collapse to zero height. The page only looks
  correct because the parent grid column is floated. The fix targets that column, with the cause
  recorded in the page object.

## CI/CD

```
static-checks ──┬──▶ e2e-tests (2 shards) ──┐
                │                           ├──▶ publish-dashboard
                └──▶ visual-regression ─────┘
```

Runs on every push and pull request to `main`.

- `static-checks` — typecheck, lint, format. Gates everything else.
- `e2e-tests` — functional suite across two shards.
- `visual-regression` — separate job, so a screenshot diff never hides functional signal. It fails
  fast if no Linux baselines are committed, because with no baseline Playwright writes one and
  reports success: the job would go green while comparing nothing.
- `publish-dashboard` — merges results from every shard, restores the previous run's trend history
  from the published site, and deploys the Allure report to GitHub Pages. Runs on `main` only.

Traces, screenshots, and visual diffs upload as artifacts on failure.

## What Broke While Building This

Kept because the failures are more informative than the passes.

| Symptom                                    | Actual cause                                                                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart empty after adding from the listing   | Adding is an XHR; navigating straight to the cart cancelled it. The page object now returns the confirmation modal so callers must wait for it |
| Review form filled the wrong field         | `getByPlaceholder` matches substrings, so "Email Address" also matched the footer's "Your email address"                                       |
| Contact success assertion hit two elements | The page renders the same success text twice, once for the form and once for a hidden newsletter widget                                        |
| Search test failed on a correct result     | Search matches category names, not just product names. The test was wrong, not the site                                                        |
| Payment form screenshot never captured     | Zero-height form: Bootstrap 4 markup, Bootstrap 3 CSS                                                                                          |

Product-side observations are logged in [`specs/STATUS.md`](specs/STATUS.md) rather than worked
around silently.

## Not Covered, On Purpose

- Payment rejection: the application accepts any card, so a declined-payment test would assert
  behaviour that does not exist.
- Client-side validation: the forms defer to native browser handling, which would test the browser.
- Cross-browser and mobile viewports: one browser and one viewport keep the baseline set reviewable.
  Adding a second viewport doubles it.
- API coverage: the application exposes endpoints worth testing, but they belong in their own suite
  rather than bolted onto a UI one.
