// spec: specs/vr-test-plans/product-detail-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";

test.describe("Visual regression - product detail", () => {
  test.beforeEach(async ({ productDetailPage }) => {
    await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  });

  test("VR-08: product information panel", async ({ productDetailPage }) => {
    await expect(productDetailPage.productName).toBeVisible();
    await productDetailPage.waitForImagesLoaded(
      productDetailPage.productInformation,
    );

    await expect(productDetailPage.productInformation).toHaveScreenshot(
      "product-detail-information.png",
      { maxDiffPixelRatio: 0.05 }, // VR: product photography compresses inconsistently
    );
  });

  test("VR-09: write-a-review form", async ({ productDetailPage }) => {
    await productDetailPage.reviewSection.scrollIntoViewIfNeeded();
    await expect(productDetailPage.reviewTextarea).toBeVisible();

    await expect(productDetailPage.reviewSection).toHaveScreenshot(
      "product-detail-review-form.png",
    );
  });
});
