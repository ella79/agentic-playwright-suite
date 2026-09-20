// spec: specs/test-plans/product-detail-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount, products } from "../../utils/testData";

test.describe("Product Detail Page", () => {
  test("TC-16: The product detail page shows the product's full information", async ({
    productDetailPage,
  }) => {
    await productDetailPage.gotoProductDetailPage(products.menTshirt.id);

    await expect(productDetailPage.productImage).toBeVisible();
    await expect(productDetailPage.productName).toHaveText(
      products.menTshirt.name,
    );
    await expect(productDetailPage.productPrice).toHaveText(
      products.menTshirt.price,
    );
    await expect(productDetailPage.category).toContainText(
      "Category: Men > Tshirts",
    );
    await expect(productDetailPage.quantityInput).toHaveValue("1");
    await expect(productDetailPage.availability).toContainText("In Stock");
    await expect(productDetailPage.condition).toContainText("New");
    await expect(productDetailPage.brand).toContainText("H&M");
    await expect(productDetailPage.writeYourReviewTab).toBeVisible();
  });

  test("TC-17: A product review can be submitted from the detail page", async ({
    productDetailPage,
  }) => {
    const reviewer = buildAccount();

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);

    await test.step("the review form starts empty", async () => {
      await expect(productDetailPage.reviewNameInput).toHaveValue("");
      await expect(productDetailPage.reviewEmailInput).toHaveValue("");
      await expect(productDetailPage.reviewTextarea).toHaveValue("");
    });

    await test.step("filling and submitting it shows the thank-you message", async () => {
      await productDetailPage.submitReview(
        reviewer.name,
        reviewer.email,
        "Fits the description. Submitted by the automated suite.",
      );

      await expect(productDetailPage.reviewSuccessMessage).toBeVisible({
        timeout: 15_000,
      });
    });
  });
});
