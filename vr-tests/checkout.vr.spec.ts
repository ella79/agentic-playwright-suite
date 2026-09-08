// spec: specs/vr-test-plans/visual-regression-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import {
  CartPage,
  CheckoutPage,
  PaymentPage,
  ProductDetailPage,
} from "../utils/pageObjects";
import { products } from "../utils/testData";

test.describe("Visual regression - checkout", () => {
  test.beforeEach(async ({ page, uniqueAccount: _uniqueAccount }) => {
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();
    await cartPage.proceedToCheckout();
  });

  test("VR-19: delivery and billing address blocks", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.addressDetailsHeading).toBeVisible();

    await expect(page.locator("#address_delivery")).toHaveScreenshot(
      "checkout-address-details.png",
      // VR: the block renders the registered account's generated details.
      { mask: [checkoutPage.deliveryAddress.locator("li")] },
    );
  });

  test("VR-20: card entry form", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    await checkoutPage.placeOrder();
    await expect(paymentPage.payButton).toBeVisible();

    await expect(paymentPage.paymentForm).toHaveScreenshot("payment-form.png");
  });
});
