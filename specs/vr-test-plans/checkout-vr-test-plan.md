# Checkout Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/checkout.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

The two screens between a full cart and a placed order. Both are behind registration and a populated
cart, so this area's setup is the most expensive in the visual suite, which is itself the reason to
cover it: a layout regression here reaches a user at the point where they are paying.

## Cases

| ID    | Screenshot                 | State captured                              |
| ----- | -------------------------- | ------------------------------------------- |
| VR-19 | `checkout-address-details` | Delivery address block on the checkout step |
| VR-20 | `checkout-payment-form`    | Card entry form                             |

## Notes

**VR-19 masks the address values, not the block.** The address comes from the account the fixture
generates, so the values differ every run while the layout does not. Masking only the generated
lines keeps the heading, the block's borders and its spacing under comparison, masking the whole
block would leave the case asserting nothing, which is how a visual test quietly stops testing.

**VR-20 documents a real defect rather than hiding it.** The payment form ships Bootstrap 4 row
markup against Bootstrap 3 CSS, so every `.form-row` and the `<form>` element itself collapse to
zero height; the page only looks correct because the parent grid column is floated. The capture is
therefore scoped to the container that actually has dimensions. The finding is recorded in
`STATUS.md`: the baseline reflects what the application really renders, and the workaround is
documented at the capture instead of being silently absorbed.

**Setup.** Both cases request `uniqueAccount` for its side effect: registration is what makes the
checkout reachable at all.

## Out of Scope

- The order confirmation page: it carries a generated order id, so the only stable region is text
  the functional suite asserts.
- The review-your-order table on the checkout step: its content is the cart table, already covered
  by VR-11.
