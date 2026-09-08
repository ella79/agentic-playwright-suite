// spec: specs/vr-test-plans/contact-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Visual regression - contact", () => {
  test("VR-17: contact form", async ({ contactUsPage }) => {
    await contactUsPage.gotoContactUsPage();
    await expect(contactUsPage.submitButton).toBeVisible();

    await expect(contactUsPage.contactForm).toHaveScreenshot(
      "contact-form.png",
    );
  });
});
