// spec: specs/vr-test-plans/cart-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";

test.describe("Visual regression - cart", () => {
  test("VR-10: empty cart state", async ({ cartPage }) => {
    await cartPage.gotoCartPage();
    await expect(cartPage.emptyCartMessage).toBeVisible();

    await expect(cartPage.cartItemsSection).toHaveScreenshot("cart-empty.png");
  });

  test("VR-11: cart table holding one product", async ({
    productDetailPage,
    cartPage,
  }) => {
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();
    await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();

    await cartPage.waitForImagesLoaded(cartPage.cartTable);

    await expect(cartPage.cartTable).toHaveScreenshot("cart-single-item.png", {
      maxDiffPixelRatio: 0.05, // the row carries the product thumbnail
    });
  });

  test("VR-12: add-to-cart confirmation modal", async ({
    productDetailPage,
  }) => {
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await expect(modal.heading).toBeVisible();

    await expect(modal.root).toHaveScreenshot("cart-added-modal.png");
  });

  test("VR-13: account guard shown to anonymous visitors", async ({
    productDetailPage,
    cartPage,
  }) => {
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const addedModal = await productDetailPage.addToCart();
    await addedModal.viewCart();

    const guardModal = await cartPage.proceedToCheckoutAsGuest();
    await expect(guardModal.registerLoginLink).toBeVisible();

    await expect(guardModal.root).toHaveScreenshot(
      "cart-checkout-guard-modal.png",
    );
  });
});
