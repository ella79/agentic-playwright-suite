# Cart Test Plan

## Scope

Adding products to the cart from both entry points, quantity handling, removal, and the account
guard that blocks anonymous checkout.

## Preconditions

- Cart state is per browser context, so each test starts with an empty cart automatically.
- No account required except where stated.

## Test Cases

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-12 | happy | A visitor adds a product from its detail page | The confirmation modal appears and the cart row shows the product at its listed price |
| TC-13 | happy | A visitor adds a product from the catalog listing | The cart contains exactly that product |
| TC-14 | happy | A visitor sets quantity to 3 on the detail page before adding | The cart row records quantity 3 |
| TC-15 | edge | A visitor removes the only product in the cart | The cart shows its empty state and no rows remain |
| TC-16 | error | An anonymous visitor with items in the cart tries to check out | The account guard modal appears offering Register / Login; the checkout page is not reached |

## Locator Notes

- The confirmation modal is a Bootstrap modal (`#cartModal`) with no dialog role. Its `View Cart`
  control is an anchor without `href`, so it is matched by text within the modal root.
- `Proceed To Checkout` is likewise an anchor without `href`.
- The row delete control is icon-only, matched by CSS within the row scope.
- Quantity is only settable on the detail page; the cart has no inline quantity editor, which is why
  TC-14 sets it before adding rather than after.

## Out of Scope

- Cart persistence across sessions: the application ties the cart to a session cookie and this
  suite runs each test in a fresh context by design.
