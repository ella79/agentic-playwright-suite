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
| `yarn test:api`                     | Run the API suite                                       |
| `yarn test:seed`                    | Run the environment seed the agents generate tests from |
| `yarn test:e2e:report`              | Open the last HTML report                               |
| `yarn typecheck`                    | TypeScript, no emit                                     |
| `yarn lint` / `yarn lint:fix`       | ESLint                                                  |
| `yarn stylecheck` / `yarn stylefix` | Prettier                                                |

## Environment Variables

`E2E_LOGIN_EMAIL` and `E2E_LOGIN_PASSWORD` are required for the functional and visual suites: the
`setup` project signs that account into the application once per run, and every functional and
visual project depends on it. Locally, put them in a gitignored `.env` (copy `.env.example`);
`playwright.config.ts` loads it with Node's built-in `process.loadEnvFile()`. In CI they are GitHub
Actions secrets, never a value in a file. The API suite needs neither: every case there provisions
its own throwaway account directly against the API.

| Variable             | Effect                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------- |
| `E2E_LOGIN_EMAIL`    | Email of the shared account `utils/setup/login.setup.ts` signs in as                    |
| `E2E_LOGIN_PASSWORD` | Its password. Never logged, never traced: see the Design section below                  |
| `E2E_BASE_URL`       | Point the suite at a different host. Defaults to `https://automationexercise.com`       |
| `CI`                 | Set by the pipeline. Switches reporters to blob, enables one retry, caps workers at two |

The pipeline itself, including the merge queue `ci.yml` already supports but does not yet require, is
[`docs/pipeline.md`](pipeline.md).

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

**Three ways to be signed in, chosen by what the case actually proves.** `uniqueAccount` is the fixture
that carries real lifecycle: it creates a throwaway user through the API, signs it in through the
login form, yields it, and deletes it through the API afterwards, confirming the deletion. It exists
for the handful of cases that prove something about signup, login or account deletion themselves —
`login.spec.ts` and `signup.spec.ts`, in full — where a fresh, disposable account is the point.

Everything else defaults to a shared, persistent account instead: `utils/setup/login.setup.ts` runs
as its own project once per suite run, registers that account through the API if it does not already
exist (`POST /api/createAccount`, tolerant of "already exists"), signs in through the real login
form — the only way to get a session a browser can use, since the login API answers no `Set-Cookie`
at all — and saves the result as `storageState`. Every functional and visual project depends on it
and starts already signed in, so a case that only needs "some logged-in user" as a precondition never
pays for a signup it has no reason to prove. `login.spec.ts` and `signup.spec.ts` opt back out with
`test.use({ storageState: { cookies: [], origins: [] } })` at the top of the file; `home.spec.ts`'s
TC-02 and `cart.spec.ts`'s TC-19 open a second, anonymous `browser.newContext()` instead, since
those two compare a guest and a signed-in visitor within one case rather than running the whole case
as one or the other.

Every plan states which of the two its cases assume, in its Metadata table's `Precondition` row:
`Login` for the shared signed-in default, `Guest` for a plan (or a single case inside one) that opts
back out. A reader should never have to open the spec to find out which user a case runs as.

The setup project's own trace, video and screenshot are off. `fill()` records what it typed into a
trace's action log verbatim, uncensored by CI's own secret redaction, which only covers log output;
a credential written into a trace that this suite publishes would be public. Nothing about the login
step needs debugging from a trace anyway: it is one page, one form, and a failure there fails loudly
with its own error rather than a silent wrong turn a trace would be needed to diagnose.

**A case that changes the cart gets an account of its own.** The cart belongs to the account, so
through the shared account every case in `cart`, `checkout`, `payment` and `confirmation`, functional
and visual, shared one cart, and the parallel CI jobs emptied it under each other (decision #7). The
`page` fixture recognises those 8 spec files and, for each of their cases, creates an account through
the API, signs into it through the login form, and deletes it through the API afterwards, confirming
the deletion. The specs are unchanged: `cartPage.clearCart()` still runs first and now finds the cart
empty. Every other case stays on the shared account, and none of them reads the cart.

**API tests use their own throwaway accounts, never the shared one.** `api-tests/` calls the public
API directly through Playwright's `request` fixture, wrapped by a small client per resource area in
`utils/apiClients/`. Nothing there depends on `setup` or on a browser at all.

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
tests/                                 Functional specs, <feature>/<feature>.spec.ts
├── home/                              TC-01 to TC-06 · Login, except TC-02's guest half
├── login/                             TC-07 to TC-10 · Guest, whole file
├── signup/                            TC-11 to TC-12 · Guest, whole file
├── products/                          TC-13 to TC-15 · Login
├── product-detail/                    TC-16 to TC-17 · Login
├── cart/                              TC-18 to TC-19 · Login, except TC-19's guest half
├── checkout/                          TC-20 · Login
├── payment/                           TC-21 · Login
└── confirmation/                      TC-22 · Login

api-tests/                             API specs, <area>.api.spec.ts — no browser, no shared account
├── account.api.spec.ts                API-01 to API-08, API-16 to API-19
└── catalog.api.spec.ts                API-09 to API-15

vr-tests/                              Visual specs and their committed baselines
├── home.vr.spec.ts                    VR-01 to VR-10 · Login
├── login.vr.spec.ts                   VR-11 to VR-12 · Guest, whole file
├── signup.vr.spec.ts                  VR-13 to VR-17 · Guest, whole file
├── products.vr.spec.ts                VR-18 to VR-20 · Login
├── product-detail.vr.spec.ts          VR-21 to VR-24 · Login
├── cart.vr.spec.ts                    VR-25 to VR-27 · Login, except VR-27's guest half
├── checkout.vr.spec.ts                VR-28 to VR-29 · Login
├── payment.vr.spec.ts                 VR-30 to VR-32 · Login
├── confirmation.vr.spec.ts            VR-33 · Login
└── *.vr.spec.ts-snapshots/            Chromium on Linux, 1920x1080

specs/
├── STATUS.md                          Test status report: coverage, findings, open decisions
├── seed.spec.ts                       Environment seed the agents start generated tests from
├── test-plans/                        One plan per functional area
├── api-test-plans/                    One plan per API resource area
└── vr-test-plans/                     One plan per visual area, plus shared conventions

utils/
├── pageObjects/
│   ├── baseAppPage.ts                 Base for URL addressable pages
│   ├── baseComponentPage.ts           Base for modals, root scoped
│   ├── shared/                        Modals reached from more than one page
│   ├── authentication/ cart/ checkout/ home/ products/
│   └── index.ts                       Barrel export
├── apiClients/                        One client per API resource area, wraps `request`
├── setup/
│   └── login.setup.ts                 Signs the shared account in once; produces `.auth/user.json`
├── fixtures/
│   ├── testFixtures.ts                Page objects, account lifecycle, third party blocking
│   └── allureLabels.ts                Labels applied to every result
├── testData.ts                        Generated accounts, fixed products, card details
└── url.ts                             Route constants and patterns

.claude/                               Agents, skills, slash commands
env/docker/                            Execution images for CI and local use
.github/workflows/                     Pipeline definitions
```
