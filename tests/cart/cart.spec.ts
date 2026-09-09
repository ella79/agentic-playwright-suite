// spec: specs/test-plans/cart-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { products } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Cart", () => {
  test("TC-12: a product added from its detail page appears in the cart", async ({
    productDetailPage,
    cartPage,
  }) => {
    await test.step("add the product from its detail page", async () => {
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();

      await expect(modal.heading).toBeVisible();
      await modal.viewCart();
    });

    await test.step("the cart lists it at the catalog price", async () => {
      await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
      await expect(cartPage.getRowTotal(products.blueTop.name)).toHaveText(
        products.blueTop.price,
      );
    });
  });

  test("TC-13: a product added from the catalog listing appears in the cart", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("add the product from the catalog listing", async () => {
      await productsPage.gotoProductsPage();
      const modal = await productsPage.addProductToCartFromListing(
        products.menTshirt.id,
      );
      await modal.viewCart();
    });

    await test.step("the cart holds that product and nothing else", async () => {
      await expect(cartPage.getRow(products.menTshirt.name)).toBeVisible();
      await expect(cartPage.cartRows).toHaveCount(1);
    });
  });

  test("TC-14: the quantity set before adding is the quantity in the cart", async ({
    productDetailPage,
    cartPage,
  }) => {
    await test.step("set the quantity to three before adding", async () => {
      await productDetailPage.gotoProductDetailPage(products.menTshirt.id);
      await productDetailPage.setQuantity(3);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();
    });

    await test.step("the cart carries that quantity", async () => {
      await expect(cartPage.getRowQuantity(products.menTshirt.name)).toHaveText(
        "3",
      );
    });
  });

  test("TC-15: removing the only product empties the cart", async ({
    productDetailPage,
    cartPage,
  }) => {
    await test.step("start from a cart holding one product", async () => {
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const modal = await productDetailPage.addToCart();
      await modal.viewCart();
      await expect(cartPage.getRow(products.blueTop.name)).toBeVisible();
    });

    await test.step("remove it and the cart reports itself empty", async () => {
      await cartPage.removeProduct(products.blueTop.name);

      await expect(cartPage.emptyCartMessage).toBeVisible();
      await expect(cartPage.cartRows).toHaveCount(0);
    });
  });

  test("TC-16: an anonymous visitor cannot reach checkout", async ({
    page,
    productDetailPage,
    cartPage,
  }) => {
    await test.step("fill the cart without signing in", async () => {
      await productDetailPage.gotoProductDetailPage(products.blueTop.id);
      const addedModal = await productDetailPage.addToCart();
      await addedModal.viewCart();
    });

    await test.step("checkout asks for an account and keeps the visitor on the cart", async () => {
      const guardModal = await cartPage.proceedToCheckoutAsGuest();

      await expect(guardModal.message).toBeVisible();
      await expect(guardModal.registerLoginLink).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`${url.cart}$`));
    });
  });
});
