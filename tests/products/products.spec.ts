// spec: specs/test-plans/products-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import {
  CatalogApiClient,
  type SearchProductBody,
} from "../../utils/apiClients/catalogApiClient";
import { products, searchTerms } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Products Page", () => {
  test("TC-13: The products page renders its catalog and special offer banner", async ({
    request,
    productsPage,
  }) => {
    await productsPage.gotoProductsPage();

    await expect(productsPage.productGrid).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();
    await expect(productsPage.specialOfferBanner).toBeVisible();
    await expect(productsPage.searchInput).toBeVisible();
    await expect(productsPage.searchButton).toBeVisible();

    await test.step("the rendered grid holds exactly the API's catalog", async () => {
      const catalog = await new CatalogApiClient(request).getProductsList();
      await expect(productsPage.productCards).toHaveCount(
        catalog.products.length,
      );
    });
  });

  test("TC-14: Searching for a product shows only matching results, and opening one reaches its detail page", async ({
    page,
    request,
    productsPage,
    productDetailPage,
  }) => {
    await test.step("search returns only matching results", async () => {
      await productsPage.gotoProductsPage();
      await productsPage.searchFor(products.menTshirt.name);

      await expect(productsPage.searchedProductsHeading).toBeVisible();
      await expect(
        productsPage.getProductCard(products.menTshirt.name),
      ).toBeVisible();
    });

    await test.step("the rendered results match the API's search response", async () => {
      const body = await new CatalogApiClient(request).searchProduct(
        products.menTshirt.name,
      );
      expect(body.responseCode).toBe(200);
      // Asserted above; narrows the union so `products` type-checks below.
      const found = body as Extract<SearchProductBody, { responseCode: 200 }>;
      await expect(productsPage.productCards).toHaveCount(
        found.products.length,
      );
    });

    await test.step("opening the result reaches its detail page", async () => {
      await productsPage.openProductDetail(products.menTshirt.name);

      await expect(page).toHaveURL(
        new RegExp(`${url.productDetail(products.menTshirt.id)}$`),
      );
      await expect(productDetailPage.productName).toHaveText(
        products.menTshirt.name,
      );
    });
  });

  test("TC-15: A search with no matches returns an empty result set", async ({
    productsPage,
  }) => {
    await productsPage.gotoProductsPage();
    await productsPage.searchFor(searchTerms.nonExistent);

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    // The catalog must not be silently returned when nothing matches.
    await expect(productsPage.productCards).toHaveCount(0);
  });
});
