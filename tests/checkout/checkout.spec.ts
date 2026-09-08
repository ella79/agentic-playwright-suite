// spec: specs/test-plans/checkout-test-plan.md
import { expect, test } from "../../utils/fixtures/testFixtures";
import { paymentCard, products } from "../../utils/testData";
import { urlPattern } from "../../utils/url";

test.describe("Checkout", () => {
  test("TC-17: a signed-in user can complete an order end to end", async ({
    page,
    uniqueAccount,
    productDetailPage,
    cartPage,
    checkoutPage,
    paymentPage,
    orderConfirmationPage,
  }) => {
    await test.step("add a product to the cart", async () => {
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();
      await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
    });

    await test.step("review the order against the registered address", async () => {
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.addressDetailsHeading).toBeVisible();
      await expect(checkoutPage.deliveryAddress).toContainText(
        uniqueAccount.address,
      );
      await expect(checkoutPage.deliveryAddress).toContainText(
        uniqueAccount.city,
      );
      await expect(checkoutPage.orderRows.first()).toContainText(
        products.blueTop.name,
      );
    });

    await test.step("place the order and pay", async () => {
      await checkoutPage.addOrderComment("Portfolio suite end-to-end run.");
      await checkoutPage.placeOrder();
      await expect(paymentPage.payButton).toBeVisible();
      await paymentPage.payAndConfirmOrder(paymentCard);
    });

    await test.step("confirm the order was placed", async () => {
      await expect(page).toHaveURL(urlPattern.orderPlaced);
      await expect(orderConfirmationPage.orderPlacedBanner).toBeVisible();
      await expect(orderConfirmationPage.downloadInvoiceLink).toBeVisible();
    });
  });
});
