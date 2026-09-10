# Authentication Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/authentication.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

Two forms, and only forms. They are the application's densest layouts and they live on pages this
feature owns. The site header changes by session, but it is shared chrome rendered on every page
rather than an authentication screen, so both of its states are captured together in the home plan.

## Cases

| ID    | Screenshot                         | State captured                                            |
| ----- | ---------------------------------- | --------------------------------------------------------- |
| VR-14 | `authentication-login-form`        | Login form, empty                                         |
| VR-16 | `authentication-account-info-form` | Full registration form: title, dates, address, checkboxes |

## Notes

**VR-14 is scoped to its own form element**, not to the page, so a change to the signup form beside
it on `/login` cannot produce a diff in this baseline.

**VR-16 is the highest-value capture in this area.** It is the only form with select controls,
radio buttons and checkboxes together, which is exactly where a CSS regression lands.

## Retired

- **VR-15 `authentication-signup-form`, retired.** It captured the signup entry form on `/login`.
  Every visual element in it - heading, text inputs, button - appears identically in VR-14 on the
  same page under the same stylesheet, so a CSS regression that hit one would already show in the
  other. VR-16 covers the dense form, with selects, radios and checkboxes, where such a regression
  actually lands. The case was retired to free its slot under the cap of 20, not because the form
  stopped mattering; do not re-add it without an argument that VR-14 and VR-16 together miss
  something.

## Out of Scope

- The signed-in header: covered by VR-17 in the home plan, alongside the anonymous state it is read
  against.
- Filled and error states of these forms: the error message is text the functional suite asserts,
  and a filled form's appearance is the same layout with different characters.
- The account-created and account-deleted confirmation pages: both are a heading and a button, with
  no layout worth a baseline.
