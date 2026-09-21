# Test Status Report

Progress of testing activities against the baseline: the plans in `specs/test-plans/`,
`specs/api-test-plans/` and `specs/vr-test-plans/`, and the suites in `tests/`, `api-tests/` and
`vr-tests/`.

Browsers: Chromium and WebKit for functional, Chromium only for visual regression; the API suite
runs without a browser.

Updated: 2026-09-21 · Source of truth for results:
[the published dashboard](https://ella79.github.io/agentic-playwright-suite/)

## Functional Coverage

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

TC-01, TC-04, TC-10, TC-11, TC-13 and TC-14 in the functional suite cross-validate against the API;
every case below is API-only, with no UI equivalent.

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

## Open Questions

- Whether a second viewport justifies doubling the baseline count, given every baseline needs a human
  to review its diff.

## Decisions Needed

None open right now.
