# Contact Test Plan

## Scope

The contact form, including the file attachment it accepts. The page's appearance is covered by `specs/vr-test-plans/contact-vr-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- No account required.

## Test Cases

| ID    | Type  | Scenario                                              | Expected                                                                 |
| ----- | ----- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| TC-18 | happy | A visitor submits the contact form with an attachment | The success message is shown after the native confirm dialog is accepted |

## Locator Notes

- The success banner text is rendered twice, once for the form and once for a hidden newsletter
  widget, so the assertion scopes to the visible one.

## Out of Scope

- The newsletter widget sharing the page: it belongs to the home footer and is covered by TC-20.
