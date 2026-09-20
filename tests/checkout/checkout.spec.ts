// spec: specs/test-plans/checkout-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount, products } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Checkout Page", () => {
  test("TC-20: The checkout page shows the order it will place, ready to proceed", async ({
    page,
    cartPage,
    productDetailPage,
    checkoutPage,
  }) => {
    // Defaults match the shared account's profile: login.setup.ts registers
    // it with no overrides beyond email and password.
    const account = buildAccount();

    await test.step("add a product and proceed to checkout", async () => {
      await cartPage.clearCart();
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();

      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(new RegExp(`${url.checkout}$`));
    });

    await test.step("the order is ready: addresses, order and comment field", async () => {
      await expect(checkoutPage.addressDetailsHeading).toBeVisible();
      await expect(checkoutPage.deliveryAddress).toContainText(account.address);
      await expect(checkoutPage.deliveryAddress).toContainText(account.city);
      await expect(checkoutPage.billingAddress).toContainText(account.address);
      await expect(checkoutPage.billingAddress).toContainText(account.city);
      await expect(checkoutPage.orderRows).toHaveCount(1);
      await expect(checkoutPage.orderRows.first()).toContainText(
        products.blueTop.name,
      );
      await expect(checkoutPage.commentTextarea).toBeVisible();
      await expect(checkoutPage.commentTextarea).toHaveValue("");
    });

    await test.step("Place Order reaches payment", async () => {
      await checkoutPage.placeOrder();
      await expect(page).toHaveURL(new RegExp(`${url.payment}$`));
    });
  });
});
