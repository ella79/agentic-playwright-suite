# Checkout Test Plan

## Metadata

| Field       | Value                                                                                                                                                                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page URL    | `/checkout`, `/payment`, `/payment_done/<id>`                                                                                                                                                                                                                                           |
| Page Title  | `Automation Exercise - Checkout`, `Automation Exercise - Payment`, `Automation Exercise - Order Placed`                                                                                                                                                                                 |
| Spec File   | `tests/checkout/checkout.spec.ts`                                                                                                                                                                                                                                                       |
| Page Object | `utils/pageObjects/products/productDetailPage.ts`, `utils/pageObjects/shared/addToCartModal.ts`, `utils/pageObjects/cart/cartPage.ts`, `utils/pageObjects/checkout/checkoutPage.ts`, `utils/pageObjects/checkout/paymentPage.ts`, `utils/pageObjects/checkout/orderConfirmationPage.ts` |

## Scope

The full purchase journey for a registered user: cart review, address confirmation, order comment,
payment, and order confirmation.

This is the suite's one long end-to-end scenario. Every other test is deliberately narrower ,
this one exists to prove the flow holds together, not to cover each step's variations.

## Preconditions

Seed: `specs/seed.spec.ts`

- A registered, signed-in user. Provided by the `uniqueAccount` fixture, which registers the
  account before the test and deletes it afterwards.
- At least one product in the cart.

## Test Cases

| ID    | Name                                              | Type  | Scenario                                            | Expected                                                                                                                                                                                |
| ----- | ------------------------------------------------- | ----- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-17 | A signed-in user can complete an order end to end | happy | A signed-in user checks out a cart with one product | Delivery and billing addresses reflect the registered account, the order review lists the product, and after payment the order placed confirmation with a downloadable invoice is shown |

## Steps

1. Register through the fixture; the user is signed in.
2. Add a known product to the cart from its detail page.
3. Proceed to checkout.
4. Confirm the delivery address carries the registered account's details.
5. Add an order comment.
6. Place the order and submit card details.
7. Assert the order placed confirmation and the invoice link.

## Locator Notes

- The address blocks are `#address_delivery` and `#address_invoice`; neither has a role.
- The order comment textarea has neither a label nor a placeholder.
- `Place Order` is a real anchor with `href="/payment"`, so it carries a link role.
- Payment fields all expose `data-qa`. Confirmation lands on `/payment_done/<id>`.

## Out of Scope

- Payment rejection paths: the application accepts any card input, so a declined-payment test
  would assert application behaviour that does not exist.
- Invoice file contents: the download is asserted as available, not parsed.
