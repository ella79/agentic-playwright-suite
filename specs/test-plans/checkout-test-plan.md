# Checkout Test Plan

## Metadata

| Field        | Value                                        |
| ------------ | -------------------------------------------- |
| Page URL     | `/checkout`                                  |
| Page Title   | `Automation Exercise - Checkout`             |
| Spec File    | `tests/checkout/checkout.spec.ts`            |
| Page Object  | `utils/pageObjects/checkout/checkoutPage.ts` |
| Precondition | Login (own account, decision #7)             |

## Scope

The checkout page a signed-in visitor reaches from the cart: the delivery and billing address
blocks, the order review, and the comment field, ending on Place Order. What Proceed to Checkout
does for a guest is covered by TC-19 in `cart-test-plan.md`. What Place Order opens is covered
by `payment-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The case runs on an account of its own, created through the API, signed in through the login
  form and deleted afterwards (decision #7), so its cart is its own. It clears the cart with
  `cartPage.clearCart()` first, then arranges its own precondition: a product added
  to the cart, then Proceed to Checkout pressed, before any assertion in this plan runs.

## Test Cases

| ID    | Name                                                              | Type  | Scenario                                                        | Expected                                                                                                                                                                                                                       |
| ----- | ----------------------------------------------------------------- | ----- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-20 | The checkout page shows the order it will place, ready to proceed | happy | A signed-in visitor with a product in the cart reaches checkout | Address Details shows a non-empty delivery address and a non-empty billing address; Review Your Order lists the one product in the cart; the order comment field is present and empty; pressing Place Order reaches `/payment` |

## Locator Notes

- `deliveryAddressValues` masks every line except the block heading when this page is captured
  visually, since the values are per-run generated data; the functional assertion here checks the
  block is non-empty, not its exact text.
- `CheckoutPage` needs a `billingAddress` locator alongside the existing `deliveryAddress`: verified
  live that both "YOUR DELIVERY ADDRESS" and "YOUR BILLING ADDRESS" blocks render, populated from the
  same account data.
- `/view_cart` and `/checkout` share the exact page title, `Automation Exercise - Checkout` —
  recorded in `STATUS.md`. Every assertion here targets a heading or the URL, never the title.

## Out of Scope

- The checkout guard a guest meets: covered by TC-19 in `cart-test-plan.md`.
- The payment form Place Order opens: covered by `payment-test-plan.md`.
- No dedicated error case exists for this page: every input on it is either read-only account data
  or an optional comment field with nothing to reject.
