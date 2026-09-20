# Confirmation Test Plan

## Metadata

| Field        | Value                                                 |
| ------------ | ----------------------------------------------------- |
| Page URL     | `/payment_done/<id>`                                  |
| Page Title   | `Automation Exercise - Order Placed`                  |
| Spec File    | `tests/confirmation/confirmation.spec.ts`             |
| Page Object  | `utils/pageObjects/checkout/orderConfirmationPage.ts` |
| Precondition | Login (shared account)                                |

## Scope

The page a completed payment opens: the confirmation banner and message, and where Download Invoice
and Continue lead. Completing the payment form itself is covered by `payment-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- The shared account signs in automatically via `login.setup.ts`.
- The case clears the cart with `cartPage.clearCart()` first, since it belongs to the same shared
  account every other file in this group uses, then arranges its own precondition: a product added
  to the cart, checkout and payment completed with valid card details, before any assertion in this
  plan runs.

## Test Cases

| ID    | Name                                                                                       | Type  | Scenario                                                                                               | Expected                                                                                                                                                                   |
| ----- | ------------------------------------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-22 | The confirmation page confirms the order, downloads its invoice, and Continue returns home | happy | A signed-in visitor lands on the confirmation page after paying, downloads the invoice, then continues | "ORDER PLACED!" and "Congratulations! Your order has been confirmed!" are shown; Download Invoice actually starts a file download; pressing Continue reaches the home page |

## Locator Notes

- `orderPlacedBanner` matches case-insensitively: the heading is upper-cased by CSS `text-transform`,
  not in the markup.
- Download Invoice is verified by waiting on Playwright's own `download` event and asserting it
  carries a filename; the plan does not open or verify the downloaded file's own content.

## Out of Scope

- Completing the payment form: covered by `payment-test-plan.md`.
- The downloaded invoice's own content: not verified anywhere in this suite.
