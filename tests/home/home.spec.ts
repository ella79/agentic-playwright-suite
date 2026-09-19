// spec: specs/test-plans/home-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount } from "../../utils/testData";

test.describe("Home Page", () => {
  test("TC-20: A visitor can subscribe to the newsletter from the footer", async ({
    homePage,
  }) => {
    const subscriber = buildAccount();

    await homePage.gotoHomePage();
    await homePage.subscribeToNewsletter(subscriber.email);

    await expect(homePage.subscriptionSuccessMessage).toBeVisible();
  });
});
