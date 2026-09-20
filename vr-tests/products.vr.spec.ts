// spec: specs/vr-test-plans/products-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { products, searchTerms } from "../utils/testData";

test.describe("Visual regression - Products Page", () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.gotoProductsPage();
  });

  test("VR-18: Special offer banner", async ({ productsPage }) => {
    await expect(productsPage.specialOfferBanner).toBeVisible();

    await expect(productsPage.specialOfferBanner).toHaveScreenshot(
      "products-special-offer.png",
    );
  });

  test("VR-19: Search results, matching", async ({ page, productsPage }) => {
    await productsPage.searchFor(products.menTshirt.name);
    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await productsPage.waitForImagesLoaded(productsPage.productGrid);

    const clip = await productsPage.searchResultsClip();
    await expect(page).toHaveScreenshot("products-search-results.png", {
      clip,
      maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
    });
  });

  test("VR-20: Search results, empty", async ({ page, productsPage }) => {
    await productsPage.searchFor(searchTerms.nonExistent);
    await expect(productsPage.searchedProductsHeading).toBeVisible();

    const clip = await productsPage.searchResultsClip();
    await expect(page).toHaveScreenshot("products-search-empty.png", {
      clip,
    });
  });
});
