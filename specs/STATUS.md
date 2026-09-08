# Status

## Current Coverage

| Suite | Cases | Cap | State |
|---|---|---|---|
| Functional E2E (`tests/`) | 20 | 20 | Implemented, passing |
| Visual regression (`vr-tests/`) | 20 | 20 | Implemented; Linux baselines generated in CI |

| Area | Plan | Cases |
|---|---|---|
| Authentication | `specs/test-plans/authentication-test-plan.md` | TC-01 to TC-06 |
| Product browsing | `specs/test-plans/product-browsing-test-plan.md` | TC-07 to TC-11 |
| Cart | `specs/test-plans/cart-test-plan.md` | TC-12 to TC-16 |
| Checkout | `specs/test-plans/checkout-test-plan.md` | TC-17 |
| Engagement | `specs/test-plans/engagement-test-plan.md` | TC-18 to TC-20 |
| Visual regression | `specs/vr-test-plans/visual-regression-test-plan.md` | VR-01 to VR-20 |

## Findings Raised Against the Application

Recorded because they are product observations, not test defects:

1. Search matches category names as well as product names, so a term like "top" returns items
   whose name does not contain it.
2. The payment form ships Bootstrap 4 row markup against Bootstrap 3 CSS. Every `.form-row` and
   the `<form>` itself collapse to zero height; the page only looks correct because the parent
   grid column is floated.
3. The contact page renders the same success text twice, once for the form and once for a hidden
   newsletter widget.
4. `/delete_account` deletes on GET, with no confirmation step.

## Open Questions

- None.

## Next Steps

1. Extend coverage to the API endpoints the application exposes, as a separate suite.
2. Add a second viewport to the visual suite once the baseline count justifies the review cost.
