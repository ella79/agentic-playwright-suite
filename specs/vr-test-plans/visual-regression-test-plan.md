# Visual Regression Test Plan

## Scope

Twenty component-level screenshots covering the visual states a change to this storefront would
most plausibly break: navigation in both authentication states, the catalog and its filters,
product detail, every cart state including both modals, all four forms, and the checkout and
payment steps.

Behaviour is not asserted here. Each case reaches a state and captures it; the functional suite
owns whether the state does anything.

## Baseline Environment

Baselines are generated on the CI platform (Chromium on Linux) by the `update-vr-baselines`
workflow and committed from there. Screenshots taken on Windows or macOS render text differently
and would never match, so locally generated baselines are gitignored rather than committed.

## Test Cases

| ID | Screenshot | State captured |
|---|---|---|
| VR-01 | `home-header-anonymous` | Site header for a visitor with no session |
| VR-02 | `home-features-items` | Featured products section on the landing page |
| VR-03 | `home-subscription` | Footer newsletter block |
| VR-04 | `products-catalog-grid` | Full catalog grid |
| VR-05 | `products-card-default` | A single product card in its resting state |
| VR-06 | `products-category-sidebar` | Category accordion |
| VR-07 | `products-search-no-results` | Catalog area after a search that matches nothing |
| VR-08 | `product-detail-information` | Product information panel |
| VR-09 | `product-detail-review-form` | Write-a-review form |
| VR-10 | `cart-empty` | Empty cart state |
| VR-11 | `cart-single-item` | Cart table holding one product |
| VR-12 | `cart-added-modal` | Add-to-cart confirmation modal |
| VR-13 | `cart-checkout-guard-modal` | Account guard shown to anonymous visitors |
| VR-14 | `auth-login-form` | Login form |
| VR-15 | `auth-signup-form` | Signup entry form |
| VR-16 | `auth-account-info-form` | Full registration form |
| VR-17 | `contact-form` | Contact form |
| VR-18 | `header-signed-in` | Site header for a signed-in user |
| VR-19 | `checkout-address-details` | Delivery and billing address blocks |
| VR-20 | `payment-form` | Card entry form |

## Thresholds

Default `0.01` applies to everything except the captures containing product photography
(`products-catalog-grid`, `products-card-default`, `product-detail-information`), which use `0.05`
because the demo host serves those images with varying compression.

## Noise Control

Ad, analytics, and consent-management requests are aborted at the route level by the shared
fixture, so no masking is needed for them. This is why the VR suite imports the project fixture
rather than Playwright's bare `test`.

## Out of Scope

- Hover and focus states: cursor position and focus rings vary between runs and platforms.
- Order confirmation: the page contains a generated order id, so its only stable region is text
  the functional suite already asserts.
- Responsive breakpoints: the suite runs one viewport (1280x720). Adding mobile widths would double
  the baseline count for a portfolio suite deliberately capped at twenty.
