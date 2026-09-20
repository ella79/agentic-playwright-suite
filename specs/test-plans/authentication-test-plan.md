# Authentication Test Plan

## Metadata

| Field        | Value                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------ |
| Page URL     | `/login`, `/signup`                                                                              |
| Page Title   | `Automation Exercise - Signup / Login`, `Automation Exercise - Signup`                           |
| Spec File    | `tests/authentication/authentication.spec.ts`                                                    |
| Page Object  | `utils/pageObjects/authentication/loginPage.ts`, `accountInfoPage.ts`, `confirmationPage.ts`     |
| Precondition | Guest, for the whole file: every case here proves something about the guest/signed-in boundary itself, which the shared logged-in session every other functional spec depends on would redirect away from |

## Scope

The two-step signup flow (`/login`'s quick Name/Email form, then `/signup`'s full Account and Address
Information forms), sign-in with valid and invalid credentials, rejecting a duplicate signup email,
logging out, and deleting the signed-in account. Everything downstream of a successful login or
signup — what a signed-in visitor can then do — belongs to the plan for that page.

## Preconditions

Seed: `specs/seed.spec.ts`

- `test.use({ storageState: { cookies: [], origins: [] } })` at the top of the file: `uniqueAccount`
  performs its own signup through the login page, which the shared logged-in session every other
  spec depends on would redirect away from before the form is ever reached.
- TC-07, TC-08 and TC-10 build their own throwaway account with `buildAccount()` directly, since they
  test signup and rejected login, not a precondition an existing account would satisfy.
- TC-09, TC-11 and TC-12 take the `uniqueAccount` fixture, which registers a throwaway account before
  the test and deletes it afterwards.

## Test Cases

| ID    | Name                                                                          | Type  | Scenario                                                                                              | Expected                                                                                                                                                                                     |
| ----- | -------------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-07 | A new visitor completes signup end to end and lands signed in                | happy | A visitor starts signup with a name and email from the login page, completes the Account and Address Information forms on `/signup`, and submits | Account Created! and the congratulations message are shown; continuing lands back on the home page, signed in, with Logged in as \<name\> visible                                              |
| TC-08 | Signing up with an already registered email is rejected                      | error | A visitor starts signup with the email of an account that already exists                              | An inline error says the email already exists; the visitor never reaches the Account Information form                                                                                       |
| TC-09 | A registered user can sign in with valid credentials                         | happy | A visitor signs in with a registered email and its correct password                                    | The visitor lands signed in, with Logged in as \<name\> visible                                                                                                                                |
| TC-10 | Signing in with wrong credentials is rejected                                | error | A visitor attempts to sign in with an email that is not registered                                     | An inline error is shown; the visitor stays on `/login`, not signed in                                                                                                                       |
| TC-11 | Logging out returns the visitor to the guest state                           | happy | A signed-in visitor logs out                                                                            | The visitor lands on `/login`; the header no longer offers Logout                                                                                                                            |
| TC-12 | A signed-in user can delete their account, with the deletion confirmed       | happy | A signed-in visitor deletes their account and continues past the confirmation                          | Account Deleted! and "Your account has been permanently deleted!" are shown; continuing lands on the home page, back in the guest state                                                     |

## Locator Notes

- The subscription form is shared markup with the home page: the same locator on `HomePage` (or a
  shared component) resolves on both, so it is not duplicated here.
- `/login` and `/signup` share no page title distinct enough to assert on alone in every case; TC-07
  asserts on the Account Information heading instead, which is unique to that step.

## Out of Scope

- Anything a signed-in session does beyond the moment it is established: covered by the plan for
  whichever page that is.
- The checkout guard a guest meets when trying to check out unauthenticated: covered by
  `cart-test-plan.md`, since the guest is the one filling the cart, not authenticating.
