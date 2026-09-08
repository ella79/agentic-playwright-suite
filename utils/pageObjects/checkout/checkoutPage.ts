import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";

export class CheckoutPage extends BaseAppPage {
  readonly addressDetailsHeading: Locator;
  readonly deliveryAddress: Locator;
  readonly deliveryAddressValues: Locator;
  readonly orderRows: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetailsHeading = page.getByRole("heading", {
      name: "Address Details",
    });
    this.deliveryAddress = page.locator("#address_delivery");
    // Every line except the block heading holds data generated per run. Masking
    // these keeps the heading and layout under comparison instead of blanking
    // the whole block, which would make the capture assert nothing.
    this.deliveryAddressValues = this.deliveryAddress.locator(
      "li:not(.address_title)",
    );
    this.orderRows = page.locator("#cart_info tbody tr");
    // Textarea with neither a label nor a placeholder.
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.getByRole("link", { name: "Place Order" });
  }

  async addOrderComment(comment: string): Promise<void> {
    await this.commentTextarea.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderLink.click();
  }
}
