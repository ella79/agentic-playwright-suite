# Home Test Plan

## Metadata

| Field        | Value                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------- |
| Page URL     | `/`                                                                                          |
| Page Title   | `Automation Exercise`                                                                        |
| Spec File    | `tests/home/home.spec.ts`                                                                    |
| Page Object  | `utils/pageObjects/home/homePage.ts`                                                         |
| Precondition | Login (shared account), except TC-02, which compares the Guest and Login states directly    |

## Scope

The landing page's own layout and the entry points it hands off from: the category and brand
sidebars, the featured and recommended catalogs, the hero's two navigation buttons, the header's
guest/signed-in states, the newsletter subscription, and the footer. Category and brand filtering
are covered here because the home page is where a visitor starts them; the resulting listing page
itself belongs to `products-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The shared account signs in automatically via `login.setup.ts`; every case here starts already
  signed in unless stated otherwise.
- TC-02 is the exception: it resets to a guest context for one half of its comparison, using
  `test.use({ storageState: { cookies: [], origins: [] } })` scoped to that case alone.

## Test Cases

| ID    | Name                                                                                     | Type  | Scenario                                                                                                            | Expected                                                                                                                                                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-01 | Every section of the home page renders with its expected content                        | happy | A visitor lands on the home page                                                                                    | The page title is `Automation Exercise`; the hero shows its heading, subheading and description text; the category list shows Women, Men and Kids; the brands list shows all eight brands; the first featured item is a card with an image, a price, the name Blue Top, an Add to Cart action and a View Product link; the recommended items are shown; the subscription form and the footer's copyright line are visible |
| TC-02 | The header shows a different menu and account state for a guest and a signed-in visitor | happy | A guest visitor and a signed-in visitor both view the home page                                                     | The guest header offers Signup / Login and no Logged in as banner; the signed-in header offers Logout and Delete Account and shows Logged in as \<name\>; Video Tutorials and every other link are present in both states                                                              |
| TC-03 | The hero's Test Cases and API Testing buttons open their own pages                      | happy | A visitor presses each of the hero section's two buttons                                                            | The Test Cases button opens `/test_cases`; the API Testing button opens `/api_list`                                                                                                                                                                                                    |
| TC-04 | Selecting a category or a brand filters the catalog accordingly                         | happy | A visitor opens Women, then Dress, from the category sidebar; separately, a visitor selects Madame from the brands sidebar | The category path shows the heading "Women - Dress Products" at `/category_products/1`; the brand path shows the heading "Brand - Madame Products" at `/brand_products/Madame`                                                                                                        |
| TC-05 | The main navigation reaches every page it links to                                      | happy | A visitor follows each link in the header from the home page: Products, Cart, Test Cases, API Testing, Contact us  | Each link lands on its own page, identified by URL and heading                                                                                                                                                                                                                          |
| TC-06 | A visitor can subscribe to the newsletter from the footer                                | happy | A visitor subscribes to the newsletter from the footer                                                              | The subscription success message is shown                                                                                                                                                                                                                                               |

## Locator Notes

- The hero's heading, subheading and description are identical across all three carousel slides —
  verified live: only the slide's background differs, not its text. Asserting on that text is safe
  and does not race the carousel's timer; only the rotating background is out of scope.
- The subscription section is shared markup: it also renders on the login page. The locator lives on
  `BaseAppPage` or a shared component, not duplicated per page object.
- "Featured item" and "recommended item" cards share the same card markup and carry no subcategory
  label — verified live in the rendered DOM. TC-01 scopes its assertion to the first card only, by
  name, rather than asserting the full grid.
- TC-04 groups the category and brand filters into one case, run as two `test.step`s, since both are
  the same interaction against a different sidebar and neither needs its own page load to prove.

## Out of Scope

- The hero carousel's rotating background image.
- Adding a home-page featured item to the cart: that interaction, and the notification it produces,
  is exercised from the cart flow in `cart-test-plan.md`, not duplicated here.
- The product detail page a `View Product` link opens: covered by `product-detail-test-plan.md`.
- The full products listing a category or brand filter lands on: covered by `products-test-plan.md`.
