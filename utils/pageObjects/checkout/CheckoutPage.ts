import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";

export class CheckoutPage extends BaseAppPage {
  readonly addressDetailsHeading: Locator;
  readonly deliveryAddress: Locator;
  readonly orderRows: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetailsHeading = page.getByRole("heading", {
      name: "Address Details",
    });
    this.deliveryAddress = page.locator("#address_delivery");
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
