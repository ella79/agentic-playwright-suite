import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";

export class OrderConfirmationPage extends BaseAppPage {
  readonly orderPlacedBanner: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    // Heading is uppercased in CSS, not in the markup.
    this.orderPlacedBanner = page.getByText(/order placed/i);
    this.downloadInvoiceLink = page.getByRole("link", {
      name: "Download Invoice",
    });
    this.continueButton = page.getByTestId("continue-button");
  }
}
