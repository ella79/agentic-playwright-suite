# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/cart.vr.spec.ts >> Visual regression - Cart Page >> VR-26: Cart, with a product
- Location: vr-tests/cart.vr.spec.ts:15:7

# Error details

```
Error: expect(locator).toHaveScreenshot(expected) failed

Locator: locator('#cart_info')
  Expected an image 1140px by 188px, received 1140px by 304px. 

  Snapshot: cart-with-item.png

Call log:
  - Expect "toHaveScreenshot(cart-with-item.png)" locator('#cart_info') with timeout 5000ms
    - verifying given screenshot expectation
  - waiting for locator('#cart_info')
    - locator resolved to <div id="cart_info" class="table-responsive cart_info">…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - Expected an image 1140px by 188px, received 1140px by 304px.
  - waiting 100ms before taking screenshot
  - waiting for locator('#cart_info')
    - locator resolved to <div id="cart_info" class="table-responsive cart_info">…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - captured a stable screenshot
  - Expected an image 1140px by 188px, received 1140px by 304px.

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - banner [ref=f2e2]:
    - generic [ref=f2e5]:
      - link [ref=f2e8] [cursor=pointer]:
        - /url: /
        - img "Website for automation practice" [ref=f2e9]
      - list [ref=f2e12]:
        - listitem [ref=f2e13]:
          - link " Home" [ref=f2e14] [cursor=pointer]:
            - /url: /
            - generic [ref=f2e15]: 
            - text: Home
        - listitem [ref=f2e16]:
          - link " Products" [ref=f2e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=f2e18]: 
            - text: Products
        - listitem [ref=f2e19]:
          - link " Cart" [ref=f2e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=f2e21]: 
            - text: Cart
        - listitem [ref=f2e22]:
          - link " Logout" [ref=f2e23] [cursor=pointer]:
            - /url: /logout
            - generic [ref=f2e24]: 
            - text: Logout
        - listitem [ref=f2e25]:
          - link " Delete Account" [ref=f2e26] [cursor=pointer]:
            - /url: /delete_account
            - generic [ref=f2e27]: 
            - text: Delete Account
        - listitem [ref=f2e28]:
          - link " Test Cases" [ref=f2e29] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=f2e30]: 
            - text: Test Cases
        - listitem [ref=f2e31]:
          - link " API Testing" [ref=f2e32] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=f2e33]: 
            - text: API Testing
        - listitem [ref=f2e34]:
          - link " Video Tutorials" [ref=f2e35] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=f2e36]: 
            - text: Video Tutorials
        - listitem [ref=f2e37]:
          - link " Contact us" [ref=f2e38] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=f2e39]: 
            - text: Contact us
        - listitem [ref=f2e40]:
          - generic [ref=f2e41]:
            - generic [ref=f2e42]: 
            - text: Logged in as Jon Doe
  - generic [ref=f2e44]:
    - list [ref=f2e46]:
      - listitem [ref=f2e47]:
        - link "Home" [ref=f2e48] [cursor=pointer]:
          - /url: /
      - listitem [ref=f2e49]: Shopping Cart
    - generic [ref=f2e50]: Proceed To Checkout
    - table [ref=f2e56]:
      - rowgroup [ref=f2e57]:
        - row [ref=f2e58]:
          - cell "Item" [ref=f2e59]
          - cell "Description" [ref=f2e60]
          - cell "Price" [ref=f2e61]
          - cell "Quantity" [ref=f2e62]
          - cell "Total" [ref=f2e63]
          - cell [ref=f2e64]
      - rowgroup [ref=f2e65]:
        - row [ref=f2e66]:
          - cell [ref=f2e67]:
            - link [ref=f2e68] [cursor=pointer]:
              - /url: ""
              - img "Product Image" [ref=f2e69]
          - cell [ref=f2e70]:
            - heading [level=4] [ref=f2e71]:
              - link "Men Tshirt" [ref=f2e72] [cursor=pointer]:
                - /url: /product_details/2
            - paragraph [ref=f2e73]: Men > Tshirts
          - cell [ref=f2e74]:
            - paragraph [ref=f2e75]: Rs. 400
          - cell [ref=f2e76]:
            - button "1" [ref=f2e77] [cursor=pointer]
          - cell [ref=f2e78]:
            - paragraph [ref=f2e79]: Rs. 400
          - cell "" [ref=f2e80]
        - row [ref=f2e83]:
          - cell [ref=f2e84]:
            - link [ref=f2e85] [cursor=pointer]:
              - /url: ""
              - img "Product Image" [ref=f2e86]
          - cell [ref=f2e87]:
            - heading [level=4] [ref=f2e88]:
              - link "Blue Top" [ref=f2e89] [cursor=pointer]:
                - /url: /product_details/1
            - paragraph [ref=f2e90]: Women > Tops
          - cell [ref=f2e91]:
            - paragraph [ref=f2e92]: Rs. 500
          - cell [ref=f2e93]:
            - button "1" [ref=f2e94] [cursor=pointer]
          - cell [ref=f2e95]:
            - paragraph [ref=f2e96]: Rs. 500
          - cell "" [ref=f2e97]
  - contentinfo [ref=f2e100]:
    - generic [ref=f2e105]:
      - heading "Subscription" [level=2] [ref=f2e106]
      - generic [ref=f2e107]:
        - textbox "Your email address" [ref=f2e108]
        - button "" [ref=f2e109] [cursor=pointer]
        - paragraph [ref=f2e111]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=f2e115]: Copyright © 2021 All rights reserved
  - text: 
```

# Test source

```ts
  1  | // spec: specs/vr-test-plans/cart-vr-test-plan.md
  2  | // seed: specs/seed.spec.ts
  3  | import { expect, test } from "../utils/fixtures/testFixtures";
  4  | import { CartPage, ProductDetailPage } from "../utils/pageObjects";
  5  | import { products } from "../utils/testData";
  6  | 
  7  | test.describe("Visual regression - Cart Page", () => {
  8  |   test("VR-25: Cart, empty", async ({ cartPage }) => {
  9  |     await cartPage.clearCart();
  10 |     await expect(cartPage.emptyCartMessage).toBeVisible();
  11 | 
  12 |     await expect(cartPage.cartItemsSection).toHaveScreenshot("cart-empty.png");
  13 |   });
  14 | 
  15 |   test("VR-26: Cart, with a product", async ({
  16 |     cartPage,
  17 |     productDetailPage,
  18 |   }) => {
  19 |     await cartPage.clearCart();
  20 |     await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  21 |     const modal = await productDetailPage.addToCart();
  22 |     await modal.viewCart();
  23 |     await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
  24 |     await cartPage.waitForImagesLoaded(cartPage.cartTable);
  25 | 
> 26 |     await expect(cartPage.cartTable).toHaveScreenshot("cart-with-item.png", {
     |                                      ^ Error: expect(locator).toHaveScreenshot(expected) failed
  27 |       maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
  28 |     });
  29 |   });
  30 | 
  31 |   test("VR-27: Checkout guard modal", async ({ browser }) => {
  32 |     // A second, anonymous context: this case proves the guest guard, which
  33 |     // the shared logged-in session every other spec depends on would never
  34 |     // reach.
  35 |     const guestContext = await browser.newContext({
  36 |       storageState: { cookies: [], origins: [] },
  37 |     });
  38 |     const guestPage = await guestContext.newPage();
  39 |     const guestProductDetail = new ProductDetailPage(guestPage);
  40 |     const guestCart = new CartPage(guestPage);
  41 | 
  42 |     await guestProductDetail.gotoProductDetailPage(products.blueTop.id);
  43 |     const modal = await guestProductDetail.addToCart();
  44 |     await modal.viewCart();
  45 | 
  46 |     const guardModal = await guestCart.proceedToCheckoutAsGuest();
  47 |     await expect(guardModal.message).toBeVisible();
  48 | 
  49 |     await expect(guestPage).toHaveScreenshot("cart-checkout-guard.png", {
  50 |       maxDiffPixelRatio: 0.03, // VR: full-page capture over the page's own product imagery
  51 |     });
  52 | 
  53 |     await guestContext.close();
  54 |   });
  55 | });
  56 | 
```