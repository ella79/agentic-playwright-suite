# Test Status Report

Progress of testing activities against the baseline: the plans in `specs/test-plans/`,
`specs/api-test-plans/` and `specs/vr-test-plans/`, and the suites in `tests/`, `api-tests/` and
`vr-tests/`.

Updated: 2026-09-20 · Source of truth for results:
[the published dashboard](https://ella79.github.io/agentic-playwright-suite/)

## Functional Coverage

Every plan was rewritten from scratch against a fresh manual walkthrough of the application: a
shared, persistent account signs in once via `utils/setup/login.setup.ts`, and every case defaults to
that signed-in state (`Login`) except the two areas that specifically prove the signed-in/guest
boundary itself (`Guest`, for the whole file). Contact was removed from the suite entirely —
functional and visual — rather than carried forward, in both cases as a rewrite from scratch rather
than a renumbering: the functional suite's TC-18 and the visual suite's whole ID range were reused
outright, with nothing of Contact's left to note. `cart-test-plan.md`'s own two cases were later
compacted into one continuous flow (empty cart → home breadcrumb → two products added with the
notification and Continue Shopping/View Cart sequence → one removed), matching the manual walkthrough
this suite is built from; its ID is reused rather than left as a second gap. The plan is named
`cart-test-plan.md`, not `view-cart`, matching the header nav's own label for the page ("Cart") rather
than its route (`/view_cart`). Counts below are from a local run against Chromium; CI runs the same
suite against the `E2E_LOGIN_EMAIL`/`E2E_LOGIN_PASSWORD` repository secrets.

| #   | Feature Plan                                                            | Functional Test                                                            | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | [`home-test-plan.md`](test-plans/home-test-plan.md)                     | [`home.spec.ts`](../tests/home/home.spec.ts)                               | 6          | 6           | 6      | 0      | 0     | 0       | 0     |
| 2   | [`login-test-plan.md`](test-plans/login-test-plan.md)                   | [`login.spec.ts`](../tests/login/login.spec.ts)                            | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 3   | [`signup-test-plan.md`](test-plans/signup-test-plan.md)                 | [`signup.spec.ts`](../tests/signup/signup.spec.ts)                         | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 4   | [`products-test-plan.md`](test-plans/products-test-plan.md)             | [`products.spec.ts`](../tests/products/products.spec.ts)                   | 3          | 3           | 3      | 0      | 0     | 0       | 0     |
| 5   | [`product-detail-test-plan.md`](test-plans/product-detail-test-plan.md) | [`product-detail.spec.ts`](../tests/product-detail/product-detail.spec.ts) | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 6   | [`cart-test-plan.md`](test-plans/cart-test-plan.md)                     | [`cart.spec.ts`](../tests/cart/cart.spec.ts)                               | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 7   | [`checkout-test-plan.md`](test-plans/checkout-test-plan.md)             | [`checkout.spec.ts`](../tests/checkout/checkout.spec.ts)                   | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 8   | [`payment-test-plan.md`](test-plans/payment-test-plan.md)               | [`payment.spec.ts`](../tests/payment/payment.spec.ts)                      | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 9   | [`confirmation-test-plan.md`](test-plans/confirmation-test-plan.md)     | [`confirmation.spec.ts`](../tests/confirmation/confirmation.spec.ts)       | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
|     | **Total**                                                               |                                                                            | **22**     | **22**      | **22** | **0**  | **0** | **0**   | **0** |

## API Coverage

Two kinds of case live here, per plan: pure endpoint contract tests with no UI equivalent, and
cross-validation asserted from inside a UI case rather than as a row of its own —
`products.spec.ts` TC-13 and TC-14 check the rendered grid against `GET /api/productsList` and
`POST /api/searchProduct`; `home.spec.ts` TC-01 checks the brands sidebar against
`GET /api/brandsList`; `signup.spec.ts` TC-11 and `login.spec.ts` TC-10 confirm an account the UI
created or deleted against `GET /api/getUserDetailByEmail`. Together the two plans below cover every
one of the 14 scenarios documented at `/api_list`, plus additional edge cases beyond that list.

| #   | Feature Plan                                                          | API Test                                                  | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | --------------------------------------------------------------------- | --------------------------------------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | [`account-api-test-plan.md`](api-test-plans/account-api-test-plan.md) | [`account.api.spec.ts`](../api-tests/account.api.spec.ts) | 12         | 12          | 12     | 0      | 0     | 0       | 0     |
| 2   | [`catalog-api-test-plan.md`](api-test-plans/catalog-api-test-plan.md) | [`catalog.api.spec.ts`](../api-tests/catalog.api.spec.ts) | 7          | 7           | 7      | 0      | 0     | 0       | 0     |
|     | **Total**                                                             |                                                           | **19**     | **19**      | **19** | **0**  | **0** | **0**   | **0** |

## Visual Regression Coverage

| #   | Feature Plan                                                                     | Visual Test                                                          | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | [`home-vr-test-plan.md`](vr-test-plans/home-vr-test-plan.md)                     | [`home.vr.spec.ts`](../vr-tests/home.vr.spec.ts)                     | 10         | 10          | 10     | 0      | 0     | 0       | 0     |
| 2   | [`login-vr-test-plan.md`](vr-test-plans/login-vr-test-plan.md)                   | [`login.vr.spec.ts`](../vr-tests/login.vr.spec.ts)                   | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 3   | [`signup-vr-test-plan.md`](vr-test-plans/signup-vr-test-plan.md)                 | [`signup.vr.spec.ts`](../vr-tests/signup.vr.spec.ts)                 | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 4   | [`products-vr-test-plan.md`](vr-test-plans/products-vr-test-plan.md)             | [`products.vr.spec.ts`](../vr-tests/products.vr.spec.ts)             | 3          | 3           | 3      | 0      | 0     | 0       | 0     |
| 5   | [`product-detail-vr-test-plan.md`](vr-test-plans/product-detail-vr-test-plan.md) | [`product-detail.vr.spec.ts`](../vr-tests/product-detail.vr.spec.ts) | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 6   | [`cart-vr-test-plan.md`](vr-test-plans/cart-vr-test-plan.md)                     | [`cart.vr.spec.ts`](../vr-tests/cart.vr.spec.ts)                     | 3          | 3           | 3      | 0      | 0     | 0       | 0     |
| 7   | [`checkout-vr-test-plan.md`](vr-test-plans/checkout-vr-test-plan.md)             | [`checkout.vr.spec.ts`](../vr-tests/checkout.vr.spec.ts)             | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 8   | [`payment-vr-test-plan.md`](vr-test-plans/payment-vr-test-plan.md)               | [`payment.vr.spec.ts`](../vr-tests/payment.vr.spec.ts)               | 3          | 3           | 3      | 0      | 0     | 0       | 0     |
| 9   | [`confirmation-vr-test-plan.md`](vr-test-plans/confirmation-vr-test-plan.md)     | [`confirmation.vr.spec.ts`](../vr-tests/confirmation.vr.spec.ts)     | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
|     | **Total**                                                                        |                                                                      | **33**     | **33**      | **33** | **0**  | **0** | **0**   | **0** |

Rewritten from scratch alongside the functional suite, matching its nine areas (`home` through
`confirmation`) rather than the earlier `authentication`/`checkout`/`cart` split; nothing was carried
forward or renumbered from that structure, including Contact's retired IDs. Every case defaults to
the same shared, signed-in account as the functional suite; `login.vr.spec.ts` and
`signup.vr.spec.ts` opt out with a guest `storageState`. Baselines are Chromium on Linux at
1920x1080, generated and verified via `yarn docker:vr:update`; counts above are from that run.

## Known Flakes

- An intermittent `<div class="fc-dialog-overlay">` (Google Funding Choices' consent dialog)
  occasionally intercepts a click on a real element — seen live on `productDetailPage.addToCart()`,
  in both `tests/cart/cart.spec.ts` TC-19 and `vr-tests/cart.vr.spec.ts` VR-27, roughly 1 run in 10.
  Three mitigations were tried and verified, in order, none of which changed the failure rate:
  1. A stylesheet setting `pointer-events: none` on the overlay's classes — no effect, since the
     element is (sometimes) hosted in an open shadow root a light-DOM stylesheet cannot reach.
  2. Removing the elements on sight via a shadow-piercing `MutationObserver` (patches
     `Element.prototype.attachShadow` to watch every shadow root as it is created). Verified working
     against a real, fully-rendered reproduction of the dialog outside the suite — the observer
     removed it and the click succeeded — but the failure still recurred inside full suite runs,
     locally and in the Docker/Linux image CI uses.
  3. Replacing the third-party host **blocklist** with an **allowlist** (`ALLOWED_HOSTS` in
     `testFixtures.ts`: the product's own origin plus the two Google Fonts hosts it needs, everything
     else aborted). This closes the gap a blocklist cannot: the dialog root has been captured
     appearing without `fundingchoicesmessages.google.com` ever being requested, so no blocklist
     entry, however precise, could have caught that case. Still, the same failure recurred (4 in 37
     in one stress run) even under the allowlist, meaning the element is not always arriving over the
     network this fixture can see — plausibly a browser-level cache or resource the test's own
     network layer cannot observe.
     The shadow-piercing observer and the allowlist both stayed, since each is a correct improvement on
     its own terms and neither regressed anything, but neither is a confirmed fix for this specific
     flake. `retries` in `playwright.config.ts` went from 1 to 2 in CI as a practical mitigation while
     the actual mechanism remains unidentified.

## Open Questions

- Whether a second viewport justifies doubling the baseline count, given every baseline needs a human
  to review its diff.

## Recently Resolved

- The API suite now joins the Allure dashboard as a third report category, with its own `api/` trend
  and a suite-health row, alongside Functional and Visual. `allureLabels.ts` previously left the `api`
  project unmapped, so its results were silently mislabelled as Functional E2E; fixed alongside the
  dashboard wiring.
- `confirmation.spec.ts` TC-22 failed on `e2e-webkit` in CI three runs running, every time at the same
  step: `page.waitForEvent("download")` on the invoice link. Reproduced directly rather than assumed:
  a Windows run passed every time, and the same Linux image CI uses (`docker compose run --rm e2e`)
  failed every time, on the identical timeout. WebKit's Linux (GTK) port does not fire Playwright's
  native `download` event for this link; Chromium and Windows WebKit are unaffected. This is a
  platform limitation, not a flake, so the download-verification step alone is skipped on
  `e2e-webkit` via a `testInfo.project.name` check and an annotation, not `test.skip()` (forbidden by
  `playwright/no-skipped-test`, and it would also drop the unrelated Continue-button check in the same
  test). The Continue-button assertion still runs and still passes on WebKit.
- `CRITICAL_AREAS` in `allureLabels.ts` checked for `"Checkout"`, `"Authentication"` and `"Cart"`, but
  `area` is always the describe title verbatim (`"Checkout Page"`, `"Cart Page"`, ...), and
  `"Authentication"` split into `"Login Page"`/`"Signup Page"` a while back. None of the three ever
  matched, so no functional case has carried `Severity.CRITICAL` since. Fixed to the current names.

## Decisions Needed

None open right now: `E2E_LOGIN_EMAIL` and `E2E_LOGIN_PASSWORD` are set as GitHub Actions repository
secrets, so `e2e`, `visual-regression` and the dashboard can all run in CI.
