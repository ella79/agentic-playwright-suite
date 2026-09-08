# Decisions

The ones a reviewer would question, with the reasoning rather than only the outcome.

**No shared authenticated storage state.** The usual optimisation is to log in once and reuse the
session. That is right when login is an expensive OAuth redirect. Here it is a two field POST
against an account the suite has to create in the first place. Sharing one account would mean the
deletion test destroys the session every other test depends on, and parallel workers competing over
one identity. Isolation is worth more than the second it saves.

**Page objects are not fixtures.** Playwright's documentation shows a page object as one possible
fixture example, but its page object guide instantiates directly, and a fixture earns its place when
it owns setup and teardown rather than when it wraps an empty constructor. Specs construct what they
use. The account, which has a real lifecycle, stays a fixture.

**No custom screenshot runtime.** A wrapper enforcing named capture strategies pays for itself
across hundreds of visual tests. Across twenty it is indirection with nobody to pay for it. Native
`toHaveScreenshot()` with documented thresholds does the same work in less code.

**No baseline taller than the viewport.** Two captures originally targeted the element holding the
whole catalog, which measures 13,347 pixels. They failed intermittently under load, timing out on
the stability check rather than on any visual difference. Raising the timeout would have hidden the
more important half: nobody scans thirteen thousand pixels for the four that changed, so those cases
could only ever be rubber stamped. Both now anchor the section heading to the top of the viewport
and capture the viewport, at 412 KB instead of 2.8 MB.

**Two MCP servers, for two jobs.** Verifying that the second one actually starts caught a real error
in the first configuration: `--browser chromium` is not a valid value, so the server would have
failed on launch while the configuration looked plausible.

## What Broke While Building This

Kept because the failures are more informative than the passes.

| Symptom                                     | Actual cause                                                                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart empty after adding from the listing    | Adding is an XHR and navigating straight to the cart cancelled it. The page object now returns the confirmation modal, so callers have to wait for it                                                               |
| Review form filled the wrong field          | `getByPlaceholder` matches substrings, so "Email Address" also matched the footer's "Your email address"                                                                                                            |
| Five tests failing only under parallel load | The cart's controls are anchors without `href`, driven by the site's own JavaScript. A click landing before the handler binds is a silent no operation: Playwright reports success and the application does nothing |
| A visual case that could never pass         | The payment form ships Bootstrap 4 row markup against Bootstrap 3 CSS, so every row collapses to zero height. A defect in the application, recorded rather than worked around                                       |
| A visual case that asserted nothing         | The delivery address capture masked the element it was capturing. It would have passed against a blank block                                                                                                        |
