// spec: specs/test-plans/product-browsing-test-plan.md
import { expect, test } from "../../utils/fixtures/testFixtures";
import { products, searchTerms } from "../../utils/testData";

test.describe("Product browsing", () => {
  test("TC-07: the catalog lists products and one opens its detail page", async ({
    productsPage,
    productDetailPage,
  }) => {
    await productsPage.gotoProductsPage();
    await expect(productsPage.allProductsHeading).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();

    await productsPage.openProductDetail(products.blueTop.name);

    await expect(productDetailPage.productName).toHaveText(
      products.blueTop.name,
    );
    await expect(productDetailPage.productPrice).toHaveText(
      products.blueTop.price,
    );
    await expect(productDetailPage.availability).toContainText("In Stock");
  });

  test("TC-08: search returns only products matching the term", async ({
    productsPage,
  }) => {
    await productsPage.gotoProductsPage();
    await productsPage.searchFor(searchTerms.matching);

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    const names = await productsPage.productNames();

    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain(searchTerms.matching);
    }
  });

  test("TC-09: a search with no matches returns an empty result set", async ({
    productsPage,
  }) => {
    await productsPage.gotoProductsPage();
    await productsPage.searchFor(searchTerms.nonExistent);

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    // The catalog must not be silently returned when nothing matches.
    await expect(productsPage.productCards).toHaveCount(0);
  });

  test("TC-10: filtering by category lists that category's products", async ({
    productsPage,
  }) => {
    await productsPage.gotoProductsPage();
    await productsPage.openCategory("Women", "Tops");

    await expect(
      productsPage.getCategoryResultsHeading("Women", "Tops"),
    ).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();
  });

  test("TC-11: filtering by brand lists that brand's products", async ({
    productsPage,
  }) => {
    await productsPage.gotoProductsPage();
    await productsPage.openBrand("Polo");

    await expect(productsPage.getBrandResultsHeading("Polo")).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();
  });
});
