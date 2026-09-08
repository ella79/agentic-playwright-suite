# Test Status Report

Progress of testing activities against the baseline: the plans in `specs/test-plans/` and
`specs/vr-test-plans/`, and the suites in `tests/` and `vr-tests/`.

Updated: 2026-09-08 · Source of truth for results:
[the published dashboard](https://ella79.github.io/agentic-playwright-suite/)

## Functional Coverage

| #   | Feature Plan                    | Functional Test            | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | ------------------------------- | -------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | `authentication-test-plan.md`   | `authentication.spec.ts`   | 6          | 6           | 6      | 0      | 0     | 0       | 0     |
| 2   | `product-browsing-test-plan.md` | `product-browsing.spec.ts` | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 3   | `cart-test-plan.md`             | `cart.spec.ts`             | 5          | 5           | 5      | 0      | 0     | 0       | 0     |
| 4   | `checkout-test-plan.md`         | `checkout.spec.ts`         | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 5   | `engagement-test-plan.md`       | `engagement.spec.ts`       | 3          | 3           | 3      | 0      | 0     | 0       | 0     |
|     | **Total**                       |                            | **20**     | **20**      | **20** | **0**  | **0** | **0**   | **0** |

Cap: 20. Full. New coverage replaces an existing case rather than growing the suite.

The same twenty cases run on WebKit and on mobile Safari on every merge, published separately so the
canonical dashboard stays one run of one engine. Both passed on the first attempt with no change to
any locator, which is the argument for the locator policy: roles and `data-qa` attributes do not
depend on the engine or the viewport.

## Visual Regression Coverage

| #   | Feature Plan                     | Visual Test                 | Test Cases | Implemented | Passed | Failed | Flaky | Skipped | Fixme |
| --- | -------------------------------- | --------------------------- | ---------- | ----------- | ------ | ------ | ----- | ------- | ----- |
| 1   | `home-vr-test-plan.md`           | `home.vr.spec.ts`           | 3          | 3           | 3      | 0      | 0     | 0       | 0     |
| 2   | `products-vr-test-plan.md`       | `products.vr.spec.ts`       | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 3   | `product-detail-vr-test-plan.md` | `product-detail.vr.spec.ts` | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
| 4   | `cart-vr-test-plan.md`           | `cart.vr.spec.ts`           | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 5   | `authentication-vr-test-plan.md` | `auth.vr.spec.ts`           | 4          | 4           | 4      | 0      | 0     | 0       | 0     |
| 6   | `contact-vr-test-plan.md`        | `contact.vr.spec.ts`        | 1          | 1           | 1      | 0      | 0     | 0       | 0     |
| 7   | `checkout-vr-test-plan.md`       | `checkout.vr.spec.ts`       | 2          | 2           | 2      | 0      | 0     | 0       | 0     |
|     | **Total**                        |                             | **20**     | **20**      | **20** | **0**  | **0** | **0**   | **0** |

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
   newsletter widget. TC-18 scopes to the visible one; the success state is excluded from VR-18 so
   the duplication is not baked into a baseline.
4. `/delete_account` deletes on GET, with no confirmation step. The account fixture relies on it for
   teardown and asserts the outcome.

## Open Questions

None outstanding.

## Decisions Needed

- [ ] Whether to extend coverage to the public API the application exposes, as a separate suite with
      its own cap, or to keep this repository UI-only.
- [ ] Whether a second viewport justifies doubling the baseline count, given every baseline needs a
      human to review its diff.
