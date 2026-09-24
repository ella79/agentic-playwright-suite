# Decisions

Architecture decision records for choices a reviewer would ask about. Each entry has a `Status`.
When a decision changes, the status is updated to `Reversed` or `Superseded`; the old text is not
rewritten to hide that it changed.

### 1. Shared authenticated storage state, except where the account's own lifecycle is the point

**Status:** Accepted, replacing full per-test isolation; amended by #7 for cases that change the
cart

**Context:** Every functional and visual case needs a signed-in user as a precondition. The original
approach gave every case its own throwaway account, to avoid two problems with sharing one: the
deletion test would destroy the session other tests depend on, and parallel workers would compete
over one identity. That cost a signup per case, including cases unrelated to signup or login.

**Decision:** `utils/setup/login.setup.ts` signs a shared account in once per run and saves the
result as `storageState`. Every functional and visual project depends on it and starts already
signed in. `login.spec.ts` and `signup.spec.ts`, the only cases that test the account's own
lifecycle, still use the `uniqueAccount` fixture: a fresh account registered, yielded, and removed
per test.

**Consequences:** Most cases no longer run a signup they do not need. The two problems the original
isolation avoided are now possible again, but only inside `login.spec.ts` and `signup.spec.ts`,
where `uniqueAccount` still isolates them.

**Verified:** `utils/setup/login.setup.ts` signs the shared account in and saves `storageState`;
read directly, 2026-09-21.

### 2. Deliver page objects to tests as fixtures, not constructed per test

**Status:** Reversed 2026-09-10

**Context:** Page objects were originally constructed inside each test, on the reasoning that a page
object is a vocabulary wrapping an application-specific API, while a fixture establishes environment
and owns teardown. Page objects here hold only locators and methods, so using a fixture for that
looked like the wrong mechanism for the job.

**Decision:** Deliver page objects to tests as fixtures instead, per
[Playwright's fixtures documentation](https://playwright.dev/docs/test-fixtures), which recommends
fixtures over `beforeEach` and shows page objects delivered that way.

**Consequences:** Removes the constructor call repeated in every test. The alternative to a fixture,
a `let` assigned in `beforeEach`, would share mutable state between tests with no teardown, so it was
not used either. Account setup is unaffected by this change: it still needs a user to exist before a
test starts and gone when it ends, which is environment, not a page object.

**Verified:** `utils/fixtures/testFixtures.ts` defines every page object as a fixture; read
directly, 2026-09-21.

### 3. Use Playwright's native screenshot assertions, no custom runtime

**Status:** Accepted

**Context:** A wrapper enforcing named capture strategies is worth its cost across hundreds of
visual tests. This suite has 33.

**Decision:** Call `toHaveScreenshot()` directly, with thresholds documented in the
`playwright-visual-regression` skill.

**Consequences:** Same guarantees, less code, no wrapper to maintain. Revisit if the visual suite
grows an order of magnitude.

**Verified:** 33 direct calls to `toHaveScreenshot()` across `vr-tests/`, thresholds set once in
`playwright.config.ts`, no wrapper function in `utils/pageObjects/` or `utils/fixtures/`; checked
2026-09-21.

### 4. Cap every baseline at the viewport height

**Status:** Accepted

**Context:** Two captures originally targeted the element holding the whole product catalog, which
measures 13,347 pixels tall. They failed intermittently under load, timing out on the stability check
rather than on any real visual difference. A baseline that size cannot be checked by looking at it.

**Decision:** No baseline may be taller than the viewport. Anchor the section heading to the top of
the viewport and capture the viewport instead.

**Consequences:** Both captures dropped from 2.8 MB to 412 KB and stopped failing under load.

**Verified:** the largest committed baseline today is 494 KB
(`home-add-to-cart-modal-vr-linux.png`), and the `scrollToTop` anchoring pattern is defined in
`baseAppPage.ts` and used in `home.vr.spec.ts`; checked 2026-09-21.

### 5. Run two MCP servers, one per job

**Status:** Accepted

**Context:** Authoring tests and exploring the live application are different jobs.

**Decision:** Configure two servers in `.mcp.json`: `playwright-test` for authoring, `playwright` for
exploration.

**Consequences:** Two servers to keep in sync with Playwright's CLI instead of one, but each job has
a purpose-built tool. The `playwright` server's `--browser chromium` argument was dropped from its
config on 2026-09-08 in favor of `--isolated`, `--test-id-attribute` and `--viewport-size`; the
commit that removed it does not record why.

**Verified:** `.mcp.json` defines both `playwright-test` and `playwright` exactly as described;
read directly, 2026-09-21.

### 6. Cap CI workers at two per suite

**Status:** Accepted

**Context:** The default worker count let one run open six browser instances against the shared demo
host at once. The two heaviest cases timed out while the same checkout passed on WebKit in that same
run.

**Decision:** Cap workers at two per suite in CI (`playwright.config.ts`).

**Consequences:** Later runs passed with roughly twelve instances against the same host, so its
capacity is variable rather than a fixed limit. The cap does not guarantee headroom, but it removes
the suite itself as a suspect when something times out.

**Verified:** `playwright.config.ts:51` reads `workers: process.env.CI ? 2 : undefined`; checked
2026-09-21.

### 7. Give each case that changes the cart an account of its own

**Status:** Accepted

**Context:** The cart belongs to the account, not to the test or the browser session. Through the
shared account of #1, every case in the cart, checkout, payment and confirmation files shared one
cart, and the functional and visual CI jobs run in parallel. VR-28 was flaky in 6 of its first 8
runs; in 2 of them the trace shows the cart empty seconds after `add_to_cart` answered 200, while
TC-18 (WebKit job) and TC-22 (Chromium job) were changing the same cart.

**Decision:** Each case in those 8 spec files gets an account created through the API
(`POST /api/createAccount`), signs into it through the login form, and has it deleted through the API
afterwards, with the deletion confirmed by `GET /api/getUserDetailByEmail`. The files are listed in
`utils/fixtures/testFixtures.ts`; the specs themselves are unchanged. Every other case keeps the
shared account of #1, which no remaining case reads the cart through.

**Consequences:** Parallel jobs, parallel workers and overlapping runs no longer share a cart. Each
of those cases pays for one API signup, one form login and one API deletion. A run cancelled mid-case
can leave that case's account on the demo host, as the API suite already can.

**Verified:** 2026-09-24, locally, cases in parallel, no retries. In the Linux image CI uses, VR-28
passed 10 of 11 runs, the one failure the demo host's own "under heavy load (queue full)" page; VR-29
passed 11 of 11, and every other cart capture passed. 4 of the 5 functional cases passed. TC-19 and
VR-27 failed locally on unchanged code too: their guest context has no third-party blocking, and
the consent dialog Google shows to EU visitors covers the page. CI runs from the US and does not
get it.

### 8. Create and delete throwaway accounts through the API, not the signup form

**Status:** Accepted

**Context:** `uniqueAccount` registered its account through the signup form and deleted it by
signing back in and opening `/delete_account`: about five pages to create, up to four to delete. In
run 241 three failed attempts, of TC-09 on WebKit and TC-12 on Chromium, were each a 503 from the demo
host on one of those pages (`POST /signup`, `GET /`, `GET /delete_account`); the tests' own steps had
passed. The signup is a precondition for TC-08, TC-09, TC-10 and TC-12, not what they prove: TC-11,
which proves signup, runs its own.

**Decision:** `uniqueAccount` creates the account with `POST /api/createAccount`, signs in through
the login form, the only way to a browser session, and deletes it with `DELETE /api/deleteAccount`,
confirmed by `GET /api/getUserDetailByEmail`. The same two steps serve the own accounts of #7.
Playwright's API testing guide describes this use: "Prepare server side state before visiting the
web application in a test".

**Consequences:** Each of those cases loads the login page and home instead of the signup flow, and
no page at all to clean up, so it is faster and offers the host fewer requests to shed. A 503 on
the requests that remain is still possible and still fails the case. TC-10, which deletes the
account through the UI because that is what it proves, is unchanged.

**Verified:** 2026-09-24, locally, no retries: the login, signup and checkout specs passed on
Chromium and WebKit, 14 of 14.

## Incidents

Bugs found during development. Not decisions; kept for reference.

| Symptom                                     | Actual cause                                                                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart empty after adding from the listing    | Adding is an XHR and navigating straight to the cart cancelled it. The page object now returns the confirmation modal, so callers have to wait for it                                                               |
| Review form filled the wrong field          | `getByPlaceholder` matches substrings, so "Email Address" also matched the footer's "Your email address"                                                                                                            |
| Five tests failing only under parallel load | The cart's controls are anchors without `href`, driven by the site's own JavaScript. A click landing before the handler binds is a silent no operation: Playwright reports success and the application does nothing |
| A visual case that could never pass         | The payment form ships Bootstrap 4 row markup against Bootstrap 3 CSS, so every row collapses to zero height. A defect in the application, recorded rather than worked around                                       |
| A visual case that asserted nothing         | The delivery address capture masked the element it was capturing. It would have passed against a blank block                                                                                                        |
