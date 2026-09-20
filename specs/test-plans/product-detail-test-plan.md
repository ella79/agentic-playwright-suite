# Product Detail Test Plan

## Metadata

| Field        | Value                                             |
| ------------ | -------------------------------------------------- |
| Page URL     | `/product_details/<id>`                           |
| Page Title   | `Automation Exercise - Product Details`           |
| Spec File    | `tests/product-detail/product-detail.spec.ts`     |
| Page Object  | `utils/pageObjects/products/productDetailPage.ts` |
| Precondition | Login (shared account)                            |

## Scope

The product's own information display and its review form. Reaching the page from a search result
is covered by TC-15 in `products-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The shared account signs in automatically via `login.setup.ts`; every case here starts already
  signed in.

## Test Cases

| ID    | Name                                                       | Type  | Scenario                                            | Expected                                                                                                                       |
| ----- | ------------------------------------------------------------- | ----- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| TC-17 | The product detail page shows the product's full information | happy | A visitor opens a product's detail page directly    | The name, category (Men > Tshirts), price, quantity selector, availability (In Stock), condition (New), brand (H&M) and the Write Your Review section are all visible |
| TC-18 | A product review can be submitted from the detail page      | happy | A visitor fills and submits the review form          | The thank-you message is shown                                                                                                    |

## Locator Notes

- `#reviews` is a zero-height tab wrapper; the form inside it is what renders, so the page object
  scopes to `#review-form`.
- All three review fields are `required`, so an empty submit is blocked by the browser rather than
  the application. Verified live on 2026-09-10.

## Out of Scope

- The list of existing reviews: the application does not render one.
- Reaching this page from search: covered by `products-test-plan.md`.
