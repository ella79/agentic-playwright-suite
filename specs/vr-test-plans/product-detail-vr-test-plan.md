# Product Detail Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                             |
| ----------- | ------------------------------------------------- |
| Page URL    | `/product_details/<id>`                           |
| Page Title  | `Automation Exercise - Product Details`           |
| Spec File   | `vr-tests/product-detail.vr.spec.ts`              |
| Page Object | `utils/pageObjects/products/productDetailPage.ts` |
| Baselines   | `vr-tests/product-detail.vr.spec.ts-snapshots/`   |

## Scope

The product's own showcase and its review form, in its four states: empty, rejected, filled and
submitted.

## Cases

| ID    | Name                               | Screenshot                         | State captured                                                                                  |
| ----- | ---------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| VR-21 | Product showcase                   | `product-detail-showcase`          | The product image beside its name, category, price, quantity, availability, condition and brand |
| VR-22 | Write Your Review form, default    | `product-detail-review-form`       | The "WRITE YOUR REVIEW" tab title with name, email and review fields, empty                     |
| VR-23 | Write Your Review form, validation | `product-detail-review-validation` | The native "Please fill out this field" bubble after an empty submit                            |
| VR-24 | Review submitted                   | `product-detail-review-sent`       | The "Thank you for your review." success state                                                  |

## Notes

- VR-21 captures the viewport rather than an element: the row holding the image and information
  columns carries Bootstrap's own negative row margins with nothing to clip them, so an element
  screenshot of it paints the sidebar sitting in the same region instead of just its own two
  children. Verified live. The page opens scrolled to the top, so the viewport already is the
  showcase.
- VR-22's `reviewSection` locator scopes to `.category-tab.shop-details-tab`, not `#review-form` or
  `#reviews`: the latter two are both zero-height tab wrappers for the same reason as the rest of
  this page's rows, and neither includes the "WRITE YOUR REVIEW" tab label, which is `#reviews`'s own
  sibling rather than its parent. This wrapper has a real height and holds both. Verified live.
- VR-23 exists for the same reason as `payment-vr-test-plan.md`'s VR-32: name, email and review all
  carry `required`, verified live, so the browser's own field validation blocks the submit.
- VR-24 also captures the viewport rather than `reviewSection`: the success banner's own row
  (`#review-section`, a `.form-row`) collapses to zero height for the same reason as VR-21's `.row`,
  floated children with no clearfix, and sits exactly at the review form's own bottom edge, so an
  element screenshot of the form clips the banner's text out entirely instead of just cropping
  tightly around it. Verified live.

## Out of Scope

- The list of existing reviews: the application does not render one.
- Reaching this page from search: a navigation, not a rendering difference.
