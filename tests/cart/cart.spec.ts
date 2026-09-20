// spec: specs/test-plans/cart-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { CartPage, ProductDetailPage } from "../../utils/pageObjects";
import { products } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Cart Page", () => {
  test("TC-18: The cart starts empty, and adding products from the home page notifies for each until one is removed", async ({
    page,
    cartPage,
    homePage,
  }) => {
    await test.step("the cart page shows the nav menu and its empty state", async () => {
      await cartPage.clearCart();
      await expect(homePage.homeLink).toBeVisible();
      await expect(homePage.cartLink).toBeVisible();
      await expect(cartPage.emptyCartMessage).toBeVisible();
    });

    await test.step("Home from the cart page's breadcrumb reaches the home page", async () => {
      await cartPage.homeBreadcrumbLink.click();
      await expect(page).toHaveURL(new RegExp(`${url.home}$`));
    });

    await test.step("adding Blue Top notifies, then Continue Shopping stays on the page", async () => {
      const modal = await homePage.addProductToCartFromListing(
        products.blueTop.id,
      );
      await expect(modal.heading).toBeVisible();
      await modal.continueShoppingButton.click();
    });

    await test.step("adding Men Tshirt notifies, then View Cart reaches the cart with both products", async () => {
      const modal = await homePage.addProductToCartFromListing(
        products.menTshirt.id,
      );
      await expect(modal.heading).toBeVisible();
      await modal.viewCart();

      await expect(cartPage.proceedToCheckoutButton).toBeVisible();
      await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
      await expect(cartPage.getRow(products.menTshirt.name)).toBeVisible();
    });

    await test.step("removing Men Tshirt leaves only Blue Top", async () => {
      await cartPage.removeProduct(products.menTshirt.name);

      await expect(cartPage.getRow(products.menTshirt.name)).toBeHidden();
      await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
      await expect(cartPage.cartRows).toHaveCount(1);
    });
  });

  test("TC-19: Proceeding to checkout differs for a guest and a signed-in visitor", async ({
    page,
    browser,
    cartPage,
    productDetailPage,
  }) => {
    // A second, anonymous context: the case compares both identities at once,
    // and the shared session every other spec depends on is already signed
    // in, so the guest half cannot run on the default page.
    await test.step("a guest is guarded and kept on the cart page", async () => {
      const guestContext = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const guestPage = await guestContext.newPage();
      const guestProductDetail = new ProductDetailPage(guestPage);
      const guestCart = new CartPage(guestPage);

      await guestProductDetail.gotoProductDetailPage(products.blueTop.id);
      const modal = await guestProductDetail.addToCart();
      await modal.viewCart();

      const guardModal = await guestCart.proceedToCheckoutAsGuest();
      await expect(guardModal.heading).toBeVisible();
      await expect(guardModal.message).toBeVisible();
      await expect(guestPage).toHaveURL(new RegExp(`${url.cart}$`));

      await guestContext.close();
    });

    await test.step("a signed-in visitor reaches checkout", async () => {
      await cartPage.clearCart();
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();

      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(new RegExp(`${url.checkout}$`));
    });
  });
});
