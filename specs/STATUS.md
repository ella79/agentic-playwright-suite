# Test Status Report

Progress of testing activities against the baseline: the plans in `specs/test-plans/`,
`specs/api-test-plans/` and `specs/vr-test-plans/`, and the suites in `tests/`, `api-tests/` and
`vr-tests/`.

Updated: 2026-09-21 · Source of truth for results:
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
`GET /api/brandsList`, and TC-04 checks a category's and a brand's filtered result count the same
way, against `GET /api/productsList` twice; `signup.spec.ts` TC-11 and `login.spec.ts` TC-10 confirm
an account the UI created or deleted against `GET /api/getUserDetailByEmail`. Together the two plans
below cover every one of the 14 scenarios documented at `/api_list`, plus additional edge cases
beyond that list.

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

## Open Questions

- Whether a second viewport justifies doubling the baseline count, given every baseline needs a human
  to review its diff.

## Decisions Needed

None open right now.
