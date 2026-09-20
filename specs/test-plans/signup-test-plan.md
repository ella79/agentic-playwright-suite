# Signup Test Plan

## Metadata

| Field        | Value                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| Page URL     | `/login`, `/signup`                                                                           |
| Page Title   | `Automation Exercise - Signup / Login`, `Automation Exercise - Signup`                        |
| Spec File    | `tests/signup/signup.spec.ts`                                                                |
| Page Object  | `utils/pageObjects/authentication/loginPage.ts`, `accountInfoPage.ts`, `confirmationPage.ts` |
| Precondition | Guest, for the whole file: creating an account starts from `/login`'s quick form, which the shared logged-in session every other functional spec depends on would redirect away from |

## Scope

The two-step account creation flow: `/login`'s quick Name/Email form, then `/signup`'s full Account
and Address Information forms, ending on the Account Created confirmation. Signing in to an account
that already exists is a separate concern, covered by `login-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- `test.use({ storageState: { cookies: [], origins: [] } })` at the top of the file: starting a
  signup navigates to the login page's quick form, which the shared logged-in session every other
  spec depends on would redirect away from.
- Both cases build their own account data with `buildAccount()`, since they test the creation and
  rejection of an account, not a precondition an existing one would satisfy. TC-13 additionally
  needs the `uniqueAccount` fixture, to have an already-registered email to collide with.

## Test Cases

| ID    | Name                                                             | Type  | Scenario                                                                                              | Expected                                                                                                                                            |
| ----- | ------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-12 | A new visitor completes signup end to end and lands signed in   | happy | A visitor starts signup with a name and email from the login page, completes the Account and Address Information forms on `/signup`, and submits | Account Created! and the congratulations message are shown; continuing lands back on the home page, signed in, with Logged in as \<name\> visible      |
| TC-13 | Signing up with an already registered email is rejected         | error | A visitor starts signup with the email of an account that already exists                              | An inline error says the email already exists; the visitor never reaches the Account Information form                                                |

## Locator Notes

- `/login` and `/signup` share no page title distinct enough to assert on alone in every case; TC-12
  asserts on the Account Information heading instead, which is unique to that step.
- The subscription form is shared markup with the home page: the same locator on `HomePage` (or a
  shared component) resolves on both, so it is not duplicated here.

## Out of Scope

- Signing in to an existing account: covered by `login-test-plan.md`.
- Anything a signed-in session does beyond the moment it is established: covered by the plan for
  whichever page that is.
