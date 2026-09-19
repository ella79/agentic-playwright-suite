# Authentication Test Plan

## Metadata

| Field       | Value                                                                                                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page URL    | `/login`, `/signup`                                                                                                                                                                                  |
| Page Title  | `Automation Exercise - Signup / Login` on both routes                                                                                                                                                |
| Spec File   | `tests/authentication/authentication.spec.ts`                                                                                                                                                        |
| Page Object | `utils/pageObjects/authentication/loginPage.ts`, `utils/pageObjects/authentication/accountInfoPage.ts`, `utils/pageObjects/authentication/confirmationPage.ts`, `utils/pageObjects/home/homePage.ts` |

## Scope

Registration, login, logout, and account deletion. Covers the states a user can actually observe:
the signed-in navigation, the two rejection messages the application produces, and the confirmation
banners.

Not covered: password reset (the application does not implement one) and social login (absent).

## Preconditions

Seed: `specs/seed.spec.ts`

- The login route serves both the login form and the signup entry form; submitting the signup
  entry form lands on the full account form at `/signup`.
- Tests that need an existing account use the `uniqueAccount` fixture rather than a shared seed.

## Test Cases

| ID    | Name                                                        | Type  | Scenario                                                          | Expected                                                                               |
| ----- | ----------------------------------------------------------- | ----- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| TC-01 | a new visitor can register and lands in the signed-in state | happy | A new visitor registers with full account and address details     | The account created banner is shown and the navigation switches to the signed-in state |
| TC-02 | a registered user can sign in with valid credentials        | happy | A registered user signs in with valid credentials                 | `Logged in as <name>` appears in the navigation                                        |
| TC-03 | signing in with wrong credentials is rejected               | error | A user signs in with an unregistered email and wrong password     | `Your email or password is incorrect!` is shown and the URL stays on `/login`          |
| TC-04 | signing up with an already registered email is rejected     | error | A visitor starts signup with an email that already has an account | `Email Address already exist!` is shown and no account form is reached                 |
| TC-05 | a signed-in user can delete their account                   | happy | A signed-in user deletes their account                            | The account deleted banner is shown and the navigation returns to the anonymous state  |
| TC-06 | logging out returns the visitor to the anonymous state      | happy | A signed-in user logs out                                         | The navigation returns to the anonymous state and `/login` is served again             |

## Locator Notes

Confirmed during exploration:

- Login form: `data-qa` values `login-email`, `login-password`, `login-button`.
- Signup entry form: `signup-name`, `signup-email`, `signup-button`. The duplicate `Email Address`
  placeholder on this page is why `data-qa` is preferred over `getByPlaceholder` here.
- Account form: `data-qa` on every field; the title radios expose values but no accessible name.
- Confirmation headings are uppercased in CSS, so matching is case-insensitive.
- `/delete_account` deletes on GET with no confirmation step.

## Out of Scope

- Field-level client validation. The application relies on the browser's native `required`
  handling, which tests the browser rather than the product.
