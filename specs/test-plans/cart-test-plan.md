# Cart Test Plan

## Metadata

| Field        | Value                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------- |
| Page URL     | `/view_cart`                                                                                 |
| Page Title   | `Automation Exercise - Checkout`                                                             |
| Spec File    | `tests/cart/cart.spec.ts`                                                                    |
| Page Object  | `utils/pageObjects/cart/cartPage.ts`                                                         |
| Precondition | Login (shared account), except TC-19's guest half, which resets to Guest for that comparison |

## Scope

The cart page itself: its nav menu and empty state, the home-page notification flow that adds
products into it, holding and removing items, and where Proceed to Checkout leads for a guest
against a signed-in visitor. What Proceed to Checkout opens for a signed-in visitor belongs to
`checkout-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The shared account signs in automatically via `login.setup.ts`; every case here starts already
  signed in.
- The cart belongs to that same shared, persistent account, so every case clears it with
  `cartPage.clearCart()` before arranging its own state, rather than assuming another file left it
  empty. Parallel workers each run their own file, so this is what keeps the cart deterministic
  across `cart`, `checkout`, `payment` and `confirmation`.
- TC-19 resets to a guest context for its guard half, using
  `test.use({ storageState: { cookies: [], origins: [] } })` scoped to that case alone.

## Test Cases

| ID    | Name                                                                                                 | Type  | Scenario                                                                                                                                                                                                                  | Expected                                                                                                                                                                                                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-18 | The cart starts empty, and adding products from the home page notifies for each until one is removed | happy | A visitor on the cart page sees the nav menu and the empty-cart message, follows Home from the breadcrumb, adds Blue Top and clicks Continue Shopping, then adds Men Tshirt and clicks View Cart, then removes Men Tshirt | The nav menu shows Home and Cart; the empty message reads "Cart is empty! Click here to buy products."; the breadcrumb reaches the home page; each addition shows the "Added!" notification; View Cart lands on the cart page with both products and Proceed to Checkout visible; afterwards only Blue Top remains |
| TC-19 | Proceeding to checkout differs for a guest and a signed-in visitor                                   | happy | A guest and a signed-in visitor, each with a product in the cart, press Proceed to Checkout                                                                                                                               | The guest sees the Checkout guard's "Register / Login account to proceed on checkout." and stays on the cart page; the signed-in visitor reaches `/checkout`                                                                                                                                                       |

## Locator Notes

- `/view_cart` and `/checkout` share the exact page title, `Automation Exercise - Checkout` — a
  `toHaveTitle` assertion cannot distinguish the two; every case here asserts on a heading, message
  text or URL instead. Recorded in `STATUS.md`.
- The cart's own page object is named `CartPage` (`utils/pageObjects/cart/cartPage.ts`), matching
  the header nav's own label for this page ("Cart"), confirmed as this plan's own name too.
- The page carries two "Home" links: the header's (icon-prefixed, scoped to `BaseAppPage.homeLink`)
  and the breadcrumb's (plain text, scoped to `CartPage.homeBreadcrumbLink`). Verified live: an
  unscoped match resolves to both.

## Out of Scope

- What Proceed to Checkout opens for a signed-in visitor: covered by `checkout-test-plan.md`.
