// spec: specs/api-test-plans/catalog-api-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import {
  CatalogApiClient,
  type SearchProductBody,
} from "../utils/apiClients/catalogApiClient";
import { products, searchTerms } from "../utils/testData";

test.describe("Catalog API", () => {
  test("API-09: The products list returns every catalog product", async ({
    request,
  }) => {
    const client = new CatalogApiClient(request);

    const body = await client.getProductsList();

    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products).toContainEqual(
      expect.objectContaining({
        id: products.blueTop.id,
        name: products.blueTop.name,
      }),
    );
  });

  test("API-10: The brands list returns every catalog brand", async ({
    request,
  }) => {
    const client = new CatalogApiClient(request);

    const body = await client.getBrandsList();

    expect(body.responseCode).toBe(200);
    const brandNames = body.brands.map((brand) => brand.brand);
    for (const expected of [
      "Polo",
      "H&M",
      "Madame",
      "Mast & Harbour",
      "Babyhug",
      "Allen Solly Junior",
      "Kookie Kids",
      "Biba",
    ]) {
      expect(brandNames).toContain(expected);
    }
  });

  test("API-11: Searching returns only products matching the term", async ({
    request,
  }) => {
    const client = new CatalogApiClient(request);

    const body = await client.searchProduct(searchTerms.matching);

    expect(body.responseCode).toBe(200);
    // Asserted above; narrows the union so `products` type-checks below.
    const found = body as Extract<SearchProductBody, { responseCode: 200 }>;
    expect(found.products.length).toBeGreaterThan(0);
    for (const product of found.products) {
      const haystack =
        `${product.name} ${product.category.category}`.toLowerCase();
      expect(haystack).toContain(searchTerms.matching);
    }
  });

  test("API-12: Searching without a term is rejected", async ({ request }) => {
    const response = await request.post("/api/searchProduct");
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain("search_product parameter is missing");
  });

  test("API-13: An unsupported method on the search endpoint is rejected", async ({
    request,
  }) => {
    // Unlike the account endpoints, this one answers HTTP 200 with the real
    // outcome inside the body rather than a transport-level 405. Verified live.
    const response = await request.get("/api/searchProduct");
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(405);
  });

  test("API-14: An unsupported method on the products list endpoint is rejected", async ({
    request,
  }) => {
    // Same shape as searchProduct: HTTP 200 with the outcome in the body.
    const response = await request.post("/api/productsList");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
  });

  test("API-15: An unsupported method on the brands list endpoint is rejected", async ({
    request,
  }) => {
    const response = await request.put("/api/brandsList");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
  });
});
