// spec: specs/vr-test-plans/checkout-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import {
  CartPage,
  CheckoutPage,
  PaymentPage,
  ProductDetailPage,
} from "../utils/pageObjects";
import { products } from "../utils/testData";

test.describe("Visual regression - checkout", () => {
  // uniqueAccount is requested for its side effect: both captures are only
  // reachable once an account exists and is signed in.
  test.beforeEach(async ({ page, uniqueAccount: _uniqueAccount }) => {
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();
    await cartPage.proceedToCheckout();
  });

  test("VR-19: delivery address block", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.addressDetailsHeading).toBeVisible();

    await expect(checkoutPage.deliveryAddress).toHaveScreenshot(
      "checkout-address-details.png",
      // VR: only the generated values are masked, so the heading and the
      // block's structure stay under comparison.
      { mask: [checkoutPage.deliveryAddressValues] },
    );
  });

  test("VR-20: card entry form", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

    await checkoutPage.placeOrder();
    await expect(paymentPage.payButton).toBeVisible();

    await expect(paymentPage.paymentForm).toHaveScreenshot(
      "checkout-payment-form.png",
    );
  });
});
