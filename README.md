# Agentic Playwright Suite

End to end and visual regression tests for [Automation Exercise](https://automationexercise.com),
written in Playwright and TypeScript.

The suite is authored and maintained through a Claude Code agent workflow that drives the browser
over Playwright MCP. It runs in a containerised GitHub Actions pipeline and publishes its own
results as a live dashboard.

| Resource                                    | Link                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| Test dashboard (Allure, with trend history) | https://ella79.github.io/agentic-playwright-suite/                           |
| Trace viewer (merged Playwright report)     | https://ella79.github.io/agentic-playwright-suite/playwright-report/         |
| Pipeline                                    | [GitHub Actions](https://github.com/ella79/agentic-playwright-suite/actions) |

[![CI](https://github.com/ella79/agentic-playwright-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/ella79/agentic-playwright-suite/actions/workflows/ci.yml)

## Scope

Twenty functional cases and twenty visual cases, one browser, one viewport. Both counts are capped.
New coverage replaces an existing case rather than growing the suite, because twenty cases that can
each be justified demonstrate more than two hundred nobody can explain.

The target is a public demo storefront, so every run crosses a real network and hits a real
database, with third party advertising on the page. That is deliberate: the failures it produces
are the failures a real pipeline produces.

## Prerequisites

- Node.js 20 or later
- Yarn
- Docker Desktop, only if you intend to work on visual regression

## Common Commands

```bash
yarn install
yarn playwright:install:chromium
yarn test:e2e
```

| Command                             | Purpose                                                 |
| ----------------------------------- | ------------------------------------------------------- |
| `yarn test:e2e`                     | Run the functional suite                                |
| `yarn test:e2e:headed`              | Run it with a visible browser                           |
| `yarn test:e2e:ui`                  | Open the Playwright UI runner                           |
| `yarn test:vr`                      | Run the visual suite against the committed baselines    |
| `yarn docker:vr`                    | Run the visual suite in the same Linux image CI uses    |
| `yarn docker:vr:update`             | Regenerate baselines with rendering identical to CI     |
| `yarn test:seed`                    | Run the environment seed the agents generate tests from |
| `yarn test:e2e:report`              | Open the last HTML report                               |
| `yarn typecheck`                    | TypeScript, no emit                                     |
| `yarn lint` / `yarn lint:fix`       | ESLint                                                  |
| `yarn stylecheck` / `yarn stylefix` | Prettier                                                |

## Environment Variables

None are required. The suite runs against the public demo site with no credentials, because every
test that needs an account registers its own and deletes it afterwards.

| Variable       | Effect                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| `E2E_BASE_URL` | Point the suite at a different host. Defaults to `https://automationexercise.com`       |
| `CI`           | Set by the pipeline. Switches reporters to blob, enables one retry, caps workers at two |

## Repository Structure

```
tests/                                 Functional specs, one directory per feature area
├── auth/authentication.spec.ts        TC-01 to TC-06
├── browsing/product-browsing.spec.ts  TC-07 to TC-11
├── cart/cart.spec.ts                  TC-12 to TC-16
├── checkout/checkout.spec.ts          TC-17
└── engagement/engagement.spec.ts      TC-18 to TC-20

vr-tests/                              Visual specs and their committed baselines
├── *.vr.spec.ts                       VR-01 to VR-20
└── *.vr.spec.ts-snapshots/            Chromium on Linux, 1920x1080

specs/
├── STATUS.md                          Test status report: coverage, findings, open decisions
├── seed.spec.ts                       Environment seed the agents start generated tests from
├── test-plans/                        One plan per functional area
└── vr-test-plans/                     One plan per visual area, plus shared conventions

utils/
├── pageObjects/
│   ├── baseAppPage.ts                 Base for URL addressable pages
│   ├── baseComponentPage.ts           Base for modals, root scoped
│   ├── shared/                        Modals reached from more than one page
│   ├── auth/ cart/ checkout/ ...      One directory per area
│   └── index.ts                       Barrel export
├── fixtures/
│   ├── testFixtures.ts                Account lifecycle, third party blocking, report labels
│   └── allureLabels.ts                Labels applied to every result
├── testData.ts                        Generated accounts, fixed products, card details
└── url.ts                             Route constants and patterns

.claude/                               Agents, skills, slash commands
env/docker/                            Execution images for CI and local use
.github/workflows/                     Pipeline definitions
```

## Architecture

**Two page object bases.** `BaseAppPage` owns navigation and the shared chrome. `BaseComponentPage`
takes a root locator and resolves every child inside it, so two modals sharing a label can never
cross match. Every locator is a `readonly` property and no spec reaches the DOM directly.

**Semantic locators, with the exceptions documented.** Priority runs `getByRole`, `getByLabel`,
`getByPlaceholder`, `getByText`, `getByTestId`. The application ships `data-qa` attributes and
`testIdAttribute` maps onto them, so a test id here is a semantic option rather than an escape
hatch. Where a control genuinely has no accessible name, such as an icon only button, the CSS
fallback carries an inline comment saying why.

**Fixtures own lifecycle, not construction.** Specs construct their own page objects. What is a
fixture is the account: it registers a throwaway user, yields it, and removes it afterwards while
asserting the removal actually happened. No shared account, no shared storage state, nothing for
parallel workers to contend over.

**Third party noise is blocked rather than tolerated.** Advertising, analytics and consent
management hosts are aborted at the route level. None of it is the product under test, and all of it
injects layout shifts that would make visual comparison meaningless.

## Coverage

Current results and the per area breakdown live in [`specs/STATUS.md`](specs/STATUS.md).

| Suite                 | Cases | Cap | Areas                                                                   |
| --------------------- | ----- | --- | ----------------------------------------------------------------------- |
| Functional (`tests/`) | 20    | 20  | Authentication, product browsing, cart, checkout, engagement            |
| Visual (`vr-tests/`)  | 20    | 20  | Home, products, product detail, cart, authentication, contact, checkout |

Every spec begins with a `// spec:` header pointing at the plan that justifies it, so a failing case
leads back to the reasoning rather than to a stack trace alone.

## Visual Regression

Baselines are Chromium on Linux at 1920x1080. Screenshots differ between platforms, so a baseline
produced on Windows or macOS will never match a runner. Regenerate them in the image CI uses:

```bash
yarn docker:vr:update
```

Baselines written directly on a host are gitignored, and the visual job fails outright when none are
committed rather than writing its own and reporting success.

## CI/CD

```
   build                 check                  end2end

prepare-playwright  →  static-checks  →  e2e-playwright     ┐
      image                           →  visual-regression  ┴→  publish-dashboard
```

Runs on every push and pull request to `main`.

| Job                        | Responsibility                                                                |
| -------------------------- | ----------------------------------------------------------------------------- |
| `prepare-playwright-image` | Builds the execution image and pushes it to the GitHub Container Registry     |
| `static-checks`            | Typecheck, lint, format. Gates everything after it                            |
| `e2e-playwright`           | The functional suite                                                          |
| `visual-regression`        | The visual suite, separate so a screenshot diff never hides functional signal |
| `publish-dashboard`        | Merges both reports, restores trend history, deploys to GitHub Pages          |

Every job after the build runs inside the image the build produced, so browsers and dependencies are
installed once instead of three times. The image tag carries the Playwright version and a hash of
`package.json` plus `yarn.lock`, so a dependency change produces a new tag and no job can run against
an image whose `node_modules` no longer match the lockfile.

Traces, screenshots and visual diffs upload as artifacts on failure.

## The Published Report

Playwright project names match the CI job names, so a merged report labels every result
`e2e-playwright` or `visual-regression` instead of leaving forty rows to be told apart by path.

Allure results are labelled by an automatic fixture rather than by hand, because a label applied
only where someone remembered is one the report cannot rely on. Each result carries:

| Label                      | Effect in the report                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `parentSuite`              | Splits the dashboard into Functional E2E and Visual regression under every status filter |
| `suite`                    | Breaks each of those down by area                                                        |
| `epic`, `feature`, `story` | Populates the Behaviours tab                                                             |
| `severity`                 | Critical only where a failure means a user cannot buy or cannot reach their account      |
| `link`                     | The plan that justifies the case, read from its own `// spec:` header, plus its source   |

Three reports are published rather than one. Allure plots status over time for whatever it was
given, so a combined report can only ever draw a single line for both suites. The functional and
visual reports each keep their own history, which is what makes one trend readable next to the
other.

`categories.json` classifies failures, since a screenshot diff, a host 5xx and a real assertion
failure are three different conversations. `environmentInfo` records the base URL, browser,
viewport, commit and branch behind a run. `executor.json` links the published report back to the
pipeline run that produced it.

## The Agent Workflow

`.claude/` holds six agents, three skills, two MCP server registrations and the slash commands that
connect them. They were used to build and audit this suite, not written as decoration.

Planner, generator and healer are generated rather than hand written. `npx playwright init-agents
--loop=claude` produces definitions matched to the installed Playwright version, carrying the exact
tool names and call protocol of its authoring MCP server. Each then gains a project rules section,
because the official definitions know nothing about this codebase: the generator's own example
writes `page.click(...)` directly, which this repository does not allow. Manager, companion and
reviewer are hand written, since the official set has no equivalent.

| Agent                       | Responsibility                                   | Source        |
| --------------------------- | ------------------------------------------------ | ------------- |
| `playwright-test-manager`   | Strategy, coverage gaps, the caps, quality gates | hand written  |
| `playwright-test-companion` | Full plan, implement, review, validate cycles    | hand written  |
| `playwright-test-planner`   | Live exploration, then a written plan            | `init-agents` |
| `playwright-test-generator` | One case at a time, from an existing plan        | `init-agents` |
| `playwright-test-reviewer`  | Read only convention audit                       | hand written  |
| `playwright-test-healer`    | Root cause diagnosis of failures                 | `init-agents` |

| Command             | Effect                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| `/coverage`         | The manager audits plans against implementations and proposes the next move |
| `/plan <area>`      | The planner explores the live site and writes a plan                        |
| `/implement <case>` | The generator implements exactly that case                                  |
| `/review [files]`   | The reviewer audits against the checklist                                   |
| `/heal <case>`      | The healer diagnoses before touching anything                               |
| `/cycle <area>`     | The companion runs the whole loop                                           |

Two MCP servers are registered in `.mcp.json`. `playwright-test`
(`npx playwright run-test-mcp-server`) is the authoring server the generated agents use. It reads
`playwright.config.ts`, so an agent inherits the base URL, the `data-qa` test id attribute and the
viewport instead of being told them twice, and it exposes generation tools that a general browser
server does not have. [`@playwright/mcp`](https://github.com/microsoft/playwright-mcp) stays
registered for exploration outside test authoring.

The skills are enforced rather than suggested. Four rules from
`.claude/skills/playwright-pageobject-testing/SKILL.md`, namely no hard waits, no skipped tests, no
forced clicks and every test must assert, are configured as ESLint errors scoped to spec files. A
violation fails `static-checks` before any test runs, because a standard that lives only in prose is
a standard that erodes.

## Decisions

The ones a reviewer would question, with the reasoning rather than only the outcome.

**No shared authenticated storage state.** The usual optimisation is to log in once and reuse the
session. That is right when login is an expensive OAuth redirect. Here it is a two field POST
against an account the suite has to create in the first place. Sharing one account would mean the
deletion test destroys the session every other test depends on, and parallel workers competing over
one identity. Isolation is worth more than the second it saves.

**Page objects are not fixtures.** Playwright's documentation shows a page object as one possible
fixture example, but its page object guide instantiates directly, and a fixture earns its place when
it owns setup and teardown rather than when it wraps an empty constructor. Specs construct what they
use. The account, which has a real lifecycle, stays a fixture.

**No custom screenshot runtime.** A wrapper enforcing named capture strategies pays for itself
across hundreds of visual tests. Across twenty it is indirection with nobody to pay for it. Native
`toHaveScreenshot()` with documented thresholds does the same work in less code.

**No baseline taller than the viewport.** Two captures originally targeted the element holding the
whole catalog, which measures 13,347 pixels. They failed intermittently under load, timing out on
the stability check rather than on any visual difference. Raising the timeout would have hidden the
more important half: nobody scans thirteen thousand pixels for the four that changed, so those cases
could only ever be rubber stamped. Both now anchor the section heading to the top of the viewport
and capture the viewport, at 412 KB instead of 2.8 MB.

**Two MCP servers, for two jobs.** Verifying that the second one actually starts caught a real error
in the first configuration: `--browser chromium` is not a valid value, so the server would have
failed on launch while the configuration looked plausible.

## What Broke While Building This

Kept because the failures are more informative than the passes.

| Symptom                                     | Actual cause                                                                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart empty after adding from the listing    | Adding is an XHR and navigating straight to the cart cancelled it. The page object now returns the confirmation modal, so callers have to wait for it                                                               |
| Review form filled the wrong field          | `getByPlaceholder` matches substrings, so "Email Address" also matched the footer's "Your email address"                                                                                                            |
| Five tests failing only under parallel load | The cart's controls are anchors without `href`, driven by the site's own JavaScript. A click landing before the handler binds is a silent no operation: Playwright reports success and the application does nothing |
| A visual case that could never pass         | The payment form ships Bootstrap 4 row markup against Bootstrap 3 CSS, so every row collapses to zero height. A defect in the application, recorded rather than worked around                                       |
| A visual case that asserted nothing         | The delivery address capture masked the element it was capturing. It would have passed against a blank block                                                                                                        |

## Findings Raised Against the Application

Product observations rather than test defects, listed in [`specs/STATUS.md`](specs/STATUS.md) with
how each one is covered or deliberately excluded.
