// spec: specs/vr-test-plans/visual-regression-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Visual regression - home", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHomePage();
  });

  test("VR-01: site header for an anonymous visitor", async ({ homePage }) => {
    await expect(homePage.signupLoginLink).toBeVisible();

    await expect(homePage.header).toHaveScreenshot("home-header-anonymous.png");
  });

  test("VR-02: featured products section", async ({ homePage }) => {
    await homePage.featuresItemsHeading.scrollIntoViewIfNeeded();
    await expect(homePage.featuresItemsHeading).toBeVisible();

    await expect(homePage.featuresItemsSection).toHaveScreenshot(
      "home-features-items.png",
      { maxDiffPixelRatio: 0.05 }, // VR: product photography compresses inconsistently
    );
  });

  test("VR-03: footer newsletter block", async ({ homePage }) => {
    await homePage.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionEmailInput).toBeVisible();

    await expect(homePage.footer).toHaveScreenshot("home-subscription.png");
  });
});
