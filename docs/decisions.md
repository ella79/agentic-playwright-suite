# Decisions

Architecture decision records for choices a reviewer would ask about. Each entry has a `Status`.
When a decision changes, the status is updated to `Reversed` or `Superseded`; the old text is not
rewritten to hide that it changed.

### 1. Shared authenticated storage state, except where the account's own lifecycle is the point

**Status:** Accepted, replacing full per-test isolation

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

## Incidents

Bugs found during development. Not decisions; kept for reference.

| Symptom                                     | Actual cause                                                                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart empty after adding from the listing    | Adding is an XHR and navigating straight to the cart cancelled it. The page object now returns the confirmation modal, so callers have to wait for it                                                               |
| Review form filled the wrong field          | `getByPlaceholder` matches substrings, so "Email Address" also matched the footer's "Your email address"                                                                                                            |
| Five tests failing only under parallel load | The cart's controls are anchors without `href`, driven by the site's own JavaScript. A click landing before the handler binds is a silent no operation: Playwright reports success and the application does nothing |
| A visual case that could never pass         | The payment form ships Bootstrap 4 row markup against Bootstrap 3 CSS, so every row collapses to zero height. A defect in the application, recorded rather than worked around                                       |
| A visual case that asserted nothing         | The delivery address capture masked the element it was capturing. It would have passed against a blank block                                                                                                        |
