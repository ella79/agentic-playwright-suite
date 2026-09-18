# Playwright Best Practices, and How This Repository Applies Them

Source material for the coding standard. Each entry quotes the guidance, names where it comes from,
and says what it means in this codebase. Where this repository departs from a recommendation, that
is stated rather than hidden.

Primary sources:

- [Playwright, best practices](https://playwright.dev/docs/best-practices)
- [Playwright, page object models](https://playwright.dev/docs/pom)
- [Playwright, fixtures](https://playwright.dev/docs/test-fixtures)
- [Martin Fowler, PageObject](https://martinfowler.com/bliki/PageObject.html)

## What a test should assert

> "Automated tests should verify that the application code works for the end users, and avoid
> relying on implementation details."

In practice: assert what a person can see. A cart row appearing, a heading changing, an error
message rendering. Never that a class was added or a handler ran.

> "Only test what you control. Don't try to test links to external sites or third party servers
> that you do not control."

This is why the shared fixture aborts advertising, analytics and consent hosts at the route level.
None of it is the product under test, and asserting on it would mean a test that fails when someone
else changes their code.

## Isolation

> "Each test should be completely isolated from another test and should run independently with its
> own local storage, session storage, data, cookies etc."

Playwright gives each test a fresh context for free. The part that is not free is server side data,
which is why an account is created and deleted per test rather than shared. Full reasoning in
`docs/decisions.md`.

## Locators

> "Use locators. Playwright's locators offer auto-waiting and retry-ability."

> "Prefer user-facing attributes. Your DOM can easily change so having your tests depend on your DOM
> structure can lead to failing tests."

> "Locators can be chained to narrow down the search to a particular part of the page."

The priority in `SKILL.md` follows from this: role, label, placeholder, text, then test id. Chaining
is why `BaseComponentPage` takes a root and resolves children inside it, so two modals sharing a
label cannot cross match.

The codegen recommendation, that the generator "will look at your page and figure out the best
locator, prioritizing role, text and test id locators", is the same ordering, arrived at by a tool
rather than by preference.

## Assertions

> "By using web first assertions Playwright will wait until the expected condition is met."

A web first assertion retries; a bare comparison does not. `expect(locator).toBeVisible()` waits,
`expect(await locator.count()).toBe(1)` reads once and fails on a race. The second form is an ESLint
error here.

Soft assertions exist, and "do not immediately terminate the test execution, but rather compile and
display a list of failed assertions". This repository does not use them: with one scenario per case,
the first failure is the finding, and continuing past it produces noise rather than information.

## Page objects

Fowler's original definition is the one worth keeping in mind:

> "A page object wraps an HTML page, or fragment, with an application-specific API, allowing you to
> manipulate page elements without digging around in the HTML."

Playwright's own guide describes the payoff as: page objects "simplify authoring by creating a
higher-level API which suits your application and simplify maintenance by capturing element
selectors in one place".

Note what neither says: that a page object should be a fixture. Playwright's fixtures page shows a
page object as one possible example, and its page object guide instantiates directly with `new`.
This repository constructs them, and reserves fixtures for what fixtures are for.

## Fixtures

> "Test fixtures are used to establish the environment for each test, giving the test everything it
> needs and nothing else."

The advantages listed are encapsulation of setup and teardown in one place, reuse across files, and
being on demand, so only what a test asks for is built. The account fixture is the case that fits:
it registers, yields, and removes, and only tests that ask for it pay the cost.

## Tooling

> "Lint your tests. Use TypeScript and ESLint to catch errors early."

Playwright's own guidance singles out `no-floating-promises`, which is why linting here is type
aware. A missing `await` on an assertion otherwise passes silently, and no runtime check catches it.

> "Use parallelism and sharding."

Applied with a caveat this project learned the hard way: the target is a shared public host, so
concurrency is budgeted rather than maximised. See `docs/pipeline.md`.

## Debugging

The guidance is to use the VS Code extension locally and the trace viewer for CI failures. This
repository records traces on first retry in CI and retains them on failure locally, and publishes
the merged report so a trace is reachable from the dashboard rather than only from an artifact.
