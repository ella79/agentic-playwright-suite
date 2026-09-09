import { expect, type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { url } from "../../url";

export class ContactUsPage extends BaseAppPage {
  readonly getInTouchHeading: Locator;
  readonly contactForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.getInTouchHeading = page.getByRole("heading", {
      name: "Get In Touch",
    });
    // The .contact-form class wraps two blocks; the form element itself is
    // the one that carries the fields.
    this.contactForm = page.locator("#contact-us-form");
    // Scoped to the form. The footer newsletter input is placeheld "Your email
    // address", which a page wide getByPlaceholder("Email") also matches.
    this.nameInput = this.contactForm.getByPlaceholder("Name");
    this.emailInput = this.contactForm.getByPlaceholder("Email");
    this.subjectInput = this.contactForm.getByPlaceholder("Subject");
    this.messageTextarea =
      this.contactForm.getByPlaceholder("Your Message Here");
    // File input has no data-qa hook and no accessible name.
    this.fileInput = this.contactForm.locator('input[name="upload_file"]');
    this.submitButton = this.contactForm.getByRole("button", {
      name: "Submit",
    });
    // The page carries two elements with this exact text: the contact form's
    // status banner and a hidden one belonging to the newsletter widget.
    this.successMessage = page
      .locator("#contact-page")
      .getByText("Success! Your details have been submitted successfully.");
  }

  async gotoContactUsPage(): Promise<void> {
    await this.goto(url.contactUs);
    await expect(this.page).toHaveURL(new RegExp(`${url.contactUs}$`));
    await expect(this.getInTouchHeading).toBeVisible();
  }

  async fillForm(details: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath?: string;
  }): Promise<void> {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    await this.subjectInput.fill(details.subject);
    await this.messageTextarea.fill(details.message);

    if (details.filePath) {
      await this.fileInput.setInputFiles(details.filePath);
    }
  }

  /**
   * Submission raises a native confirm dialog before the request is sent.
   */
  async submit(): Promise<void> {
    this.page.once("dialog", (dialog) => void dialog.accept());
    await this.submitButton.click();
  }
}
