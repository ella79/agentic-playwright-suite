# Contact Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/contact.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

Two captures, the two states this page has. The contact form is the application's only form
containing a file input, a control browsers render from their own styles, which makes it the most
likely thing on the page to shift after a browser or CSS change. The success state that replaces it
is the page's other layout and is not reachable from the empty one by CSS alone.

## Cases

| ID    | Screenshot        | State captured                                         |
| ----- | ----------------- | ------------------------------------------------------ |
| VR-18 | `contact-form`    | Contact form, empty, including the file selector       |
| VR-21 | `contact-success` | Success banner after submitting, the form column alone |

## Notes

Default threshold on both. The form is text, inputs and a button, so any pixel difference is a real
one, and nothing in either state varies per run, so neither capture masks anything.

**VR-21 is scoped to the `.contact-form` column.** Not `#contact-us-form`, which the page replaces
on submission and which does not exist in this state, and not `#contact-page`, which would drag the
Feedback sidebar into the frame. The column is the element that survives both states.

**VR-21 submits without the attachment.** The rendered success state is identical with or without a
file, and omitting it avoids a slow multipart POST to the demo host on every visual run. The
attachment path is exercised by TC-18 in the functional suite.

## Out of Scope

- Nothing further on this page. The duplicated success text in the DOM, once for the form and once
  for a hidden newsletter widget, was measured and does not affect this capture: the second node
  sits in `col-md-9 hide form-group`, measures 0 x 0 and never renders. The duplication is in the
  markup only and could not reach a baseline, which is why VR-21 captures the state rather than
  excluding it.
