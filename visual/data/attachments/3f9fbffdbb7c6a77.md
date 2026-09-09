# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/cart.vr.spec.ts >> Visual regression - cart >> VR-10: empty cart state
- Location: vr-tests/cart.vr.spec.ts:7:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Cart is empty!')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Cart is empty!') with timeout 5000ms
  - waiting for getByText('Cart is empty!')

```

```yaml
- text: Please wait while your request is being verified...
```

# Test source

```ts
  1  | // spec: specs/vr-test-plans/cart-vr-test-plan.md
  2  | import { expect, test } from "../utils/fixtures/testFixtures";
  3  | import { CartPage, ProductDetailPage } from "../utils/pageObjects";
  4  | import { products } from "../utils/testData";
  5  | 
  6  | test.describe("Visual regression - cart", () => {
  7  |   test("VR-10: empty cart state", async ({ page }) => {
  8  |     const cartPage = new CartPage(page);
  9  | 
  10 |     await cartPage.gotoCartPage();
> 11 |     await expect(cartPage.emptyCartMessage).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  12 | 
  13 |     await expect(cartPage.cartItemsSection).toHaveScreenshot("cart-empty.png");
  14 |   });
  15 | 
  16 |   test("VR-11: cart table holding one product", async ({ page }) => {
  17 |     const productDetailPage = new ProductDetailPage(page);
  18 |     const cartPage = new CartPage(page);
  19 | 
  20 |     await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  21 |     const modal = await productDetailPage.addToCart();
  22 |     await modal.viewCart();
  23 |     await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
  24 | 
  25 |     await cartPage.waitForImagesLoaded(cartPage.cartTable);
  26 | 
  27 |     await expect(cartPage.cartTable).toHaveScreenshot("cart-single-item.png", {
  28 |       maxDiffPixelRatio: 0.05, // VR: the row carries the product thumbnail
  29 |     });
  30 |   });
  31 | 
  32 |   test("VR-12: add-to-cart confirmation modal", async ({ page }) => {
  33 |     const productDetailPage = new ProductDetailPage(page);
  34 | 
  35 |     await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  36 |     const modal = await productDetailPage.addToCart();
  37 |     await expect(modal.heading).toBeVisible();
  38 | 
  39 |     await expect(modal.root).toHaveScreenshot("cart-added-modal.png");
  40 |   });
  41 | 
  42 |   test("VR-13: account guard shown to anonymous visitors", async ({ page }) => {
  43 |     const productDetailPage = new ProductDetailPage(page);
  44 |     const cartPage = new CartPage(page);
  45 | 
  46 |     await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  47 |     const addedModal = await productDetailPage.addToCart();
  48 |     await addedModal.viewCart();
  49 | 
  50 |     const guardModal = await cartPage.proceedToCheckoutAsGuest();
  51 |     await expect(guardModal.registerLoginLink).toBeVisible();
  52 | 
  53 |     await expect(guardModal.root).toHaveScreenshot(
  54 |       "cart-checkout-guard-modal.png",
  55 |     );
  56 |   });
  57 | });
  58 | 
```