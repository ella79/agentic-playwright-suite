# Cart Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                 |
| ----------- | ------------------------------------- |
| Page URL    | `/view_cart`                          |
| Page Title  | `Automation Exercise - Checkout`      |
| Spec File   | `vr-tests/cart.vr.spec.ts`            |
| Page Object | `utils/pageObjects/cart/cartPage.ts`  |
| Baselines   | `vr-tests/cart.vr.spec.ts-snapshots/` |

## Scope

The cart page's own two states, empty and holding a product, plus the guard a guest meets trying to
check out.

## Cases

| ID    | Name                 | Screenshot            | State captured                                       |
| ----- | -------------------- | --------------------- | ---------------------------------------------------- |
| VR-25 | Cart, empty          | `cart-empty`          | The "Cart is empty!" message                         |
| VR-26 | Cart, with a product | `cart-with-item`      | One row, its price, quantity and Proceed to Checkout |
| VR-27 | Checkout guard modal | `cart-checkout-guard` | The guest guard modal open over the cart page        |

## Notes

- VR-27 captures the page from header to footer rather than the modal alone, since the modal is a Bootstrap overlay
  whose backdrop is part of what a regression could break.

## Out of Scope

- The add-to-cart confirmation modal that leads here: captured once, in `home-vr-test-plan.md`'s
  VR-10, since it is the same component regardless of which page opened it.
