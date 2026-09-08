// spec: specs/vr-test-plans/visual-regression-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import { products, searchTerms } from "../utils/testData";

test.describe("Visual regression - products", () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.gotoProductsPage();
    await expect(productsPage.allProductsHeading).toBeVisible();
  });

  test("VR-04: catalog grid", async ({ productsPage }) => {
    await expect(productsPage.productCards.first()).toBeVisible();

    await expect(productsPage.productGrid).toHaveScreenshot(
      "products-catalog-grid.png",
      { maxDiffPixelRatio: 0.05 }, // VR: product photography compresses inconsistently
    );
  });

  test("VR-05: single product card at rest", async ({ productsPage }) => {
    const card = productsPage.getProductCard(products.blueTop.name);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    await expect(card).toHaveScreenshot("products-card-default.png", {
      maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
    });
  });

  test("VR-06: category accordion", async ({ productsPage }) => {
    await expect(productsPage.categorySidebar).toBeVisible();

    await expect(productsPage.categorySidebar).toHaveScreenshot(
      "products-category-sidebar.png",
    );
  });

  test("VR-07: catalog area after a search with no matches", async ({
    productsPage,
  }) => {
    await productsPage.searchFor(searchTerms.nonExistent);
    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(productsPage.productCards).toHaveCount(0);

    await expect(productsPage.productGrid).toHaveScreenshot(
      "products-search-no-results.png",
    );
  });
});
