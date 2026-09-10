# Engagement Test Plan

## Scope

The three ways a visitor sends something back to the site: the contact form, a product review, and
the newsletter subscription. All three are forms whose only observable outcome is a success
message, so each test asserts that message rather than any internal state.

## Preconditions

Seed: `specs/seed.spec.ts`

- No account required for any of these flows.
- The contact form test uploads a fixture file from `utils/fixtures/files/`.

## Test Cases

| ID    | Type  | Scenario                                               | Expected                                                                 |
| ----- | ----- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| TC-18 | happy | A visitor submits the contact form with an attachment  | The success message is shown after the native confirm dialog is accepted |
| TC-19 | happy | A visitor submits a review on a product detail page    | The thank-you message is shown                                           |
| TC-20 | happy | A visitor subscribes to the newsletter from the footer | The subscription success message is shown                                |

## Locator Notes

- Contact form fields expose `data-qa`; the file input does not and is matched by its `name`.
- Submitting the contact form raises a **native confirm dialog** before the request is sent. The
  page object registers a one-shot dialog handler; without it the test hangs on the click.
- The review form fields are matched by placeholder, unlike the login page, these placeholders are
  unique on the product detail page.
- The newsletter submit control is icon-only.

## Out of Scope

- Duplicate subscription handling: the application returns the same success message either way,
  so there is nothing observable to assert.
- Whether the message is actually delivered: not verifiable from the UI.
