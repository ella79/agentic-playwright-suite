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

Two regions with different failure modes: the information panel, which is a layout of image, price,
availability and the quantity control, and the review form, which is the only form on the page a
regression would hit.

Both captures use a fixed product so the content is stable between runs.

## Cases

| ID    | Name                      | Screenshot                   | State captured                                       |
| ----- | ------------------------- | ---------------------------- | ---------------------------------------------------- |
| VR-08 | Product information panel | `product-detail-information` | Information panel: image, price, availability, brand |
| VR-09 | Write-a-review form       | `product-detail-review-form` | Write-a-review form in its empty state               |

## Notes

**VR-08 waits for its image to decode** before capturing, and uses the `0.05` threshold, because the
product photograph is served with varying compression.

**VR-09 stays at the default threshold**: it is text and inputs, so any difference is real.

## Out of Scope

- The quantity spinner's incremented state: it changes a number, not a layout, and the functional
  suite asserts the value.
- A submitted review's confirmation: the functional suite covers it, and the message renders in a
  region the form capture already includes.
