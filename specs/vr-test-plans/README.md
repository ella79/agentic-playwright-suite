# Visual Regression Plans

One plan per area, matching the spec files in `vr-tests/` and, area for area, the functional suite's
own folders in `tests/`. This file holds what applies to all of them, so the individual plans only
carry what is specific to their area.

| Plan                             | Spec file                            | Cases          |
| -------------------------------- | ------------------------------------ | -------------- |
| `home-vr-test-plan.md`           | `vr-tests/home.vr.spec.ts`           | VR-01 to VR-10 |
| `login-vr-test-plan.md`          | `vr-tests/login.vr.spec.ts`          | VR-11 to VR-12 |
| `signup-vr-test-plan.md`         | `vr-tests/signup.vr.spec.ts`         | VR-13 to VR-17 |
| `products-vr-test-plan.md`       | `vr-tests/products.vr.spec.ts`       | VR-18 to VR-20 |
| `product-detail-vr-test-plan.md` | `vr-tests/product-detail.vr.spec.ts` | VR-21 to VR-24 |
| `cart-vr-test-plan.md`           | `vr-tests/cart.vr.spec.ts`           | VR-25 to VR-27 |
| `checkout-vr-test-plan.md`       | `vr-tests/checkout.vr.spec.ts`       | VR-28 to VR-29 |
| `payment-vr-test-plan.md`        | `vr-tests/payment.vr.spec.ts`        | VR-30 to VR-32 |
| `confirmation-vr-test-plan.md`   | `vr-tests/confirmation.vr.spec.ts`   | VR-33          |

Rewritten from scratch alongside the functional suite: every plan and spec above is new, matching the
same nine areas (`home` through `confirmation`) rather than the previous `authentication`/`contact`
split. Nothing from the earlier structure was carried forward or renumbered into it.

## What These Plans Cover

Behaviour is never asserted here. Each case reaches a state and captures it; whether the state does
anything is the functional suite's job. A case that needs more than the minimum interaction to reach
its state belongs in `tests/`, not here.

## Constraints A Plan Must Respect

Baselines are Chromium on Linux at 1920x1080, and no baseline may be taller than the viewport: a
plan that asks for a capture larger than one screen anchors a heading and takes the viewport
instead. Both rules, with their reasoning and the baseline workflow, live in
[`playwright-visual-regression`](../../.claude/skills/playwright-visual-regression/SKILL.md).

## Thresholds

The default `0.01` applies everywhere except captures containing product photography, which use
`0.05` because the demo host serves those images with varying compression. Any threshold above the
default carries an inline `// VR:` comment naming the reason.

## Noise Control

Ad, analytics, and consent-management requests are aborted at the route level by the shared fixture,
so none of it needs masking. This is why the visual suite imports the project fixture rather than
Playwright's bare `test`. No case currently uses `mask` either: every account-shaped value on screen
comes from the fixed literal profile of `buildAccount()` in `utils/testData.ts`, which the shared
account and the own accounts of decision #7 both use,
not per-run data, so there is nothing left to hide. The mechanism stays available for a future case
that genuinely renders per-run data.

## Out of Scope, For All Areas

- Hover and focus states: cursor position and focus rings vary between runs and platforms.
- Responsive breakpoints: one viewport only. Adding mobile widths would double the baseline count,
  and every one of those baselines needs a human to review it.
