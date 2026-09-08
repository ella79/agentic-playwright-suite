// spec: specs/test-plans/product-browsing-test-plan.md
import { expect, test } from "../../utils/fixtures/testFixtures";
import { ProductDetailPage, ProductsPage } from "../../utils/pageObjects";
import { products, searchTerms } from "../../utils/testData";

test.describe("Product browsing", () => {
  test("TC-07: the catalog lists products and one opens its detail page", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const productDetailPage = new ProductDetailPage(page);

    await productsPage.gotoProductsPage();
    await expect(productsPage.allProductsHeading).toBeVisible();
    expect(await productsPage.productCount()).toBeGreaterThan(0);

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
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.gotoProductsPage();
    await productsPage.searchFor(searchTerms.matching);

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    const names = await productsPage.productNames();

    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain(searchTerms.matching);
    }
  });

  test("TC-10: filtering by category lists that category's products", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.gotoProductsPage();
    await productsPage.openCategory("Women", "Tops");

    await expect(
      page.getByRole("heading", { name: /women\s*-\s*tops products/i }),
    ).toBeVisible();
    expect(await productsPage.productCount()).toBeGreaterThan(0);
  });

  test("TC-11: filtering by brand lists that brand's products", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.gotoProductsPage();
    await productsPage.openBrand("Polo");

    await expect(
      page.getByRole("heading", { name: /brand\s*-\s*polo products/i }),
    ).toBeVisible();
    expect(await productsPage.productCount()).toBeGreaterThan(0);
  });
});
