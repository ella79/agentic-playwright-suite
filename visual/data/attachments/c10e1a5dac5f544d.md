# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vr-tests/checkout.vr.spec.ts >> Visual regression - Checkout Page >> VR-28: Address details
- Location: vr-tests/checkout.vr.spec.ts:18:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Address Details' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Address Details' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Address Details' })

```

```yaml
- heading "This website is under heavy load (queue full)" [level=2]
- paragraph: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
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
> 19 |     await expect(checkoutPage.addressDetailsHeading).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
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
  50 |     await expect(page).toHaveScreenshot("checkout-order-review.png", {
  51 |       clip,
  52 |     });
  53 |   });
  54 | });
  55 | 
```