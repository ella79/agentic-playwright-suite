# Login Test Plan

## Metadata

| Field        | Value                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| Page URL     | `/login`                                                                                      |
| Page Title   | `Automation Exercise - Signup / Login`                                                       |
| Spec File    | `tests/login/login.spec.ts`                                                                  |
| Page Object  | `utils/pageObjects/authentication/loginPage.ts`                                              |
| Precondition | Guest, for the whole file: every case here proves something about the guest/signed-in boundary itself, which the shared logged-in session every other functional spec depends on would redirect away from |

## Scope

The signed-in session's lifecycle from the login form's side: signing in with valid and invalid
credentials, logging out, and deleting the signed-in account. Creating a new account is a separate
concern, covered by `signup-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- `test.use({ storageState: { cookies: [], origins: [] } })` at the top of the file: signing in and
  signing out both need to start from an anonymous context, which the shared logged-in session every
  other spec depends on would redirect away from.
- TC-08 builds its own throwaway account with `buildAccount()` directly, since it tests rejected
  login, not a precondition an existing account would satisfy.
- TC-09, TC-10 and TC-11 take the `uniqueAccount` fixture, which registers a throwaway account before
  the test and deletes it afterwards.

## Test Cases

| ID    | Name                                                                    | Type  | Scenario                                                       | Expected                                                                                    |
| ----- | ---------------------------------------------------------------------- | ----- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| TC-08 | Signing in with wrong credentials is rejected                          | error | A visitor attempts to sign in with an email that is not registered | An inline error is shown; the visitor stays on `/login`, not signed in                       |
| TC-09 | A registered user can sign in with valid credentials                   | happy | A visitor signs in with a registered email and its correct password | The visitor lands signed in, with Logged in as \<name\> visible                                |
| TC-10 | Logging out returns the visitor to the guest state                     | happy | A signed-in visitor logs out                                    | The visitor lands on `/login`; the header no longer offers Logout                            |
| TC-11 | A signed-in user can delete their account, with the deletion confirmed | happy | A signed-in visitor deletes their account and continues past the confirmation | Account Deleted! and "Your account has been permanently deleted!" are shown; continuing lands on the home page, back in the guest state |

## Locator Notes

- The subscription form is shared markup with the home page: the same locator on `HomePage` (or a
  shared component) resolves on both, so it is not duplicated here.

## Out of Scope

- Creating a new account: covered by `signup-test-plan.md`.
- Anything a signed-in session does beyond the moment it is established: covered by the plan for
  whichever page that is.
- The checkout guard a guest meets when trying to check out unauthenticated: covered by
  `view-cart-test-plan.md`, since the guest is the one filling the cart, not authenticating.
