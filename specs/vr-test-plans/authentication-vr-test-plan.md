# Authentication Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/auth.vr.spec.ts`.

## Scope

Three forms and one header state. The forms are the application's densest layouts, and the signed-in
header is the one piece of chrome that differs by session, the anonymous version is covered in the
home plan, so this pair is what proves the header actually changes.

## Cases

| ID    | Screenshot               | State captured                                            |
| ----- | ------------------------ | --------------------------------------------------------- |
| VR-14 | `auth-login-form`        | Login form, empty                                         |
| VR-15 | `auth-signup-form`       | Signup entry form, empty                                  |
| VR-16 | `auth-account-info-form` | Full registration form: title, dates, address, checkboxes |
| VR-17 | `auth-header-signed-in`  | Site header showing Logout, Delete Account, and the name  |

## Notes

**VR-14 and VR-15 are separate captures of one page.** Both forms sit side by side on `/login`, and
each is scoped to its own form element so a change to one cannot produce a diff in the other's
baseline.

**VR-16 is the highest-value capture in this area.** It is the only form with select controls,
radio buttons and checkboxes together, which is exactly where a CSS regression lands.

**VR-17 needs a registered account**, so it requests `uniqueAccount`. The account name appears in
the header, and the fixture generates it per run, the capture is scoped to the header, and the
name's width varies only within the fixed-format string the generator produces.

## Out of Scope

- Filled and error states of these forms: the error message is text the functional suite asserts,
  and a filled form's appearance is the same layout with different characters.
- The account-created and account-deleted confirmation pages: both are a heading and a button, with
  no layout worth a baseline.
