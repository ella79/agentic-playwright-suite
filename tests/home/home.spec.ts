// spec: specs/test-plans/home-test-plan.md
// seed: specs/seed.spec.ts
import { type Locator } from "@playwright/test";
import { expect, test } from "../../utils/fixtures/testFixtures";
import { CatalogApiClient } from "../../utils/apiClients/catalogApiClient";
import { HomePage } from "../../utils/pageObjects";
import { buildAccount, products } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Home Page", () => {
  test("TC-01: Every section of the home page renders, and the newsletter subscription works", async ({
    page,
    request,
    homePage,
  }) => {
    await homePage.gotoHomePage();
    await expect(page).toHaveTitle("Automation Exercise");

    await test.step("the hero shows its heading, subheading and description", async () => {
      await expect(homePage.heroHeading).toBeVisible();
      await expect(homePage.heroSubheading).toBeVisible();
      await expect(homePage.heroDescription).toBeVisible();
    });

    await test.step("the category sidebar lists every entry", async () => {
      for (const category of ["Women", "Men", "Kids"] as const) {
        await expect(homePage.getCategoryLink(category)).toBeVisible();
      }
    });

    await test.step("the brands sidebar lists exactly what the API's catalog names", async () => {
      const catalog = await new CatalogApiClient(request).getBrandsList();
      const brandNames = [
        ...new Set(catalog.brands.map((brand) => brand.brand)),
      ];

      for (const brand of brandNames) {
        await expect(
          homePage.brandsSidebar.getByRole("link", { name: brand }),
        ).toBeVisible();
      }
    });

    await test.step("the first featured item is a complete card", async () => {
      const firstCard = homePage.getProductCard(products.blueTop.name);
      await expect(firstCard.locator("img").first()).toBeVisible();
      await expect(
        firstCard.getByText(products.blueTop.price).first(),
      ).toBeVisible();
      await expect(
        firstCard.getByText(products.blueTop.name).first(),
      ).toBeVisible();
      // Rendered as an anchor without href, so it carries no link role.
      await expect(firstCard.getByText("Add to cart").first()).toBeVisible();
      await expect(
        firstCard.getByRole("link", { name: "View Product" }),
      ).toBeVisible();
    });

    await test.step("recommended items and the footer are visible", async () => {
      await expect(homePage.recommendedItemsHeading).toBeVisible();
      await expect(homePage.copyrightText).toBeVisible();
    });

    await test.step("subscribing to the newsletter succeeds", async () => {
      const subscriber = buildAccount();
      await homePage.subscribeToNewsletter(subscriber.email);
      await expect(homePage.subscriptionSuccessMessage).toBeVisible();
    });
  });

  test("TC-02: The header shows a different menu and account state for a guest and a signed-in visitor", async ({
    browser,
    homePage,
  }) => {
    await test.step("the signed-in visitor's header shows the full menu and the account state", async () => {
      await homePage.gotoHomePage();
      await expect(homePage.homeLink).toBeVisible();
      await expect(homePage.productsLink).toBeVisible();
      await expect(homePage.cartLink).toBeVisible();
      await expect(homePage.logoutLink).toBeVisible();
      await expect(homePage.deleteAccountLink).toBeVisible();
      await expect(homePage.testCasesLink).toBeVisible();
      await expect(homePage.apiTestingLink).toBeVisible();
      await expect(homePage.videoTutorialsLink).toBeVisible();
      await expect(homePage.contactUsLink).toBeVisible();
      await expect(homePage.loggedInAs).toBeVisible();
    });

    // A second, anonymous context: the case compares both identities at once,
    // which a single page cannot hold, since the shared session every other
    // spec depends on is already signed in.
    await test.step("a guest's header offers the same menu, minus the signed-in-only links", async () => {
      const guestContext = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const guestHome = new HomePage(await guestContext.newPage());

      await guestHome.gotoHomePage();
      await expect(guestHome.homeLink).toBeVisible();
      await expect(guestHome.productsLink).toBeVisible();
      await expect(guestHome.cartLink).toBeVisible();
      await expect(guestHome.signupLoginLink).toBeVisible();
      await expect(guestHome.testCasesLink).toBeVisible();
      await expect(guestHome.apiTestingLink).toBeVisible();
      // Verified live: Video Tutorials is present for a guest too, unlike
      // Logout and Delete Account.
      await expect(guestHome.videoTutorialsLink).toBeVisible();
      await expect(guestHome.contactUsLink).toBeVisible();
      await expect(guestHome.logoutLink).toBeHidden();
      await expect(guestHome.deleteAccountLink).toBeHidden();
      await expect(guestHome.loggedInAs).toBeHidden();

      await guestContext.close();
    });
  });

  test("TC-03: The hero's Test Cases and API Testing buttons open their own pages", async ({
    page,
    homePage,
  }) => {
    await homePage.gotoHomePage();

    await test.step("Test Cases opens its own page", async () => {
      await homePage.testCasesButton.click();
      await expect(page).toHaveURL(/\/test_cases$/);
    });

    await test.step("API Testing opens its own page", async () => {
      await homePage.gotoHomePage();
      await homePage.apiTestingButton.click();
      await expect(page).toHaveURL(/\/api_list$/);
    });
  });

  test("TC-04: Selecting a category or a brand filters the catalog accordingly", async ({
    page,
    request,
    homePage,
    productsPage,
  }) => {
    await test.step("a category opens a listing of matching products", async () => {
      await homePage.gotoHomePage();
      await homePage.openCategory("Women", "Dress");
      await expect(page).toHaveURL(/\/category_products\/1$/);
      await expect(
        productsPage.getCategoryResultsHeading("Women", "Dress"),
      ).toBeVisible();

      const catalog = await new CatalogApiClient(request).getProductsList();
      const expectedCount = catalog.products.filter(
        (product) =>
          product.category.usertype.usertype === "Women" &&
          product.category.category === "Dress",
      ).length;
      expect(expectedCount).toBeGreaterThan(0);
      await expect(productsPage.productCards).toHaveCount(expectedCount);
    });

    await test.step("a brand opens a listing of matching products", async () => {
      await homePage.gotoHomePage();
      await homePage.openBrand("Madame");
      await expect(page).toHaveURL(/\/brand_products\/Madame$/);
      await expect(productsPage.getBrandResultsHeading("Madame")).toBeVisible();

      const catalog = await new CatalogApiClient(request).getProductsList();
      const expectedCount = catalog.products.filter(
        (product) => product.brand === "Madame",
      ).length;
      expect(expectedCount).toBeGreaterThan(0);
      await expect(productsPage.productCards).toHaveCount(expectedCount);
    });
  });

  test("TC-05: The main navigation reaches every page it links to", async ({
    page,
    homePage,
  }) => {
    await homePage.gotoHomePage();

    const destinations: Array<[Locator, RegExp]> = [
      [homePage.productsLink, new RegExp(`${url.products}$`)],
      [homePage.cartLink, new RegExp(`${url.cart}$`)],
      [homePage.testCasesLink, /\/test_cases$/],
      [homePage.apiTestingLink, /\/api_list$/],
      [homePage.contactUsLink, new RegExp(`${url.contactUs}$`)],
    ];

    for (const [link, pattern] of destinations) {
      await homePage.gotoHomePage();
      await link.click();
      await expect(page).toHaveURL(pattern);
    }
  });

  test("TC-06: Adding a product to the cart from the home page shows a confirmation notification", async ({
    homePage,
  }) => {
    await homePage.gotoHomePage();

    await test.step("adding Blue Top shows the confirmation", async () => {
      const modal = await homePage.addProductToCartFromListing(
        products.blueTop.id,
      );
      await expect(modal.heading).toBeVisible();
      await modal.continueShoppingButton.click();
    });

    await test.step("adding Men Tshirt shows the confirmation", async () => {
      const modal = await homePage.addProductToCartFromListing(
        products.menTshirt.id,
      );
      await expect(modal.heading).toBeVisible();
    });
  });
});
