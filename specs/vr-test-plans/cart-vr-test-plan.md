# Cart Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/cart.vr.spec.ts`.

## Scope

The cart has the widest set of visually distinct states in the application, and two of them are
modals, the highest-value visual targets in any suite, because a modal's positioning and overlay
break in ways functional assertions never notice. A test can click a button inside a modal that has
rendered halfway off-screen and still pass.

## Cases

| ID    | Screenshot                  | State captured                                           |
| ----- | --------------------------- | -------------------------------------------------------- |
| VR-10 | `cart-empty`                | Empty cart state                                         |
| VR-11 | `cart-single-item`          | Cart table holding one product                           |
| VR-12 | `cart-added-modal`          | Add-to-cart confirmation modal                           |
| VR-13 | `cart-checkout-guard-modal` | Account guard shown when an anonymous visitor checks out |

## Notes

**VR-11 waits for the product thumbnail to decode** before capturing, and holds the default
threshold: the row is mostly text and a small image, so the compression variance that forces `0.05`
elsewhere is not large enough here.

**VR-12 and VR-13 capture the modal root**, not the page. Scoping to the modal keeps the page
content behind it out of the comparison, so a change anywhere else on the page cannot produce a
false diff in a modal baseline.

**VR-13 requires an anonymous session.** The guard only appears to visitors without an account, so
this case must not request the `uniqueAccount` fixture.

## Out of Scope

- The cart after a removal: the resulting state is the empty cart, already covered by VR-10.
- Multiple rows: the row component is covered by VR-11, and a second row adds no new visual
  information while doubling the setup.
