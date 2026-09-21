// spec: specs/vr-test-plans/checkout-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";
import { url } from "../utils/url";

test.describe("Visual regression - Checkout Page", () => {
  test.beforeEach(async ({ page, cartPage, productDetailPage }) => {
    await cartPage.clearCart();
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp(`${url.checkout}$`));
  });

  test("VR-28: Address details", async ({ page, checkoutPage }) => {
    await expect(checkoutPage.addressDetailsHeading).toBeVisible();
    await expect(checkoutPage.deliveryAddress).toBeVisible();
    await expect(checkoutPage.billingAddress).toBeVisible();

    // A clip spanning the "Address Details" heading and both address blocks,
    // not either block on its own: the two are read together on the real
    // page, and the values are the shared account's own fixed literal
    // defaults from `buildAccount()`, not per-run data, so nothing here needs
    // masking.
    const clip = await checkoutPage.unionBoundingBox([
      checkoutPage.addressDetailsHeading,
      checkoutPage.deliveryAddress,
      checkoutPage.billingAddress,
    ]);
    await expect(page).toHaveScreenshot("checkout-address-details.png", {
      clip,
    });
  });

  test("VR-29: Order review block", async ({ page, checkoutPage }) => {
    await expect(checkoutPage.orderReviewHeading).toBeVisible();
    await expect(checkoutPage.orderRows.first()).toBeVisible();
    await checkoutPage.orderTable.scrollIntoViewIfNeeded();

    // A clip spanning the "Review Your Order" heading and the table, not the
    // table alone: the heading is the table's own sibling, not its parent, so
    // no single locator's own box covers both.
    const clip = await checkoutPage.unionBoundingBox([
      checkoutPage.orderReviewHeading,
      checkoutPage.orderTable,
    ]);
    await expect(page).toHaveScreenshot("checkout-order-review.png", {
      clip,
    });
  });
});
