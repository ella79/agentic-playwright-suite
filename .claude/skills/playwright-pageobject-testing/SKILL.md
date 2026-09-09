---
name: playwright-pageobject-testing
description: Coding standard for tests and page objects in this repository, locator priority, page object structure, fixtures, assertions, and the anti-patterns that get a change rejected. Use before writing or reviewing any test code.
paths:
  - tests/**
  - vr-tests/**
  - utils/**
  - specs/test-plans/**
---

# Page Object Testing Skill

## Outcome

Tests that read like the user's intent, break only when the product breaks, and can be changed by
someone who has never opened this repo before.

## Locator Priority

1. `getByRole(role, { name })`: the default. Matches what a user and a screen reader see.
2. `getByLabel`: form controls with a real label.
3. `getByPlaceholder`: form controls with only a placeholder (common in this app).
4. `getByText`: non-interactive content, and elements the app renders as `<a>` without `href`
   (those have no link role, so `getByRole("link")` will not find them).
5. `getByTestId`: the `data-qa` attribute, mapped via `testIdAttribute` in the config. Automation
   Exercise ships `data-qa` on most form controls, so this is a first-class option here, not a
   fallback.
6. CSS as a last resort, and only with an inline comment explaining why nothing above works.

```typescript
// No accessible name: icon-only control with no aria-label
readonly removeItemButton: Locator = row.locator(".cart_quantity_delete");
```

## Page Object Structure

Two bases:

- **`BaseAppPage`**: a URL-addressable page. Owns navigation (`goto…Page()`) and shared chrome
  (header, consent banner).
- **`BaseComponentPage`**: a modal or dialog. Scoped to a `root` locator; every child locator is
  resolved inside that root so two open dialogs can never cross-match.

```typescript
export class CartPage extends BaseAppPage {
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
  }

  async gotoCartPage(): Promise<void> {
    await this.goto(url.cart);
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
```

Rules:

- Locators are `readonly` properties assigned in the constructor. Never inline a locator in a spec.
- Method names describe the user's task (`addToCart`), not the mechanics (`clickAddButton`).
- A method that navigates to another page returns that page object; a method that opens a modal
  returns the modal's component object.
- Export every class from `utils/pageObjects/index.ts`, and register it as a fixture in
  `utils/fixtures/testFixtures.ts`.

## Artefacts and traceability

| Artefact             | Shape                                                                |
| -------------------- | -------------------------------------------------------------------- |
| Functional test plan | [references/test-plan-template.md](references/test-plan-template.md) |
| Spec file            | Below, under Spec Structure                                          |
| Page object          | Above, under Page Object Structure                                   |
| `specs/STATUS.md`    | Existing tables only: counts, findings, open decisions               |

Page objects are shared by both suites, so this file is the only place their standard lives. The
visual skill covers what is specific to a screenshot.

One chain has to hold, because the published dashboard reads it: the plan ID becomes the test title,
the test file carries the `// spec:` header pointing at that plan, `STATUS.md` counts the case, and
for a visual case the baseline name matches the plan's screenshot column. Break a link and a result
stops tracing back to the plan that justifies it.

## Spec Structure

```typescript
// spec: specs/test-plans/cart-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";

test.describe("Cart", () => {
  test("TC-05: adding a product from the detail page puts it in the cart", async ({
    productDetailPage,
    cartPage,
  }) => {
    // ...
  });
});
```

- The `// spec:` header is mandatory. It is how coverage is traced back to a plan.
- The `// seed:` header names the seed spec the environment is bootstrapped from,
  `specs/seed.spec.ts`. Both headers are the format Playwright's own generator agent emits.
- Page objects arrive as fixtures, named in the test signature. Never `new SomePage(page)` in a
  spec, and never a `let po` assigned in `beforeEach`: the first repeats construction in every
  test, the second shares mutable state across them. Playwright's fixtures documentation is
  explicit that fixtures replace both.
- A `beforeEach` is for navigation shared by every case in the file, and it takes the page object
  as a fixture too.
- `test.describe` groups related scenarios. `test.step` marks distinct phases **within one
  scenario**, not every action. A step is worth adding when a failure would otherwise leave the
  reader guessing which phase broke, typically an arrange phase followed by the behaviour under
  test. A scenario that is one action and its verification takes no steps: the step title would
  only repeat the test title in the report.
- Test titles state the behaviour being verified, in the user's language. `TC-05: cart shows the
added product`, not `TC-05: test cart`.

## Fixtures

Everything a test needs arrives through `utils/fixtures/testFixtures.ts`.

| Fixture                              | Provides                                                       |
| ------------------------------------ | -------------------------------------------------------------- |
| `homePage`, `cartPage`, and the rest | One page object per surface, built for the tests that name it  |
| `uniqueAccount`                      | A throwaway registered account, deleted afterwards             |
| `page`                               | Playwright's page with ad, analytics and consent hosts aborted |

A new page object gets a fixture in the same commit that adds the class. Fixtures are on demand, so
an unused one costs nothing.

Tests needing a logged-in user take the `uniqueAccount` fixture. It signs up a throwaway account
before the test and deletes it afterwards, so no test depends on data another test left behind and
parallel workers never contend for one account.

A test that deletes its own account sets `account.deleted = true` so teardown does not try again.

## Assertions

- Web-first matchers only: `toBeVisible`, `toHaveText`, `toHaveURL`, `toHaveCount`. They retry.
- Assert observable outcomes, not implementation. `await expect(page).toHaveURL(url.checkout)` is a
  real assertion; checking that a click handler ran is not.
- One scenario, one reason to fail. If a test needs five unrelated assertions it is two tests.

## Anti-Patterns

| Anti-pattern                       | Why it is rejected                                                          |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `waitForTimeout`                   | Arbitrary, too short under CI load, too slow otherwise. Wait on a condition |
| Inline locator in a spec           | The next locator change then has to be made in N places                     |
| `test.skip()` for a known bug      | Hides intent. `test.fixme()` says "this should pass and does not"           |
| `nth(0)` to resolve ambiguity      | Couples the test to DOM order. Scope to a container instead                 |
| `new SomePage(page)` in a spec     | The page object is a fixture. Name it in the signature instead              |
| `let po` assigned in `beforeEach`  | Mutable state shared across tests, and no teardown. Use the fixture         |
| Asserting on ad or consent content | Third-party, changes without notice, not our product                        |
| A test that only passes on retry   | That is a failing test with extra steps                                     |

## Vendor documentation

Read the source rather than repeating it here when a rule needs its rationale.

- [Best practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Fixtures](https://playwright.dev/docs/test-fixtures), the shape this repository's page objects follow
- [Page object model](https://playwright.dev/docs/pom)
