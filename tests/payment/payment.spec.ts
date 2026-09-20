// spec: specs/test-plans/payment-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { paymentCard, products } from "../../utils/testData";
import { urlPattern } from "../../utils/url";

test.describe("Payment Page", () => {
  test("TC-21: The payment form collects card details and completes the order", async ({
    page,
    cartPage,
    productDetailPage,
    checkoutPage,
    paymentPage,
  }) => {
    await test.step("reach the payment page", async () => {
      await cartPage.clearCart();
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();

      await cartPage.proceedToCheckout();
      await checkoutPage.placeOrder();
    });

    await test.step("every field is visible before submitting", async () => {
      await expect(paymentPage.paymentHeading).toBeVisible();
      await expect(paymentPage.nameOnCardInput).toBeVisible();
      await expect(paymentPage.cardNumberInput).toBeVisible();
      await expect(paymentPage.cvcInput).toBeVisible();
      await expect(paymentPage.expiryMonthInput).toBeVisible();
      await expect(paymentPage.expiryYearInput).toBeVisible();
    });

    await test.step("submitting completes the order", async () => {
      await paymentPage.payAndConfirmOrder(paymentCard);
      await expect(page).toHaveURL(urlPattern.orderPlaced);
    });
  });
});
