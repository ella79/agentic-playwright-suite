# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/checkout.vr.spec.ts >> Visual regression - Checkout Page >> VR-29: Order review block
- Location: vr-tests/checkout.vr.spec.ts:38:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1140px by 310px, received 1140px by 268px. 5270 pixels (ratio 0.02 of all image pixels) are different.

  Snapshot: checkout-order-review.png

Call log:
  - Expect "toHaveScreenshot(checkout-order-review.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1140px by 310px, received 1140px by 268px. 5270 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1140px by 310px, received 1140px by 268px. 5270 pixels (ratio 0.02 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=f5e1]:
  - banner [ref=f5e2]:
    - generic [ref=f5e5]:
      - link [ref=f5e8] [cursor=pointer]:
        - /url: /
        - img "Website for automation practice" [ref=f5e9]
      - list [ref=f5e12]:
        - listitem [ref=f5e13]:
          - link " Home" [ref=f5e14] [cursor=pointer]:
            - /url: /
            - generic [ref=f5e15]: 
            - text: Home
        - listitem [ref=f5e16]:
          - link " Products" [ref=f5e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=f5e18]: 
            - text: Products
        - listitem [ref=f5e19]:
          - link " Cart" [ref=f5e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=f5e21]: 
            - text: Cart
        - listitem [ref=f5e22]:
          - link " Logout" [ref=f5e23] [cursor=pointer]:
            - /url: /logout
            - generic [ref=f5e24]: 
            - text: Logout
        - listitem [ref=f5e25]:
          - link " Delete Account" [ref=f5e26] [cursor=pointer]:
            - /url: /delete_account
            - generic [ref=f5e27]: 
            - text: Delete Account
        - listitem [ref=f5e28]:
          - link " Test Cases" [ref=f5e29] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=f5e30]: 
            - text: Test Cases
        - listitem [ref=f5e31]:
          - link " API Testing" [ref=f5e32] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=f5e33]: 
            - text: API Testing
        - listitem [ref=f5e34]:
          - link " Video Tutorials" [ref=f5e35] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=f5e36]: 
            - text: Video Tutorials
        - listitem [ref=f5e37]:
          - link " Contact us" [ref=f5e38] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=f5e39]: 
            - text: Contact us
        - listitem [ref=f5e40]:
          - generic [ref=f5e41]:
            - generic [ref=f5e42]: 
            - text: Logged in as Jon Doe
  - generic [ref=f5e44]:
    - list [ref=f5e46]:
      - listitem [ref=f5e47]:
        - link "Home" [ref=f5e48] [cursor=pointer]:
          - /url: /
      - listitem [ref=f5e49]: Checkout
    - heading "Address Details" [level=2] [ref=f5e51]
    - generic [ref=f5e53]:
      - list [ref=f5e55]:
        - listitem [ref=f5e56]:
          - heading "Your delivery address" [level=3] [ref=f5e57]
        - listitem [ref=f5e58]: Mr. Jon Doe
        - listitem [ref=f5e59]: Acme Inc.
        - listitem [ref=f5e60]: 123 Main Street
        - listitem
        - listitem [ref=f5e61]: Springfield Ontario A1A 1A1
        - listitem [ref=f5e62]: Canada
        - listitem [ref=f5e63]: 416-555-0123
      - list [ref=f5e65]:
        - listitem [ref=f5e66]:
          - heading "Your billing address" [level=3] [ref=f5e67]
        - listitem [ref=f5e68]: Mr. Jon Doe
        - listitem [ref=f5e69]: Acme Inc.
        - listitem [ref=f5e70]: 123 Main Street
        - listitem
        - listitem [ref=f5e71]: Springfield Ontario A1A 1A1
        - listitem [ref=f5e72]: Canada
        - listitem [ref=f5e73]: 416-555-0123
    - heading "Review Your Order" [level=2] [ref=f5e75]
    - table [ref=f5e77]:
      - rowgroup [ref=f5e78]:
        - row [ref=f5e79]:
          - cell "Item" [ref=f5e80]
          - cell "Description" [ref=f5e81]
          - cell "Price" [ref=f5e82]
          - cell "Quantity" [ref=f5e83]
          - cell "Total" [ref=f5e84]
          - cell [ref=f5e85]
      - rowgroup [ref=f5e86]:
        - row [ref=f5e87]:
          - cell [ref=f5e88]:
            - link [ref=f5e89] [cursor=pointer]:
              - /url: ""
              - img "Product Image" [ref=f5e90]
          - cell [ref=f5e91]:
            - heading [level=4] [ref=f5e92]:
              - link "Blue Top" [ref=f5e93] [cursor=pointer]:
                - /url: /product_details/1
            - paragraph [ref=f5e94]: Women > Tops
          - cell [ref=f5e95]:
            - paragraph [ref=f5e96]: Rs. 500
          - cell [ref=f5e97]:
            - button "1" [ref=f5e98] [cursor=pointer]
          - cell [ref=f5e99]:
            - paragraph [ref=f5e100]: Rs. 500
        - row [ref=f5e101]:
          - cell [ref=f5e102]
          - cell [ref=f5e103]
          - cell [ref=f5e104]:
            - heading "Total Amount" [level=4] [ref=f5e105]
          - cell [ref=f5e106]:
            - paragraph [ref=f5e107]: Rs. 500
    - generic [ref=f5e108]:
      - generic [ref=f5e109]: If you would like to add a comment about your order, please write it in the field below.
      - textbox [ref=f5e110]
    - link "Place Order" [ref=f5e112] [cursor=pointer]:
      - /url: /payment
  - contentinfo [ref=f5e113]:
    - generic [ref=f5e118]:
      - heading "Subscription" [level=2] [ref=f5e119]
      - generic [ref=f5e120]:
        - textbox "Your email address" [ref=f5e121]
        - button "" [ref=f5e122] [cursor=pointer]
        - paragraph [ref=f5e124]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=f5e128]: Copyright © 2021 All rights reserved
  - text: 
```

# Test source

```ts
  1  | // spec: specs/vr-test-plans/checkout-vr-test-plan.md
  2  | // seed: specs/seed.spec.ts
  3  | import { expect, test } from "../utils/fixtures/testFixtures";
  4  | import { products } from "../utils/testData";
  5  | import { url } from "../utils/url";
  6  | 
  7  | test.describe("Visual regression - Checkout Page", () => {
  8  |   test.beforeEach(async ({ page, cartPage, productDetailPage }) => {
  9  |     await cartPage.clearCart();
  10 |     await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  11 |     const modal = await productDetailPage.addToCart();
  12 |     await modal.viewCart();
  13 | 
  14 |     await cartPage.proceedToCheckout();
  15 |     await expect(page).toHaveURL(new RegExp(`${url.checkout}$`));
  16 |   });
  17 | 
  18 |   test("VR-28: Address details", async ({ page, checkoutPage }) => {
  19 |     await expect(checkoutPage.addressDetailsHeading).toBeVisible();
  20 |     await expect(checkoutPage.deliveryAddress).toBeVisible();
  21 |     await expect(checkoutPage.billingAddress).toBeVisible();
  22 | 
  23 |     // A clip spanning the "Address Details" heading and both address blocks,
  24 |     // not either block on its own: the two are read together on the real
  25 |     // page, and the values are the shared account's own fixed literal
  26 |     // defaults from `buildAccount()`, not per-run data, so nothing here needs
  27 |     // masking.
  28 |     const clip = await checkoutPage.unionBoundingBox([
  29 |       checkoutPage.addressDetailsHeading,
  30 |       checkoutPage.deliveryAddress,
  31 |       checkoutPage.billingAddress,
  32 |     ]);
  33 |     await expect(page).toHaveScreenshot("checkout-address-details.png", {
  34 |       clip,
  35 |     });
  36 |   });
  37 | 
  38 |   test("VR-29: Order review block", async ({ page, checkoutPage }) => {
  39 |     await expect(checkoutPage.orderReviewHeading).toBeVisible();
  40 |     await expect(checkoutPage.orderRows.first()).toBeVisible();
  41 |     await checkoutPage.orderTable.scrollIntoViewIfNeeded();
  42 | 
  43 |     // A clip spanning the "Review Your Order" heading and the table, not the
  44 |     // table alone: the heading is the table's own sibling, not its parent, so
  45 |     // no single locator's own box covers both.
  46 |     const clip = await checkoutPage.unionBoundingBox([
  47 |       checkoutPage.orderReviewHeading,
  48 |       checkoutPage.orderTable,
  49 |     ]);
> 50 |     await expect(page).toHaveScreenshot("checkout-order-review.png", {
     |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  51 |       clip,
  52 |     });
  53 |   });
  54 | });
  55 | 
```