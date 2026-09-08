// Environment seed for Playwright's test agents.
//
// The planner runs this first to prove the environment initialises, and the
// generator uses it as the template every generated test starts from. It
// therefore has to demonstrate this project's setup, not just open a page:
// the shared fixture (which blocks third-party ad and consent traffic) and a
// page object rather than raw locators.
//
// It lives outside tests/ on purpose. Playwright's default is tests/seed.spec.ts,
// but this suite is capped at twenty functional cases and a bootstrap template
// is not coverage — inside tests/ it would run as a twenty-first case that
// exists only to serve the agents. It sits beside the plans it bootstraps
// instead, matched by name so the rest of specs/ stays Markdown.
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Seed", () => {
  test("storefront is reachable and rendered", async ({ homePage }) => {
    await homePage.gotoHomePage();

    await expect(homePage.featuresItemsHeading).toBeVisible();
  });
});
