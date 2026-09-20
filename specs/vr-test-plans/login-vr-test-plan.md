# Login Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                           |
| ----------- | ----------------------------------------------- |
| Page URL    | `/login`                                        |
| Page Title  | `Automation Exercise - Signup / Login`          |
| Spec File   | `vr-tests/login.vr.spec.ts`                     |
| Page Object | `utils/pageObjects/authentication/loginPage.ts` |
| Baselines   | `vr-tests/login.vr.spec.ts-snapshots/`          |

## Scope

The login form's own two states: default and rejected. The signup half of this same page is a
different visual surface, covered by `signup-vr-test-plan.md`.

## Cases

| ID    | Name                | Screenshot      | State captured                                                                    |
| ----- | ------------------- | --------------- | --------------------------------------------------------------------------------- |
| VR-11 | Login form, default | `login-default` | The "Login to your account" title with email and password fields, empty, no error |
| VR-12 | Login form, error   | `login-error`   | The title with the inline "incorrect" banner after a rejected attempt             |

## Notes

- Both cases capture a clip spanning the heading and the form, not either one's own element box: the
  heading (`loginHeading`) is the form's sibling inside `.login-form`, not its parent, so no single
  locator's own box covers both. Otherwise, both use the project default threshold and no mask.

## Out of Scope

- The signup form sharing this page: covered by `signup-vr-test-plan.md`.
- Successful login: it navigates away immediately, leaving nothing distinct to capture on this page.
