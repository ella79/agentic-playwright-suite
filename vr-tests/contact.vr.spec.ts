// spec: specs/vr-test-plans/contact-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import { ContactUsPage } from "../utils/pageObjects";

test.describe("Visual regression - contact", () => {
  test("VR-17: contact form", async ({ page }) => {
    const contactUsPage = new ContactUsPage(page);

    await contactUsPage.gotoContactUsPage();
    await expect(contactUsPage.submitButton).toBeVisible();

    await expect(contactUsPage.contactForm).toHaveScreenshot(
      "contact-form.png",
    );
  });
});
