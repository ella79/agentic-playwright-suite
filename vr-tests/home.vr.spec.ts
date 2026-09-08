// spec: specs/vr-test-plans/visual-regression-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import { HomePage } from "../utils/pageObjects";

test.describe("Visual regression - home", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.gotoHomePage();
  });

  test("VR-01: site header for an anonymous visitor", async () => {
    await expect(homePage.signupLoginLink).toBeVisible();

    await expect(homePage.header).toHaveScreenshot("home-header-anonymous.png");
  });

  test("VR-02: featured products section", async () => {
    await homePage.featuresItemsHeading.scrollIntoViewIfNeeded();
    await expect(homePage.featuresItemsHeading).toBeVisible();

    await expect(homePage.featuresItemsSection).toHaveScreenshot(
      "home-features-items.png",
      { maxDiffPixelRatio: 0.05 }, // VR: product photography compresses inconsistently
    );
  });

  test("VR-03: footer newsletter block", async () => {
    await homePage.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionEmailInput).toBeVisible();

    await expect(homePage.footer).toHaveScreenshot("home-subscription.png");
  });
});
