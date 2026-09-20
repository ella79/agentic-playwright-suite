# Contact Test Plan

## Metadata

| Field        | Value                                        |
| ------------ | --------------------------------------------- |
| Page URL     | `/contact_us`                                |
| Page Title   | `Automation Exercise - Contact Us`           |
| Spec File    | `tests/contact/contact.spec.ts`              |
| Page Object  | `utils/pageObjects/contact/contactUsPage.ts` |
| Precondition | Login (shared account)                       |

## Scope

The contact form, including the file attachment it accepts. The page's appearance is covered by `specs/vr-test-plans/contact-vr-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- Precondition: Login (shared account). Nothing here interacts with the account; it is simply
  whatever state the shared session leaves it in.

## Test Cases

| ID    | Name                                                  | Type  | Scenario                                              | Expected                                                                 |
| ----- | ----------------------------------------------------- | ----- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| TC-18 | The contact form accepts a message with an attachment | happy | A visitor submits the contact form with an attachment | The success message is shown after the native confirm dialog is accepted |

## Locator Notes

- The success banner text is rendered twice, once for the form and once for a hidden newsletter
  widget, so the assertion scopes to the visible one.

## Out of Scope

- The newsletter widget sharing the page: it belongs to the home footer and is covered by TC-20.
