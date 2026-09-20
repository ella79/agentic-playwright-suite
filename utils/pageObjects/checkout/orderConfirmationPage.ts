import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";

export class OrderConfirmationPage extends BaseAppPage {
  readonly confirmationSection: Locator;
  readonly orderPlacedBanner: Locator;
  readonly confirmationMessage: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    // The column wrapping the banner, message and both buttons. Verified live.
    this.confirmationSection = page.locator(".col-sm-9.col-sm-offset-1");
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
}
