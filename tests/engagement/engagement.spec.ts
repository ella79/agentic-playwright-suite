// spec: specs/test-plans/engagement-test-plan.md
import path from "path";
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount, products } from "../../utils/testData";

const ATTACHMENT = path.resolve(
  __dirname,
  "../../utils/fixtures/files/sample-attachment.txt",
);

test.describe("Engagement", () => {
  test("TC-18: the contact form accepts a message with an attachment", async ({
    contactUsPage,
  }) => {
    const visitor = buildAccount();

    await contactUsPage.gotoContactUsPage();
    await expect(contactUsPage.getInTouchHeading).toBeVisible();

    await contactUsPage.fillForm({
      name: visitor.name,
      email: visitor.email,
      subject: "Portfolio suite contact check",
      message: "Submitted by the automated engagement suite.",
      filePath: ATTACHMENT,
    });
    await contactUsPage.submit();

    // Multipart POST to the demo host: consistently slower than the 5s default.
    await expect(contactUsPage.successMessage).toBeVisible({ timeout: 15_000 });
  });

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

  test("TC-20: a visitor can subscribe to the newsletter from the footer", async ({
    homePage,
  }) => {
    const subscriber = buildAccount();

    await homePage.gotoHomePage();
    await homePage.subscribeToNewsletter(subscriber.email);

    await expect(homePage.subscriptionSuccessMessage).toBeVisible();
  });
});
