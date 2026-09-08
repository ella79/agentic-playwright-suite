import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";

export class CheckoutPage extends BaseAppPage {
  readonly addressDetailsHeading: Locator;
  readonly reviewOrderHeading: Locator;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderTable: Locator;
  readonly orderRows: Locator;
  readonly orderTotal: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetailsHeading = page.getByRole("heading", {
      name: "Address Details",
    });
    this.reviewOrderHeading = page.getByRole("heading", {
      name: "Review Your Order",
    });
    this.deliveryAddress = page.locator("#address_delivery");
    this.billingAddress = page.locator("#address_invoice");
    this.orderTable = page.locator("#cart_info");
    this.orderRows = page.locator("#cart_info tbody tr");
    this.orderTotal = page.locator(".cart_total_price").last();
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
