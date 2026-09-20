// spec: specs/vr-test-plans/confirmation-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { paymentCard, products } from "../utils/testData";

test.describe("Visual regression - Confirmation Page", () => {
  test("VR-33: Order confirmation", async ({
    cartPage,
    productDetailPage,
    checkoutPage,
    paymentPage,
    orderConfirmationPage,
  }) => {
    await cartPage.clearCart();
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();

    await cartPage.proceedToCheckout();
    await checkoutPage.placeOrder();
    await paymentPage.payAndConfirmOrder(paymentCard);
    await expect(orderConfirmationPage.orderPlacedBanner).toBeVisible();

    await expect(orderConfirmationPage.confirmationSection).toHaveScreenshot(
      "confirmation-order.png",
    );
  });
});
