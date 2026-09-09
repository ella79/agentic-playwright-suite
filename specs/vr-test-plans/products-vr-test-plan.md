# Products Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/products.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

The catalog page is where a styling regression is most likely to be noticed by a user, and it holds
three distinct things worth separate baselines: the grid, the single card that composes it, and the
filter sidebar. The no-results state is included because an empty state is the layout most likely to
break unnoticed, nothing renders there in normal use.

## Cases

| ID    | Screenshot                   | State captured                                   |
| ----- | ---------------------------- | ------------------------------------------------ |
| VR-04 | `products-catalog-grid`      | Catalog grid, viewport-anchored                  |
| VR-05 | `products-card-default`      | A single product card at rest                    |
| VR-06 | `products-category-sidebar`  | Category accordion in its collapsed state        |
| VR-07 | `products-search-no-results` | Catalog area after a search that matches nothing |

## Notes

**VR-04 captures the viewport, not the grid element**, for the same reason as VR-02: the grid is
13,347 pixels tall. The heading is anchored to the top of the viewport first.

**VR-05 exists alongside VR-04 deliberately.** The grid capture would hide a change to a single
card's internals inside a `0.05` threshold; the card capture is tight enough to catch it. One
proves layout, the other proves the component.

**Thresholds.** VR-04 and VR-05 use `0.05` for product photography. VR-06 and VR-07 hold the
default, since neither contains an image.

## Out of Scope

- The card's hover overlay, which reveals a second add-to-cart control: hover states are excluded
  suite-wide.
- Brand filters: visually identical to the category sidebar, so a baseline would duplicate VR-06.
- Search results for a term that matches: the grid layout is already covered, and the result set
  depends on the demo host's data.
