# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/products.vr.spec.ts >> Visual regression - Products Page >> VR-20: Search results, empty
- Location: vr-tests/products.vr.spec.ts:31:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Searched Products' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Searched Products' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Searched Products' })

```

```yaml
- heading "This website is under heavy load (queue full)" [level=2]
- paragraph: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
```

# Test source

```ts
  1  | // spec: specs/vr-test-plans/products-vr-test-plan.md
  2  | // seed: specs/seed.spec.ts
  3  | import { expect, test } from "../utils/fixtures/testFixtures";
  4  | import { products, searchTerms } from "../utils/testData";
  5  | 
  6  | test.describe("Visual regression - Products Page", () => {
  7  |   test.beforeEach(async ({ productsPage }) => {
  8  |     await productsPage.gotoProductsPage();
  9  |   });
  10 | 
  11 |   test("VR-18: Special offer banner", async ({ productsPage }) => {
  12 |     await expect(productsPage.specialOfferBanner).toBeVisible();
  13 | 
  14 |     await expect(productsPage.specialOfferBanner).toHaveScreenshot(
  15 |       "products-special-offer.png",
  16 |     );
  17 |   });
  18 | 
  19 |   test("VR-19: Search results, matching", async ({ page, productsPage }) => {
  20 |     await productsPage.searchFor(products.menTshirt.name);
  21 |     await expect(productsPage.searchedProductsHeading).toBeVisible();
  22 |     await productsPage.waitForImagesLoaded(productsPage.productGrid);
  23 | 
  24 |     const clip = await productsPage.searchResultsClip();
  25 |     await expect(page).toHaveScreenshot("products-search-results.png", {
  26 |       clip,
  27 |       maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
  28 |     });
  29 |   });
  30 | 
  31 |   test("VR-20: Search results, empty", async ({ page, productsPage }) => {
  32 |     await productsPage.searchFor(searchTerms.nonExistent);
> 33 |     await expect(productsPage.searchedProductsHeading).toBeVisible();
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  34 | 
  35 |     const clip = await productsPage.searchResultsClip();
  36 |     await expect(page).toHaveScreenshot("products-search-empty.png", {
  37 |       clip,
  38 |     });
  39 |   });
  40 | });
  41 | 
```