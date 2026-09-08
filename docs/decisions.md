# Decisions

The ones a reviewer would question, with the reasoning rather than only the outcome.

**No shared authenticated storage state.** The usual optimisation is to log in once and reuse the
session. That is right when login is an expensive OAuth redirect. Here it is a two field POST
against an account the suite has to create in the first place. Sharing one account would mean the
deletion test destroys the session every other test depends on, and parallel workers competing over
one identity. Isolation is worth more than the second it saves.

**Page objects are constructed, the account is a fixture.** The two solve different problems, and the
choice only makes sense once they are told apart.

A page object, in [the original definition of the pattern](https://martinfowler.com/bliki/PageObject.html),
"wraps an HTML page, or fragment, with an application specific API, allowing you to manipulate page
elements without digging around in the HTML". It is a vocabulary: it lets a test say what a person
does rather than which element is clicked.

A fixture, in [Playwright's own words](https://playwright.dev/docs/test-fixtures), exists "to
establish the environment for each test, giving the test everything it needs and nothing else", and
it owns both halves of that, the setup and the teardown, in one place.

The page objects here hold locators and methods and nothing else. There is no state to prepare
before one is used and nothing to clean up after, so turning each into a fixture would use an
environment mechanism to do a constructor's job. A spec builds the pages it works with, which is
also what [Playwright's page object guide](https://playwright.dev/docs/pom) does in its own
examples.

The account is the opposite case, and it is why the distinction matters. A test that needs a signed
in user needs that user to exist before it starts and to be gone when it ends, or every run leaves
another account behind on a public site. That is environment, so that is a fixture.

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
