import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";
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
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.getInTouchHeading = page.getByRole("heading", {
      name: "Get In Touch",
    });
    this.contactForm = page.locator(".contact-form");
    this.nameInput = page.getByTestId("name");
    this.emailInput = page.getByTestId("email");
    this.subjectInput = page.getByTestId("subject");
    this.messageTextarea = page.getByTestId("message");
    // File input has no data-qa hook and no accessible name.
    this.fileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByTestId("submit-button");
    // The page carries two elements with this exact text: the contact form's
    // status banner and a hidden one belonging to the newsletter widget.
    this.successMessage = page
      .locator("#contact-page")
      .getByText("Success! Your details have been submitted successfully.");
    this.homeButton = page.getByRole("link", { name: "Home" }).last();
  }

  async gotoContactUsPage(): Promise<void> {
    await this.goto(url.contactUs);
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
