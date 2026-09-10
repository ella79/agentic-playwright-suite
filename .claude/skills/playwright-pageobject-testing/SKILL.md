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

## Before writing anything

Confirm these, or ask. Guessing one of them is what produces a case that has to be rewritten:

1. The user flow and what counts as success
2. The entry point: which page object already reaches it, or whether a new one is needed
3. The data the case needs, and whether the `uniqueAccount` fixture covers it
4. Which assertion is the business-critical one, as opposed to a sync check
5. Whether this is coverage or a correction, because the suite is capped at twenty per suite

Defaults, not worth asking about: Chromium at 1920x1080, base URL from `playwright.config.ts`,
per-test account through the fixture.

## Working order

Plan, then page object, then spec. A spec cannot be written against locators that do not exist yet,
and a page object written after the spec ends up shaped by the spec instead of by the page.

1. **Read the plan.** The case ID, its scenario, its expectation. If there is no plan, there is no
   case to write.
2. **Decide the boundary.** One page object per URL-addressable page, one component object per
   modal. Shared chrome belongs in the base, not copied.
3. **Design the method, not the click.** Task-oriented names, awaiting the state transition the user
   would wait for. Return a value only when the spec asserts on it.
4. **Add the locator.** `readonly`, assigned in the constructor, semantic first, a CSS fallback only
   with an inline reason.
5. **Register the fixture.** A page object without a fixture in `testFixtures.ts` cannot reach a
   spec.
6. **Write the case.** Arrange, act, assert. The headers, the fixtures in the signature, the title
   in the user's language.
7. **Validate.** `yarn stylefix && yarn typecheck && yarn lint`, then the single case, then the
   suite. A case that only passes on the second attempt is a failing case.

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

## Artefacts

One stem names every artefact a feature owns. Each suite owns its plan and its spec; everything
under `utils/` is shared by both.

| Artefact         | Owner            | Path                                         | Shape                                                                |
| ---------------- | ---------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| Functional plan  | Functional suite | `specs/test-plans/<area>-test-plan.md`       | [references/test-plan-template.md](references/test-plan-template.md) |
| Functional spec  | Functional suite | `tests/<area>/<name>.spec.ts`                | Below, under Spec Structure                                          |
| Visual plan      | Visual suite     | `specs/vr-test-plans/<area>-vr-test-plan.md` | The visual skill                                                     |
| Visual spec      | Visual suite     | `vr-tests/<area>.vr.spec.ts`                 | The visual skill                                                     |
| Baselines        | Visual suite     | Next to the visual spec                      | Chromium on Linux                                                    |
| Page object      | **Both**         | `utils/pageObjects/<area>/<name>Page.ts`     | Above, under Page Object Structure                                   |
| Component object | **Both**         | `utils/pageObjects/shared/<name>Modal.ts`    | Root-scoped, `BaseComponentPage`                                     |
| Fixture          | **Both**         | `utils/fixtures/testFixtures.ts`             | One per page object                                                  |
| Status           | Both             | `specs/STATUS.md`                            | Counts, findings, open decisions                                     |

The file is camelCase, the class PascalCase with the same stem: `cartPage.ts` exports `CartPage`. A
modal one area uses may live in that area's folder; `shared/` is for the ones two areas reach.

A page object grows from either side: a locator only a capture needs belongs here exactly like the
rest. This file is the only place their standard lives; the visual skill covers what is specific to
a screenshot.

One chain has to hold, because the published dashboard reads it: the plan ID becomes the test title,
the spec carries the `// spec:` header pointing at that plan, `STATUS.md` counts the case, and a
visual case matches its baseline name. Break a link and a result stops tracing back to its plan.

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
- Separate `test()` blocks for different scenarios or different page states. `test.step` for several
  properties of the **same** scenario on the same page. Do not split read-only checks of one page
  into many tests that each re-run `beforeEach` and reload it.
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

**Cleanup belongs to the fixture, never to a trailing step.** A `test.step` at the end of a case
that removes what the case created does not run when an earlier step fails: Playwright skips the
rest, and the data stays behind. The fixture's teardown runs either way.

## Decision points

- **Page object exists?** Extend it with a cohesive method. Otherwise create one in the area folder
  and register its fixture in the same change.
- **Behaviour shared across pages?** `BaseAppPage` for chrome and navigation, `BaseComponentPage`
  for anything root-scoped. Otherwise keep it local.
- **Where does the assertion go?** The business outcome in the spec. A sync check that a method
  needs before it returns may live in the page object.
- **Coverage or correction?** Coverage against a full cap is a swap decision, and that belongs to
  the manager.

## Assertions

- Web-first matchers only: `toBeVisible`, `toHaveText`, `toHaveURL`, `toHaveCount`. They retry.
- Assert observable outcomes, not implementation. `await expect(page).toHaveURL(url.checkout)` is a
  real assertion; checking that a click handler ran is not.
- One scenario, one reason to fail. If a test needs five unrelated assertions it is two tests.

## Nothing exists twice

Duplication is checked at every level, and the test is always the same: does this cover ground that
is already covered, or does it merely look similar?

| Level   | A defect                                                       | Not a defect                                                                               |
| ------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Case    | Two cases exercising the same interaction on different data    | The same flow asserted at a different state, such as empty against populated               |
| Plan    | Two plans covering one area, or an area split without a reason | One functional plan and one visual plan for the same area: they answer different questions |
| Spec    | Two spec files for one area of one suite                       | `cart.spec.ts` and `cart.vr.spec.ts`, which belong to different suites                     |
| Class   | Two page objects for the same page                             | Two page objects for two pages that happen to share markup                                 |
| Method  | Two methods reaching the same state by the same route          | An overload that takes different input to reach a different state                          |
| Locator | The same element exposed twice under two names in one class    | The same selector in two classes, when the markup genuinely appears on two pages           |

The last row is the one that is misread most often. `#cart_info tbody tr` is modelled by both the
cart page and the checkout page, because the application renders that table on both; merging them
would couple two pages that are free to diverge.

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
[references/playwright-best-practices.md](references/playwright-best-practices.md) maps each piece of
that guidance onto this repository and states where it departs, which the vendor pages cannot.

- [Best practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Fixtures](https://playwright.dev/docs/test-fixtures), the shape this repository's page objects follow
- [Page object model](https://playwright.dev/docs/pom)
