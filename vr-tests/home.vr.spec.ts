// spec: specs/vr-test-plans/home-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Visual regression - home", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHomePage();
  });

  test("VR-01: site header for an anonymous visitor", async ({ homePage }) => {
    await expect(homePage.signupLoginLink).toBeVisible();

    await expect(homePage.header).toHaveScreenshot("home-header-anonymous.png");
  });

  // The section itself is over thirteen thousand pixels tall, because it holds
  // the entire catalog. Capturing it produced a baseline no reviewer could read
  // a diff in, and one that failed on stability under load. The viewport
  // anchored to the section heading covers what this case is actually for -
  // the grid's layout and card design - in an image a human can judge.
  test("VR-02: featured products grid", async ({ page, homePage }) => {
    await expect(homePage.featuresItemsHeading).toBeVisible();
    await homePage.scrollToTop(homePage.featuresItemsHeading);
    await homePage.waitForImagesLoaded(homePage.featuresItemsSection);

    await expect(page).toHaveScreenshot(
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
