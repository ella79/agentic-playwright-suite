// spec: specs/test-plans/cart-test-plan.md
import { expect, test } from "../../utils/fixtures/testFixtures";
import {
  CartPage,
  ProductDetailPage,
  ProductsPage,
} from "../../utils/pageObjects";
import { products } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Cart", () => {
  test("TC-12: a product added from its detail page appears in the cart", async ({
    page,
  }) => {
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();

    await expect(modal.heading).toBeVisible();
    await modal.viewCart();

    await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
    await expect(cartPage.getRowTotal(products.blueTop.name)).toHaveText(
      products.blueTop.price,
    );
  });

  test("TC-13: a product added from the catalog listing appears in the cart", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.gotoProductsPage();
    const modal = await productsPage.addProductToCartFromListing(
      products.menTshirt.id,
    );
    await modal.viewCart();

    await expect(cartPage.getRow(products.menTshirt.name)).toBeVisible();
    expect(await cartPage.itemCount()).toBe(1);
  });

  test("TC-15: removing the only product empties the cart", async ({
    page,
  }) => {
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();
    await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();

    await cartPage.removeProduct(products.blueTop.name);

    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.cartRows).toHaveCount(0);
  });

  test("TC-16: an anonymous visitor cannot reach checkout", async ({
    page,
  }) => {
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
    const addedModal = await productDetailPage.addToCart();
    await addedModal.viewCart();

    const guardModal = await cartPage.proceedToCheckoutAsGuest();

    await expect(guardModal.message).toBeVisible();
    await expect(guardModal.registerLoginLink).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${url.cart}$`));
  });

  test("TC-14: the quantity set before adding is the quantity in the cart", async ({
    page,
  }) => {
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await productDetailPage.gotoProductDetailPage(products.menTshirt.id);
    await productDetailPage.setQuantity(3);
    const modal = await productDetailPage.addToCart();
    await modal.viewCart();

    await expect(cartPage.getRowQuantity(products.menTshirt.name)).toHaveText(
      "3",
    );
  });
});
