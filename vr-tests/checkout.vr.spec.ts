// spec: specs/vr-test-plans/checkout-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";

test.describe("Visual regression - checkout", () => {
  // uniqueAccount is requested for its side effect: both captures are only
  // reachable once an account exists and is signed in.
  test.beforeEach(
    async ({ uniqueAccount: _uniqueAccount, productDetailPage, cartPage }) => {
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();
      await cartPage.proceedToCheckout();
    },
  );

  test("VR-19: delivery address block", async ({ checkoutPage }) => {
    await expect(checkoutPage.addressDetailsHeading).toBeVisible();

    await expect(checkoutPage.deliveryAddress).toHaveScreenshot(
      "checkout-address-details.png",
      // VR: only the generated values are masked, so the heading and the
      // block's structure stay under comparison.
      { mask: [checkoutPage.deliveryAddressValues] },
    );
  });

  test("VR-20: card entry form", async ({ checkoutPage, paymentPage }) => {
    await checkoutPage.placeOrder();
    await expect(paymentPage.payButton).toBeVisible();

    await expect(paymentPage.paymentForm).toHaveScreenshot(
      "checkout-payment-form.png",
    );
  });
});
