# Signup Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- |
| Page URL    | `/login`, `/signup`                                                                          |
| Page Title  | `Automation Exercise - Signup / Login`, `Automation Exercise - Signup`                       |
| Spec File   | `vr-tests/signup.vr.spec.ts`                                                                 |
| Page Object | `utils/pageObjects/authentication/loginPage.ts`, `accountInfoPage.ts`, `confirmationPage.ts` |
| Baselines   | `vr-tests/signup.vr.spec.ts-snapshots/`                                                      |

## Scope

The account creation flow's own surfaces: the quick entry form, the two-part `/signup` form, its
rejected state, and the confirmation it ends on.

## Cases

| ID    | Name                         | Screenshot                | State captured                                                             |
| ----- | ---------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| VR-13 | Signup quick form, default   | `signup-quick-form`       | The "New User Signup!" title with name and email fields on `/login`, empty |
| VR-14 | Account Information form     | `signup-account-info`     | Title, name, email, password and date-of-birth fields                      |
| VR-15 | Address Information form     | `signup-address-info`     | First/last name through mobile number fields                               |
| VR-16 | Signup quick form, error     | `signup-quick-form-error` | The title with the inline "already exist" banner after a rejected attempt  |
| VR-17 | Account Created confirmation | `signup-confirmation`     | The banner, message and Continue button                                    |

## Notes

- VR-13 and VR-16 capture a clip spanning the heading and the form, not either one's own element
  box: the heading (`signupHeading`) is the form's sibling inside `.signup-form`, not its parent, so
  no single locator's own box covers both. Otherwise, every case uses the project default threshold
  and no mask.

## Out of Scope

- Signing in to an existing account: covered by `login-vr-test-plan.md`.
- The signed-in home page a successful signup lands on: covered by `home-vr-test-plan.md`.
