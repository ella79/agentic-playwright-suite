// spec: specs/vr-test-plans/home-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";

test.describe("Visual regression - Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.gotoHomePage();
  });

  test("VR-01: Hero section", async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
    // Otherwise Bootstrap's own auto-rotation can flip the resolved slide's
    // `.active` class mid-capture, since the carousel is not driven by CSS
    // animations and so isn't reached by Playwright's `animations: "disabled"`.
    await homePage.pauseHeroCarousel();

    await expect(homePage.heroSection).toHaveScreenshot("home-hero.png");
  });

  test("VR-02: Category sidebar", async ({ page, homePage }) => {
    await expect(homePage.categoryHeading).toBeVisible();
    await expect(homePage.categorySidebar).toBeVisible();

    // A clip, not an element screenshot: the heading is `#accordian`'s own
    // sibling, not its parent, so no single locator's own box covers both.
    const clip = await homePage.unionBoundingBox([
      homePage.categoryHeading,
      homePage.categorySidebar,
    ]);
    await expect(page).toHaveScreenshot("home-category-sidebar.png", {
      clip,
    });
  });

  test("VR-03: Category sidebar, expanded", async ({ page, homePage }) => {
    await expect(homePage.categoryHeading).toBeVisible();
    await homePage.getCategoryLink("Women").click();
    await expect(
      homePage.categorySidebar.locator("#Women").getByRole("link", {
        name: "Dress",
      }),
    ).toBeVisible();

    // A clip, not an element screenshot, and recomputed after expanding: the
    // panel's own height grows once "Women" opens, and the heading is still
    // `#accordian`'s sibling rather than its parent.
    const clip = await homePage.unionBoundingBox([
      homePage.categoryHeading,
      homePage.categorySidebar,
    ]);
    await expect(page).toHaveScreenshot("home-category-sidebar-expanded.png", {
      clip,
    });
  });

  test("VR-04: Brands sidebar", async ({ homePage }) => {
    await expect(homePage.brandsSidebar).toBeVisible();

    await expect(homePage.brandsSidebar).toHaveScreenshot(
      "home-brands-sidebar.png",
    );
  });

  test("VR-05: Featured product card", async ({ homePage }) => {
    const card = homePage.getProductCard(products.blueTop.name);
    await expect(card).toBeVisible();
    await homePage.waitForImagesLoaded(card);

    await expect(card).toHaveScreenshot("home-product-card.png", {
      maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
    });
  });

  test("VR-06: Recommended items section", async ({ homePage }) => {
    await expect(homePage.recommendedItemsHeading).toBeVisible();
    await homePage.scrollToTop(homePage.recommendedItemsHeading);
    await homePage.waitForImagesLoaded(homePage.recommendedItemsSection);

    await expect(homePage.recommendedItemsSection).toHaveScreenshot(
      "home-recommended-items.png",
      { maxDiffPixelRatio: 0.05 }, // VR: product photography compresses inconsistently
    );
  });

  test("VR-07: Subscription widget", async ({ homePage }) => {
    await homePage.subscriptionSection.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionHeading).toBeVisible();

    await expect(homePage.subscriptionSection).toHaveScreenshot(
      "home-subscription.png",
    );
  });

  test("VR-08: Subscription widget, subscribed", async ({ page, homePage }) => {
    // A fixed, literal email rather than `buildAccount()`: the field is not
    // cleared after success, so a per-run generated address would leave its
    // own text different on every capture.
    await homePage.subscribeToNewsletter("vr.subscriber@example.com");
    await expect(homePage.subscriptionSuccessMessage).toBeVisible({
      timeout: 15_000,
    });

    // A clip, not an element screenshot: the success banner (`#success-subscribe`)
    // is the widget's sibling, not its parent, so no single locator's own box
    // covers both. Verified live.
    const clip = await homePage.unionBoundingBox([
      homePage.subscriptionSuccessMessage,
      homePage.subscriptionSection,
    ]);
    await expect(page).toHaveScreenshot("home-subscription-success.png", {
      clip,
    });
  });

  test("VR-09: Footer bar", async ({ homePage }) => {
    await homePage.footerBottom.scrollIntoViewIfNeeded();
    await expect(homePage.copyrightText).toBeVisible();

    await expect(homePage.footerBottom).toHaveScreenshot("home-footer.png");
  });

  test("VR-10: Add-to-cart confirmation modal", async ({ page, homePage }) => {
    const modal = await homePage.addProductToCartFromListing(
      products.blueTop.id,
    );
    await expect(modal.heading).toBeVisible();

    await expect(page).toHaveScreenshot("home-add-to-cart-modal.png", {
      maxDiffPixelRatio: 0.03, // VR: full-page capture over the page's own product imagery
    });
  });
});
