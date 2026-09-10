// spec: specs/test-plans/contact-test-plan.md
// seed: specs/seed.spec.ts
import path from "path";
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount } from "../../utils/testData";

const ATTACHMENT = path.resolve(
  __dirname,
  "../../utils/fixtures/files/sample-attachment.txt",
);

test.describe("Contact", () => {
  test("TC-18: the contact form accepts a message with an attachment", async ({
    contactUsPage,
  }) => {
    const visitor = buildAccount();

    await test.step("fill the contact form and attach a file", async () => {
      await contactUsPage.gotoContactUsPage();
      await expect(contactUsPage.getInTouchHeading).toBeVisible();

      await contactUsPage.fillForm({
        name: visitor.name,
        email: visitor.email,
        subject: "Portfolio suite contact check",
        message: "Submitted by the automated engagement suite.",
        filePath: ATTACHMENT,
      });
    });

    await test.step("the site confirms the message was sent", async () => {
      await contactUsPage.submit();

      // Multipart POST to the demo host: consistently slower than the 5s default.
      await expect(contactUsPage.successMessage).toBeVisible({
        timeout: 15_000,
      });
    });
  });
});
