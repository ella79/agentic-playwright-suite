// spec: specs/vr-test-plans/checkout-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";

test.describe("Visual regression - checkout", () => {
  // uniqueAccount is requested for its side effect: checkout is only reachable
  // once an account exists and is signed in.
  test.beforeEach(
    async ({ productDetailPage, cartPage, uniqueAccount: _uniqueAccount }) => {
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
      // Only the generated values are masked, so the block's structure stays
      // under comparison.
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
