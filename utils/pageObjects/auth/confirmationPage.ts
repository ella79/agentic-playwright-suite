import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";

/**
 * Account created and account deleted share one layout: a banner plus a
 * Continue control. Case-insensitive matching because the headings are
 * uppercased in CSS, not in the markup.
 */
export class ConfirmationPage extends BaseAppPage {
  readonly accountCreatedBanner: Locator;
  readonly accountDeletedBanner: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountCreatedBanner = page.getByText(/account created/i);
    this.accountDeletedBanner = page.getByText(/account deleted/i);
    this.continueButton = page.getByTestId("continue-button");
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
