# Product Detail Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/product-detail.vr.spec.ts`.

## Scope

Two regions with different failure modes: the information panel, which is a layout of image, price,
availability and the quantity control, and the review form, which is the only form on the page a
regression would hit.

Both captures use a fixed product so the content is stable between runs.

## Cases

| ID    | Screenshot                   | State captured                                       |
| ----- | ---------------------------- | ---------------------------------------------------- |
| VR-08 | `product-detail-information` | Information panel: image, price, availability, brand |
| VR-09 | `product-detail-review-form` | Write-a-review form in its empty state               |

## Notes

**VR-08 waits for its image to decode** before capturing, and uses the `0.05` threshold, because the
product photograph is served with varying compression.

**VR-09 stays at the default threshold**: it is text and inputs, so any difference is real.

## Out of Scope

- The quantity spinner's incremented state: it changes a number, not a layout, and the functional
  suite asserts the value.
- A submitted review's confirmation: the functional suite covers it, and the message renders in a
  region the form capture already includes.
