# Payment Test Plan

## Metadata

| Field        | Value                                       |
| ------------ | ------------------------------------------- |
| Page URL     | `/payment`                                  |
| Page Title   | `Automation Exercise - Payment`             |
| Spec File    | `tests/payment/payment.spec.ts`             |
| Page Object  | `utils/pageObjects/checkout/paymentPage.ts` |
| Precondition | Login (own account, decision #7)            |

## Scope

The payment form itself: its fields and the submission that places the order. Reaching this page
from checkout is covered by TC-20 in `checkout-test-plan.md`. What a successful submission opens is
covered by `confirmation-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The case runs on an account of its own, created through the API, signed in through the login
  form and deleted afterwards (decision #7), so its cart is its own. It clears the cart with
  `cartPage.clearCart()` first, then arranges its own precondition: a product added
  to the cart, Proceed to Checkout and Place Order pressed, reaching `/payment` before any assertion
  in this plan runs.

## Test Cases

| ID    | Name                                                           | Type  | Scenario                                                                                                                  | Expected                                                                                                                    |
| ----- | -------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| TC-21 | The payment form collects card details and completes the order | happy | A signed-in visitor on `/payment` fills Name on Card, Card Number, CVC and Expiration, then presses Pay and Confirm Order | The Payment heading and all four fields are visible beforehand; pressing Pay and Confirm Order reaches `/payment_done/<id>` |

## Locator Notes

- Every field on `#payment-form` carries the native `required` attribute; submitting the form empty
  is blocked by the browser's own "Please fill out this field" validation bubble, never reaching the
  application, so no dedicated error case is written for it — the same reasoning already recorded for
  the review form in `product-detail-test-plan.md`. Verified live on 2026-09-20.
- `paymentForm`'s locator targets the parent grid column rather than `#payment-form` itself, since
  that element renders with a zero-height bounding box; see the page object for why.

## Out of Scope

- Reaching this page from checkout: covered by TC-20 in `checkout-test-plan.md`.
- The confirmation page a successful submission opens: covered by `confirmation-test-plan.md`.
- No dedicated error case: every field is browser-validated as `required`, with nothing for the
  application itself to reject.
