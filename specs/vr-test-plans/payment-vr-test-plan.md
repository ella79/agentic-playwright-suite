# Payment Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                       |
| ----------- | ------------------------------------------- |
| Page URL    | `/payment`                                  |
| Page Title  | `Automation Exercise - Payment`             |
| Spec File   | `vr-tests/payment.vr.spec.ts`               |
| Page Object | `utils/pageObjects/checkout/paymentPage.ts` |
| Baselines   | `vr-tests/payment.vr.spec.ts-snapshots/`    |

## Scope

The payment form's own three states: empty, filled, and rejected by the browser's own field
validation.

## Cases

| ID    | Name                     | Screenshot                | State captured                                                                      |
| ----- | ------------------------ | ------------------------- | ----------------------------------------------------------------------------------- |
| VR-30 | Payment form, default    | `payment-form-default`    | The "Payment" title with Name on Card, Card Number, CVC and Expiration, empty       |
| VR-31 | Payment form, filled     | `payment-form-filled`     | The title with every field holding the fixed test card's details                    |
| VR-32 | Payment form, validation | `payment-form-validation` | The title with the native "Please fill out this field" bubble after an empty submit |

## Notes

- Every case captures a clip spanning the "Payment" heading and the form, not either one's own
  element box: the heading is a full-width wizard-step title, not an ancestor of the narrower form
  column beneath it, so no single locator's own box covers both.
- VR-31 uses the same fixed literal card (`paymentCard` in `utils/testData.ts`) the functional suite
  submits with, and never submits it here, so nothing is created and the fields' own text stays the
  same on every run.
- VR-32 exists because the skill's own guidance calls it out directly: a native validation bubble
  does appear in a Playwright screenshot and does persist, which is worth capturing precisely because
  it is easy to assume otherwise.

## Out of Scope

- Reaching this page from checkout: a navigation, not a rendering difference.
- The confirmation page a successful submission opens: covered by `confirmation-vr-test-plan.md`.
