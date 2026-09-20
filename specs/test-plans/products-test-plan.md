# Products Test Plan

## Metadata

| Field        | Value                                             |
| ------------ | --------------------------------------------------- |
| Page URL     | `/products`                                         |
| Page Title   | `Automation Exercise - All Products`                |
| Spec File    | `tests/products/products.spec.ts`                   |
| Page Object  | `utils/pageObjects/products/productsPage.ts`        |
| Precondition | Login (shared account)                              |

## Scope

The catalog listing itself: the special offer banner, the full product grid, and search — including
where a search result's `View Product` link leads. Category and brand filtering are covered in
`home-test-plan.md`, since the sidebar that drives them is shared markup and the home page is the
entry point already tested for that interaction. The detail page's own content and review form are
covered by `product-detail-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The shared account signs in automatically via `login.setup.ts`; every case here starts already
  signed in.

## Test Cases

| ID    | Name                                                                              | Type  | Scenario                                                                                                     | Expected                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| TC-13 | The products page renders its catalog and special offer banner                   | happy | A visitor opens the products page                                                                            | The All Products heading and the product grid are visible; the special offer banner (`#sale_image`) is visible in the sidebar |
| TC-14 | Searching for a product shows only matching results, and opening one reaches its detail page | happy | A visitor searches for Men Tshirt, then opens the matching product from the results                          | The Searched Products heading is shown with a card naming the product; opening it lands on `/product_details/2`             |
| TC-15 | A search with no matches returns an empty result set                             | edge  | A visitor searches for a term no product matches                                                              | The Searched Products heading is shown; the product grid holds no cards                                                     |

## Locator Notes

- `#sale_image` carries no visible text of its own (`alt="Website for practice"`); it is identified by
  its stable `id`, not by content — verified live.
- The category and brand sidebars render identical markup here and on the home page; TC-13 does not
  duplicate their assertion, which lives in `home-test-plan.md`.

## Out of Scope

- Category and brand filtering: covered by `home-test-plan.md`.
- The product detail page's own information display and review form: covered by
  `product-detail-test-plan.md`.
- Adding a product to the cart from the listing: covered by `cart-test-plan.md`.
