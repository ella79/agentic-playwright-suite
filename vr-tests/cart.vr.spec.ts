// spec: specs/vr-test-plans/cart-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { CartPage, ProductDetailPage } from "../utils/pageObjects";
import { products } from "../utils/testData";

test.describe("Visual regression - Cart Page", () => {
  test("VR-25: Cart, empty", async ({ cartPage }) => {
    await cartPage.clearCart();
    await expect(cartPage.emptyCartMessage).toBeVisible();

    await expect(cartPage.cartItemsSection).toHaveScreenshot("cart-empty.png");
  });

  test("VR-26: Cart, with a product", async ({
    cartPage,
    productDetailPage,
  }) => {
    await cartPage.clearCart();
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();
    await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
    await cartPage.waitForImagesLoaded(cartPage.cartTable);

    await expect(cartPage.cartTable).toHaveScreenshot("cart-with-item.png", {
      maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
    });
  });

  test("VR-27: Checkout guard modal", async ({ guestPage }) => {
    const guestProductDetail = new ProductDetailPage(guestPage);
    const guestCart = new CartPage(guestPage);

    await guestProductDetail.gotoProductDetailPage(products.blueTop.id);
    const modal = await guestProductDetail.addToCart();
    await modal.viewCart();

    const guardModal = await guestCart.proceedToCheckoutAsGuest();
    await expect(guardModal.message).toBeVisible();

    await expect(guestPage).toHaveScreenshot("cart-checkout-guard.png", {
      maxDiffPixelRatio: 0.03, // VR: full-page capture over the page's own product imagery
    });
  });
});
