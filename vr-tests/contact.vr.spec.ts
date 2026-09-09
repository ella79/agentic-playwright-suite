// spec: specs/vr-test-plans/contact-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Visual regression - contact", () => {
  test.beforeEach(async ({ contactUsPage }) => {
    await contactUsPage.gotoContactUsPage();
  });

  test("VR-18: contact form", async ({ contactUsPage }) => {
    await expect(contactUsPage.submitButton).toBeVisible();

    await expect(contactUsPage.contactForm).toHaveScreenshot(
      "contact-form.png",
    );
  });
});
