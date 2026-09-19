# Test Status Report

Progress of testing activities against the baseline: the plans in `specs/test-plans/` and
`specs/vr-test-plans/`, and the suites in `tests/` and `vr-tests/`.

Updated: 2026-09-10 · Source of truth for results:
[the published dashboard](https://ella79.github.io/agentic-playwright-suite/)

## Functional Coverage

| #   | Feature Plan                                                            | Functional Test                                                            | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | [`authentication-test-plan.md`](test-plans/authentication-test-plan.md) | [`authentication.spec.ts`](../tests/authentication/authentication.spec.ts) | 6          | 6           | 6      | 0      | 0     | 0       | 0     |
| 2   | [`products-test-plan.md`](test-plans/products-test-plan.md)             | [`products.spec.ts`](../tests/products/products.spec.ts)                   | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 3   | [`cart-test-plan.md`](test-plans/cart-test-plan.md)                     | [`cart.spec.ts`](../tests/cart/cart.spec.ts)                               | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 4   | [`checkout-test-plan.md`](test-plans/checkout-test-plan.md)             | [`checkout.spec.ts`](../tests/checkout/checkout.spec.ts)                   | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 5   | [`contact-test-plan.md`](test-plans/contact-test-plan.md)               | [`contact.spec.ts`](../tests/contact/contact.spec.ts)                      | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 6   | [`product-detail-test-plan.md`](test-plans/product-detail-test-plan.md) | [`product-detail.spec.ts`](../tests/product-detail/product-detail.spec.ts) | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 7   | [`home-test-plan.md`](test-plans/home-test-plan.md)                     | [`home.spec.ts`](../tests/home/home.spec.ts)                               | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
|     | **Total**                                                               |                                                                            | **20**     | **20**      | **20** | **0**  | **0** | **0**   | **0** |

## Visual Regression Coverage

| #   | Feature Plan                                                                     | Visual Test                                                          | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | [`home-vr-test-plan.md`](vr-test-plans/home-vr-test-plan.md)                     | [`home.vr.spec.ts`](../vr-tests/home.vr.spec.ts)                     | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 2   | [`products-vr-test-plan.md`](vr-test-plans/products-vr-test-plan.md)             | [`products.vr.spec.ts`](../vr-tests/products.vr.spec.ts)             | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 3   | [`product-detail-vr-test-plan.md`](vr-test-plans/product-detail-vr-test-plan.md) | [`product-detail.vr.spec.ts`](../vr-tests/product-detail.vr.spec.ts) | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 4   | [`cart-vr-test-plan.md`](vr-test-plans/cart-vr-test-plan.md)                     | [`cart.vr.spec.ts`](../vr-tests/cart.vr.spec.ts)                     | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 5   | [`authentication-vr-test-plan.md`](vr-test-plans/authentication-vr-test-plan.md) | [`authentication.vr.spec.ts`](../vr-tests/authentication.vr.spec.ts) | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 6   | [`contact-vr-test-plan.md`](vr-test-plans/contact-vr-test-plan.md)               | [`contact.vr.spec.ts`](../vr-tests/contact.vr.spec.ts)               | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 7   | [`checkout-vr-test-plan.md`](vr-test-plans/checkout-vr-test-plan.md)             | [`checkout.vr.spec.ts`](../vr-tests/checkout.vr.spec.ts)             | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
|     | **Total**                                                                        |                                                                      | **20**     | **20**      | **20** | **0**  | **0** | **0**   | **0** |

## Open Questions

None outstanding.

## Decisions Needed

- [ ] Whether to extend coverage to the public API the application exposes, as a separate suite with
      its own cap, or to keep this repository UI-only.
- [ ] Whether a second viewport justifies doubling the baseline count, given every baseline needs a
      human to review its diff.
