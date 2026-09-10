# Test Status Report

Progress of testing activities against the baseline: the plans in `specs/test-plans/` and
`specs/vr-test-plans/`, and the suites in `tests/` and `vr-tests/`.

Updated: 2026-09-10 · Source of truth for results:
[the published dashboard](https://ella79.github.io/agentic-playwright-suite/)

## Functional Coverage

| #   | Feature Plan                  | Functional Test          | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | ----------------------------- | ------------------------ | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | `authentication-test-plan.md` | `authentication.spec.ts` | 6          | 6           | 6      | 0      | 0     | 0       | 0     |
| 2   | `products-test-plan.md`       | `products.spec.ts`       | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 3   | `cart-test-plan.md`           | `cart.spec.ts`           | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 4   | `checkout-test-plan.md`       | `checkout.spec.ts`       | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 5   | `contact-test-plan.md`        | `contact.spec.ts`        | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 6   | `product-detail-test-plan.md` | `product-detail.spec.ts` | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 7   | `home-test-plan.md`           | `home.spec.ts`           | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
|     | **Total**                     |                          | **20**     | **20**      | **20** | **0**  | **0** | **0**   | **0** |

Cap: 20. Full. New coverage replaces an existing case rather than growing the suite.

The same twenty cases are replayed on WebKit on every merge and appear in the published report as a
second branch under Functional E2E. They passed on the first attempt with no change to any locator,
which is the argument for the locator policy: roles and labels do not depend on the engine.

## Visual Regression Coverage

| #   | Feature Plan                     | Visual Test                 | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | -------------------------------- | --------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | `home-vr-test-plan.md`           | `home.vr.spec.ts`           | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 2   | `products-vr-test-plan.md`       | `products.vr.spec.ts`       | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 3   | `product-detail-vr-test-plan.md` | `product-detail.vr.spec.ts` | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 4   | `cart-vr-test-plan.md`           | `cart.vr.spec.ts`           | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 5   | `authentication-vr-test-plan.md` | `authentication.vr.spec.ts` | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 6   | `contact-vr-test-plan.md`        | `contact.vr.spec.ts`        | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 7   | `checkout-vr-test-plan.md`       | `checkout.vr.spec.ts`       | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
|     | **Total**                        |                             | **20**     | **20**      | **20** | **0**  | **0** | **0**   | **0** |

VR-15 `authentication-signup-form` was retired and VR-21 `contact-success` took its slot, an
approved one-for-one swap that leaves the cap at 20. The retirement is argued in the authentication
plan; the retired baseline was deleted with the case. VR-21's baseline was generated in the CI Linux
image with `--update-snapshots=missing`, so the other nineteen were left untouched, and reviewed
before it was committed. The result columns above come from a subsequent `docker compose run --rm vr`
against the committed baselines: 20 passed.

VR-17 moved from the authentication feature to home: the site header is shared chrome and both of
its states now sit in one file and one baseline directory. The totals are unchanged and no case
changed behaviour. The renamed baseline is byte-identical to the one it replaced, and it was
compared under its new name in the Linux image on 2026-09-10: 20 passed.

Cap: 20. Full. Baselines are Chromium on Linux at 1920x1080, generated in the CI image
(`yarn docker:vr:update`); the visual job fails if none are committed rather than seeding its own.

## Findings Raised Against the Application

Product observations, not test defects. Each is covered or deliberately excluded, never worked
around silently.

1. Search matches category names as well as product names, so a term like "top" returns items whose
   name does not contain it. TC-08 asserts the behaviour that exists.
2. The payment form ships Bootstrap 4 row markup against Bootstrap 3 CSS. Every `.form-row` and the
   `<form>` itself collapse to zero height; the page only looks correct because the parent grid
   column is floated. VR-20 captures the container that has dimensions, with the cause recorded at
   the capture.
3. The contact page renders the same success text twice, once for the form and once for a hidden
   newsletter widget. **Resolved as a markup-only defect.** Both nodes were measured: the second
   sits in `col-md-9 hide form-group`, is 0 x 0 and never renders, so the duplication exists in the
   DOM and cannot reach a screen or a baseline. TC-18 scopes to the visible node; VR-21 captures the
   success state, which an earlier reading of this finding had wrongly excluded.
4. `/delete_account` deletes on GET, with no confirmation step. The account fixture relies on it for
   teardown and asserts the outcome.

## Open Questions

None outstanding.

## Decisions Needed

- [ ] Whether to extend coverage to the public API the application exposes, as a separate suite with
      its own cap, or to keep this repository UI-only.
- [ ] Whether a second viewport justifies doubling the baseline count, given every baseline needs a
      human to review its diff.
