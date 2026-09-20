import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";

/**
 * Account created and account deleted share one layout: a banner plus a
 * Continue control. Case-insensitive matching because the headings are
 * uppercased in CSS, not in the markup.
 */
export class ConfirmationPage extends BaseAppPage {
  readonly confirmationSection: Locator;
  readonly accountCreatedBanner: Locator;
  readonly accountCreatedMessage: Locator;
  readonly accountDeletedBanner: Locator;
  readonly accountDeletedMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    // The column wrapping the banner, message and Continue button. Shared
    // markup with the order confirmation page's own equivalent.
    this.confirmationSection = page.locator(".col-sm-9.col-sm-offset-1");
    this.accountCreatedBanner = page.getByText(/account created/i);
    this.accountCreatedMessage = page.getByText(
      "Congratulations! Your new account has been successfully created!",
    );
    this.accountDeletedBanner = page.getByText(/account deleted/i);
    this.accountDeletedMessage = page.getByText(
      "Your account has been permanently deleted!",
    );
    this.continueButton = page.getByTestId("continue-button");
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
