# Architecture

## Prerequisites

- Node.js 20 or later
- Yarn 4, provided by Corepack: `package.json` pins it in `packageManager`, so `corepack enable` is
  all a machine needs. `yarn.lock` is the only lockfile and CI installs with `yarn install --immutable`, which fails outright
  if the lockfile is missing or out of step with `package.json`. Installing with another package
  manager would add a second lockfile and an install CI cannot reproduce.
- Docker Desktop, only if you intend to work on visual regression

## Commands

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

## The Standards Behind This

The conventions below are not only prose. Three skills in `.claude/skills/` hold them, agents read
them before writing anything, and four of the rules are ESLint errors so a violation fails the
pipeline rather than waiting for a reviewer to notice.

| Skill                                                                                       | Holds                                                                                                                                                      |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`playwright-pageobject-testing`](../.claude/skills/playwright-pageobject-testing/SKILL.md) | The coding standard: locator priority, page object structure, fixtures, assertions, and the anti-patterns that get a change rejected                       |
| [`playwright-visual-regression`](../.claude/skills/playwright-visual-regression/SKILL.md)   | What to capture and what not to, state preparation before a screenshot, threshold selection, and the rule that no baseline may be taller than the viewport |
| [`playwright-mcp`](../.claude/skills/playwright-mcp/SKILL.md)                               | How agents drive the live application, which MCP server to use for which job, and the traps this particular site sets                                      |

## Design

**Two page object bases.** `BaseAppPage` owns navigation and the shared chrome. `BaseComponentPage`
takes a root locator and resolves every child inside it, so two modals sharing a label can never
cross match. Every locator is a `readonly` property and no spec reaches the DOM directly.

**Semantic locators, with the exceptions documented.** Priority runs `getByRole`, `getByLabel`,
`getByPlaceholder`, `getByText`, `getByTestId`. The application ships `data-qa` attributes and
`testIdAttribute` maps onto them, so a test id here is a semantic option rather than an escape
hatch. Where a control genuinely has no accessible name, such as an icon only button, the CSS
fallback carries an inline comment saying why.

**Everything a test needs arrives as a fixture.** Page objects included: a spec names the surfaces
it touches in its signature, `async ({ cartPage, productDetailPage })`, and Playwright builds only
those. This is the shape Playwright's own fixtures documentation recommends, and it rules out both
alternatives seen in the wild: constructing page objects in every test, which repeats the same four
lines everywhere, and a `let` at describe level assigned in `beforeEach`, which shares mutable state
between tests and has no teardown.

The account is the fixture that carries real lifecycle: it registers a throwaway user, yields it,
and removes it afterwards while asserting the removal actually happened. No shared account, no
shared storage state, nothing for parallel workers to contend over.

**Two headers on every spec.** `// spec:` points at the plan the cases come from, which is how the
dashboard links a result back to its justification. `// seed:` names the seed spec the environment
is bootstrapped from. Both are the header format Playwright's own generator agent emits, so a
generated file and a hand-written one are indistinguishable.

**Third party noise is blocked rather than tolerated.** Advertising, analytics and consent
management hosts are aborted at the route level. None of it is the product under test, and all of it
injects layout shifts that would make visual comparison meaningless.

## Visual Regression

Baselines are Chromium on Linux at 1920x1080. Screenshots differ between platforms, so a baseline
produced on Windows or macOS will never match a runner. Regenerate them in the image CI uses:

```bash
yarn docker:vr:update
```

Baselines written directly on a host are gitignored, and the visual job fails outright when none are
committed rather than writing its own and reporting success.

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
