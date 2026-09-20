# Products Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                        |
| ----------- | -------------------------------------------- |
| Page URL    | `/products`                                  |
| Page Title  | `Automation Exercise - All Products`         |
| Spec File   | `vr-tests/products.vr.spec.ts`               |
| Page Object | `utils/pageObjects/products/productsPage.ts` |
| Baselines   | `vr-tests/products.vr.spec.ts-snapshots/`    |

## Scope

The catalog listing's own states: the special offer banner, a search in progress, and a search that
finds nothing. The product card itself is not repeated here: it is the same markup already captured
in `home-vr-test-plan.md`'s VR-05.

## Cases

| ID    | Name                     | Screenshot                | State captured                                                                               |
| ----- | ------------------------ | ------------------------- | -------------------------------------------------------------------------------------------- |
| VR-18 | Special offer banner     | `products-special-offer`  | The `#sale_image` banner in the sidebar                                                      |
| VR-19 | Search results, matching | `products-search-results` | The search bar with the typed term, and the Searched Products heading with matching cards    |
| VR-20 | Search results, empty    | `products-search-empty`   | The search bar with the typed term, and the Searched Products heading with no cards below it |

## Notes

- VR-19 and VR-20 capture a full-width clip from the search bar's own top down to the result grid's
  bottom, not a tightened box around just the two: the bar and the grid sit in separate, unrelated
  sections with no shared container, and the sidebar sits between them at some of the same
  horizontal positions, so a tightened clip would slice through the sidebar rather than skip it
  cleanly. The search input keeps the typed term as its own value after the results render, verified
  live, so it doubles as proof of what was searched. Otherwise, every case uses the project default
  threshold and no mask.

## Out of Scope

- The full catalog grid: 13,347px tall, unreviewable and unstable under load. One card at rest is
  captured once, in `home-vr-test-plan.md`'s VR-05, since the markup is identical here.
- Category and brand filtering as a UI interaction: it lands on this same grid template, already
  represented by VR-19's card rendering; nothing about the filtered state looks different from a
  search result.
