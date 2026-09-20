# Checkout Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                        |
| ----------- | -------------------------------------------- |
| Page URL    | `/checkout`                                  |
| Page Title  | `Automation Exercise - Checkout`             |
| Spec File   | `vr-tests/checkout.vr.spec.ts`               |
| Page Object | `utils/pageObjects/checkout/checkoutPage.ts` |
| Baselines   | `vr-tests/checkout.vr.spec.ts-snapshots/`    |

## Scope

The two blocks a signed-in visitor sees before placing an order: the address details and the order
review.

## Cases

| ID    | Name               | Screenshot                 | State captured                                                                            |
| ----- | ------------------ | -------------------------- | ----------------------------------------------------------------------------------------- |
| VR-28 | Address details    | `checkout-address-details` | "Address Details" with both "Your delivery address" and "Your billing address", populated |
| VR-29 | Order review block | `checkout-order-review`    | The order table, including its Total Amount row                                           |

## Notes

- VR-28 captures a clip spanning the "Address Details" heading and both address blocks together,
  not either block on its own: the two are read together on the real page. No masking is used: the
  address values are the shared account's own fixed literal defaults from `buildAccount()` in
  `utils/testData.ts`, not per-run data, so there is nothing unstable to hide.

## Out of Scope

- The checkout guard a guest meets: covered by `cart-vr-test-plan.md`.
- The payment form Place Order opens: covered by `payment-vr-test-plan.md`.
- The comment field's empty state: a functional concern already checked by `checkout-test-plan.md`'s
  TC-20, not a rendering difference from the table above it.
