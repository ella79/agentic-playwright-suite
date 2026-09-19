# Product Detail Test Plan

## Metadata

| Field       | Value                                             |
| ----------- | ------------------------------------------------- |
| Page URL    | `/product_details/<id>`                           |
| Page Title  | `Automation Exercise - Product Details`           |
| Spec File   | `tests/product-detail/product-detail.spec.ts`     |
| Page Object | `utils/pageObjects/products/productDetailPage.ts` |

## Scope

The review form on a product's detail page. Reaching the page from the catalog is covered by TC-07 in `products-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- No account required.

## Test Cases

| ID    | Name                                                   | Type  | Scenario                                            | Expected                       |
| ----- | ------------------------------------------------------ | ----- | --------------------------------------------------- | ------------------------------ |
| TC-19 | A product review can be submitted from the detail page | happy | A visitor submits a review on a product detail page | The thank-you message is shown |

## Locator Notes

- `#reviews` is a zero-height tab wrapper; the form inside it is what renders, so the page object
  scopes to `#review-form`.
- All three fields are `required`, so an empty submit is blocked by the browser rather than the
  application. Verified live on 2026-09-10.

## Out of Scope

- The list of existing reviews: the application does not render one.
