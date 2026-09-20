// spec: specs/vr-test-plans/payment-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { paymentCard, products } from "../utils/testData";
import { url } from "../utils/url";

test.describe("Visual regression - Payment Page", () => {
  test.beforeEach(
    async ({ page, cartPage, productDetailPage, checkoutPage }) => {
      await cartPage.clearCart();
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();

      await cartPage.proceedToCheckout();
      await checkoutPage.placeOrder();
      await expect(page).toHaveURL(new RegExp(`${url.payment}$`));
    },
  );

  test("VR-30: Payment form, default", async ({ page, paymentPage }) => {
    await expect(paymentPage.paymentHeading).toBeVisible();

    // A clip, not an element screenshot: the "Payment" heading is a
    // full-width wizard-step title, not an ancestor of the narrower form
    // column beneath it, so no single locator's own box covers both.
    const clip = await paymentPage.unionBoundingBox([
      paymentPage.paymentHeading,
      paymentPage.paymentForm,
    ]);
    await expect(page).toHaveScreenshot("payment-form-default.png", { clip });
  });

  test("VR-31: Payment form, filled", async ({ page, paymentPage }) => {
    // The fixed literal card, not a per-run value: it never submits here, so
    // nothing is created, and a per-run generated number would leave the
    // fields' own text different on every capture.
    await paymentPage.fillPaymentDetails(paymentCard);

    const clip = await paymentPage.unionBoundingBox([
      paymentPage.paymentHeading,
      paymentPage.paymentForm,
    ]);
    await expect(page).toHaveScreenshot("payment-form-filled.png", { clip });
  });

  test("VR-32: Payment form, validation", async ({ page, paymentPage }) => {
    // No fields filled: the browser's own required-field validation blocks
    // the submit, which is what this case captures. Verified live: the
    // bubble does appear in a Playwright screenshot and does persist.
    await paymentPage.payButton.click();

    const clip = await paymentPage.unionBoundingBox([
      paymentPage.paymentHeading,
      paymentPage.paymentForm,
    ]);
    await expect(page).toHaveScreenshot("payment-form-validation.png", {
      clip,
    });
  });
});
