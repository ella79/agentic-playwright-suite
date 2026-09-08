# Contact Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/contact.vr.spec.ts`.

## Scope

One capture. The contact form is the only layout on this page, and it is the application's only form
containing a file input, a control browsers render from their own styles, which makes it the most
likely thing on the page to shift after a browser or CSS change.

## Cases

| ID    | Screenshot     | State captured                                   |
| ----- | -------------- | ------------------------------------------------ |
| VR-17 | `contact-form` | Contact form, empty, including the file selector |

## Notes

Default threshold. The form is text, inputs and a button, so any pixel difference is a real one.

## Out of Scope

- The success state after submitting. The page renders that success text twice, once for the form
  and once for a hidden newsletter widget, a finding recorded in `STATUS.md`. Capturing it would
  bake the duplication into a baseline and make it look intentional.
