import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";

export class OrderConfirmationPage extends BaseAppPage {
  readonly orderPlacedBanner: Locator;
  readonly confirmationMessage: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    // Heading is uppercased in CSS, not in the markup.
    this.orderPlacedBanner = page.getByText(/order placed/i);
    this.confirmationMessage = page.getByText(
      "Congratulations! Your order has been confirmed!",
    );
    this.downloadInvoiceLink = page.getByRole("link", {
      name: "Download Invoice",
    });
    this.continueButton = page.getByTestId("continue-button");
  }

  async continueShopping(): Promise<void> {
    await this.continueButton.click();
  }
}
