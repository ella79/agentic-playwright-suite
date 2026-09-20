# Account API Test Plan

## Metadata

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| Base Path    | `/api`                                 |
| Client       | `utils/apiClients/accountApiClient.ts` |
| Spec File    | `api-tests/account.api.spec.ts`        |
| Precondition | None — pure API, no browser session    |

## Scope

The account lifecycle endpoints exercised directly against the API, with no UI equivalent:
creating, verifying login for, looking up, updating and deleting an account. `verifyLogin` in
particular cannot be exercised through the UI at all — it answers no `Set-Cookie` header and can
never establish a browser session on its own, so it has nothing for a UI case to stand in for.
Signing in through the actual login form is a separate concern, covered by `login-test-plan.md`.
This plan also covers the official API list at `/api_list` for this resource group in full: API 7
through API 14 there map to the cases below. `getUserDetailByEmail` is also called from inside two
UI cases as cross-validation, not duplicated here as its own case: `signup-test-plan.md`'s TC-11
confirms an account the UI created, and `login-test-plan.md`'s TC-10 confirms one the UI deleted.

## Preconditions

- Every case builds its own throwaway account with `buildAccount()` and removes it via
  `deleteAccount` in the same test, once its scenario no longer needs it, so no case depends on
  another and no account is left behind.
- This suite's own real-world quirk, verified live on 2026-09-20: every one of these endpoints
  answers HTTP 200 with the actual outcome inside the JSON body's `responseCode` field — 201, 400 or
  404 — even for a rejected request. This holds for the wrong-method case too, except for
  `createAccount`, which is the one endpoint in this group that genuinely raises a transport-level
  405 (API-04). Every other unsupported-method case here (API-17) answers HTTP 200 with
  `responseCode` 405 in the body instead — the two are not consistent with each other, so each case
  states what it actually verified rather than assuming the pattern generalizes.

## Test Cases

| ID     | Name                                                             | Type  | Method + Endpoint               | Scenario                                                                      | Expected                                                                                              |
| ------ | ---------------------------------------------------------------- | ----- | ------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| API-01 | Creating an account with valid data succeeds                     | happy | `POST /api/createAccount`       | A client submits every required field for a new account                       | `responseCode` 201 and "User created!"                                                                |
| API-02 | Creating an account with a required field missing is rejected    | error | `POST /api/createAccount`       | A client submits the form without `name`                                      | `responseCode` 400 naming the missing parameter                                                       |
| API-03 | Creating an account with an already-registered email is rejected | error | `POST /api/createAccount`       | A client submits the form again with an email that already exists             | `responseCode` 400 and "Email already exists!"                                                        |
| API-04 | An unsupported method on the account endpoint is rejected        | edge  | `GET /api/createAccount`        | A client calls the account endpoint with the wrong HTTP method                | HTTP 405, the one case in this plan where the status itself carries the outcome                       |
| API-05 | Verifying login with correct credentials succeeds                | happy | `POST /api/verifyLogin`         | A client submits a registered account's real email and password               | `responseCode` 200 and "User exists!"                                                                 |
| API-06 | Verifying login with an unregistered email is rejected           | error | `POST /api/verifyLogin`         | A client submits an email no account was ever created with                    | `responseCode` 404 and "User not found!"                                                              |
| API-07 | Looking up a user by email returns their profile                 | happy | `GET /api/getUserDetailByEmail` | A client looks up a registered account by its email                           | `responseCode` 200 and a user object naming the account                                               |
| API-08 | Deleting an account removes it, confirmed by a repeat lookup     | happy | `DELETE /api/deleteAccount`     | A client deletes a registered account, then looks it up again                 | The delete answers `responseCode` 200 and "Account deleted!"; the repeat lookup answers 404           |
| API-16 | Verifying login without an email is rejected                     | error | `POST /api/verifyLogin`         | A client submits the form with only a password                                | `responseCode` 400 naming the missing parameter                                                       |
| API-17 | An unsupported method on the verify login endpoint is rejected   | edge  | `DELETE /api/verifyLogin`       | A client calls verify login with the wrong HTTP method                        | HTTP 200 with `responseCode` 405 in the body — unlike `createAccount`, never a transport-level status |
| API-18 | Updating an account's details succeeds                           | happy | `PUT /api/updateAccount`        | A client submits every field again for a registered account, with one changed | `responseCode` 200 and "User updated!"; a repeat lookup reflects the change                           |
| API-19 | Updating an account with a required field missing is rejected    | error | `PUT /api/updateAccount`        | A client submits the form without `email`                                     | `responseCode` 400 naming the missing parameter                                                       |

## Client Notes

- `AccountApiClient` types `getUserDetailByEmail`'s result as a union on `responseCode`, since the
  200 and 404 shapes are structurally different (`user` versus `message`) — verified live.
- `createAccount` and `updateAccount` share the same field set, so the client builds the form once in
  a private `accountForm()` helper both call.

## Out of Scope

- Signing in through the login form itself: covered by `login-test-plan.md`.
- Creating an account through the UI's two-step signup flow: covered by `signup-test-plan.md`.
