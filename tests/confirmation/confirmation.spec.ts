// spec: specs/test-plans/confirmation-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { paymentCard, products } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Confirmation Page", () => {
  test("TC-22: The confirmation page confirms the order, downloads its invoice, and Continue returns home", async ({
    page,
    cartPage,
    productDetailPage,
    checkoutPage,
    paymentPage,
    orderConfirmationPage,
  }) => {
    await test.step("complete an order end to end", async () => {
      await cartPage.clearCart();
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();

      await cartPage.proceedToCheckout();
      await checkoutPage.placeOrder();
      await paymentPage.payAndConfirmOrder(paymentCard);
    });

    await test.step("the confirmation page confirms the order", async () => {
      await expect(orderConfirmationPage.orderPlacedBanner).toBeVisible();
      await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
      await expect(orderConfirmationPage.downloadInvoiceLink).toBeVisible();
    });

    await test.step("Download Invoice downloads a file", async () => {
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        orderConfirmationPage.downloadInvoiceLink.click(),
      ]);
      expect(download.suggestedFilename()).toBeTruthy();
    });

    await test.step("Continue returns to the home page", async () => {
      await orderConfirmationPage.continueButton.click();
      await expect(page).toHaveURL(new RegExp(`${url.home}$`));
    });
  });
});
