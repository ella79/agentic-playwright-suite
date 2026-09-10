// spec: specs/vr-test-plans/contact-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { buildAccount } from "../utils/testData";

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

  test("VR-21: contact success state", async ({ contactUsPage }) => {
    const visitor = buildAccount();

    // No attachment: the rendered success state is identical either way, and
    // omitting it avoids a slow multipart POST to the demo host.
    await contactUsPage.fillForm({
      name: visitor.name,
      email: visitor.email,
      subject: "Portfolio suite contact check",
      message: "Submitted by the automated engagement suite.",
    });

    await contactUsPage.submit();

    // The demo host is slow to come back with the confirmation banner.
    await expect(contactUsPage.successMessage).toBeVisible({
      timeout: 15_000,
    });

    await expect(contactUsPage.contactFormColumn).toHaveScreenshot(
      "contact-success.png",
    );
  });
});
