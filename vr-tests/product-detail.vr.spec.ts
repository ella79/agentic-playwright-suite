// spec: specs/vr-test-plans/product-detail-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { products } from "../utils/testData";

test.describe("Visual regression - Product Detail Page", () => {
  test.beforeEach(async ({ productDetailPage }) => {
    await productDetailPage.gotoProductDetailPage(products.menTshirt.id);
  });

  test("VR-21: Product showcase", async ({ page, productDetailPage }) => {
    await expect(productDetailPage.productImage).toBeVisible();
    await productDetailPage.waitForImagesLoaded(
      productDetailPage.page.locator("body"),
    );

    // A viewport capture, not an element one: the row holding the image and
    // information columns carries Bootstrap's own negative row margins with
    // no containing block to clip them, so an element screenshot of it paints
    // the sidebar sitting in the same region rather than just its own two
    // children. Verified live. The viewport at page load is exactly this
    // showcase anyway, since the page opens scrolled to the top.
    await expect(page).toHaveScreenshot("product-detail-showcase.png", {
      maxDiffPixelRatio: 0.05, // VR: product photography compresses inconsistently
    });
  });

  test("VR-22: Write Your Review form, default", async ({
    productDetailPage,
  }) => {
    await productDetailPage.reviewSection.scrollIntoViewIfNeeded();
    await expect(productDetailPage.reviewNameInput).toBeVisible();

    await expect(productDetailPage.reviewSection).toHaveScreenshot(
      "product-detail-review-form.png",
    );
  });

  test("VR-23: Write Your Review form, validation", async ({
    productDetailPage,
  }) => {
    // No fields filled: name, email and review all carry `required`, verified
    // live, so the browser's own field validation blocks the submit, the same
    // mechanism as `payment-vr-test-plan.md`'s VR-32.
    await productDetailPage.reviewSection.scrollIntoViewIfNeeded();
    await productDetailPage.reviewSubmitButton.click();

    await expect(productDetailPage.reviewSection).toHaveScreenshot(
      "product-detail-review-validation.png",
    );
  });

  test("VR-24: Review submitted", async ({ page, productDetailPage }) => {
    // A fixed, literal reviewer rather than `buildAccount()`: the submitted
    // form is not cleared, so a per-run generated email would leave the
    // field's own text different on every capture.
    await productDetailPage.submitReview(
      "Jon Doe",
      "vr.reviewer@example.com",
      "Fits the description. Submitted by the automated suite.",
    );
    await expect(productDetailPage.reviewSuccessMessage).toBeVisible({
      timeout: 15_000,
    });
    await productDetailPage.reviewSuccessMessage.scrollIntoViewIfNeeded();

    // A viewport capture, not an element one: the success banner's own row
    // (`#review-section`, a `.form-row`) collapses to zero height for the
    // same reason as VR-21's `.row`, floated children with no clearfix, and
    // sits exactly at `#review-form`'s own bottom edge, verified live, so an
    // element screenshot of `reviewSection` clips the banner's text out
    // entirely instead of just cropping tightly around it.
    await expect(page).toHaveScreenshot("product-detail-review-sent.png");
  });
});
