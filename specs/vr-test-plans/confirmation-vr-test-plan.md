# Confirmation Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Page URL    | `/payment_done/<id>`                                  |
| Page Title  | `Automation Exercise - Order Placed`                  |
| Spec File   | `vr-tests/confirmation.vr.spec.ts`                    |
| Page Object | `utils/pageObjects/checkout/orderConfirmationPage.ts` |
| Baselines   | `vr-tests/confirmation.vr.spec.ts-snapshots/`         |

## Scope

The page a completed payment opens, in the one state it has.

## Cases

| ID    | Name               | Screenshot           | State captured                                            |
| ----- | ------------------ | -------------------- | --------------------------------------------------------- |
| VR-33 | Order confirmation | `confirmation-order` | The banner, the congratulations message, and both buttons |

## Notes

None: the case uses the project default threshold and no mask.

## Out of Scope

- Completing the payment form: covered by `payment-vr-test-plan.md`.
- The downloaded invoice's own content: not a rendering concern.
