# Product Browsing Test Plan

## Scope

Catalog listing, product detail, search, and the two sidebar filters. Verifies that a visitor can
find a product and that a search with no matches produces an honest empty state rather than the
full catalog.

## Preconditions

- Entry point: `/products`. No account required — the catalog is public.

## Test Cases

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-07 | happy | A visitor opens the catalog and views a product | The catalog renders product cards and the detail page shows name, price, availability |
| TC-08 | happy | A visitor searches for a term matching several products | The searched products heading appears and every returned card matches the term |
| TC-09 | error | A visitor searches for a term with no matches | The searched products heading appears with zero cards — the catalog is not silently returned |
| TC-10 | happy | A visitor filters by a category | The heading names the category and at least one product is listed |
| TC-11 | happy | A visitor filters by a brand | The heading names the brand and at least one product is listed |

## Locator Notes

- Search field exposes the placeholder `Search Product`; the submit control is icon-only and has no
  accessible name, so it is reached by id with a documented CSS fallback.
- Product cards are layout wrappers with no role. They are matched by their product name text.
- `View Product` is a real anchor with `href`, so it carries a link role. `Add to cart` on the
  listing is an anchor **without** `href` and therefore has no role.

## Out of Scope

- Pagination and sorting: the catalog renders in full on one page.
- Product image content: covered visually by the VR suite instead.
