import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";

export class CheckoutPage extends BaseAppPage {
  readonly addressDetailsHeading: Locator;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderReviewHeading: Locator;
  readonly orderTable: Locator;
  readonly orderRows: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetailsHeading = page.getByRole("heading", {
      name: "Address Details",
    });
    this.deliveryAddress = page.locator("#address_delivery");
    this.billingAddress = page.locator("#address_invoice");
    this.orderReviewHeading = page.getByRole("heading", {
      name: "Review Your Order",
    });
    this.orderTable = page.locator("#cart_info");
    // The same table also renders a trailing Total Amount row with no
    // product id; scoping to `product-<id>` rows excludes it. Verified live.
    this.orderRows = page.locator('#cart_info tbody tr[id^="product-"]');
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
