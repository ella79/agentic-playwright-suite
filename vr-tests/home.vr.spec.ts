// spec: specs/vr-test-plans/home-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Visual regression - home", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHomePage();
  });

  test("VR-01: site header for an anonymous visitor", async ({ homePage }) => {
    await expect(homePage.signupLoginLink).toBeVisible();

    await expect(homePage.header).toHaveScreenshot("home-header-anonymous.png");
  });

  // The section holds the whole catalog and is 13k px tall. The viewport
  // anchored to its heading is the only framing a reviewer can read a diff in.
  test("VR-02: featured products grid", async ({ page, homePage }) => {
    await expect(homePage.featuresItemsHeading).toBeVisible();
    await homePage.scrollToTop(homePage.featuresItemsHeading);
    await homePage.waitForImagesLoaded(homePage.featuredProductsGrid);

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

  test("VR-17: site header for a signed-in user", async ({
    homePage,
    uniqueAccount,
  }) => {
    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);

    await expect(homePage.header).toHaveScreenshot(
      "home-header-signed-in.png",
      {
        mask: [homePage.loggedInAs], // the account name differs per run
      },
    );
  });
});
