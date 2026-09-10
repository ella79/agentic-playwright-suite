// spec: specs/test-plans/product-detail-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount, products } from "../../utils/testData";

test.describe("Product detail", () => {
  test("TC-19: a product review can be submitted from the detail page", async ({
    productDetailPage,
  }) => {
    const reviewer = buildAccount();

    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
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
