# Visual Regression Plans

One plan per area, matching the spec files in `vr-tests/`. This file holds what applies to all of
them, so the individual plans only carry what is specific to their area.

| Plan                             | Spec file                            | Cases                 |
| -------------------------------- | ------------------------------------ | --------------------- |
| `home-vr-test-plan.md`           | `vr-tests/home.vr.spec.ts`           | VR-01 to VR-03        |
| `products-vr-test-plan.md`       | `vr-tests/products.vr.spec.ts`       | VR-04 to VR-07        |
| `product-detail-vr-test-plan.md` | `vr-tests/product-detail.vr.spec.ts` | VR-08 to VR-09        |
| `cart-vr-test-plan.md`           | `vr-tests/cart.vr.spec.ts`           | VR-10 to VR-13        |
| `authentication-vr-test-plan.md` | `vr-tests/auth.vr.spec.ts`           | VR-14 to VR-16, VR-18 |
| `contact-vr-test-plan.md`        | `vr-tests/contact.vr.spec.ts`        | VR-17                 |
| `checkout-vr-test-plan.md`       | `vr-tests/checkout.vr.spec.ts`       | VR-19 to VR-20        |

## What These Plans Cover

Behaviour is never asserted here. Each case reaches a state and captures it; whether the state does
anything is the functional suite's job. A case that needs more than the minimum interaction to reach
its state belongs in `tests/`, not here.

## Baseline Environment

Baselines are Chromium on Linux at 1920x1080, generated in the same image CI runs
(`yarn docker:vr:update`) and committed from there. Text renders differently on Windows and macOS,
so a baseline produced on either would never match, locally generated ones are gitignored rather
than committed, and the visual job fails outright if no Linux baseline is present rather than
quietly writing one and reporting success.

## Size Rule

No baseline may be taller than the viewport. A diff in an image nobody can scan gets approved
without being read, which is worse than having no test. Where a region is genuinely larger, the
catalog grid is over thirteen thousand pixels tall, the plan anchors its heading to the top of the
viewport and captures the viewport instead.

## Thresholds

The default `0.01` applies everywhere except captures containing product photography, which use
`0.05` because the demo host serves those images with varying compression. Any threshold above the
default carries an inline `// VR:` comment naming the reason.

## Noise Control

Ad, analytics, and consent-management requests are aborted at the route level by the shared fixture,
so none of it needs masking. This is why the visual suite imports the project fixture rather than
Playwright's bare `test`. Masking is reserved for content this suite itself generates, such as
per-run account details.

## Out of Scope, For All Areas

- Hover and focus states: cursor position and focus rings vary between runs and platforms.
- Order confirmation: the page carries a generated order id, so its only stable region is text the
  functional suite already asserts.
- Responsive breakpoints: one viewport only. Adding mobile widths would double a baseline count
  deliberately capped at twenty, and every one of those baselines needs a human to review it.
