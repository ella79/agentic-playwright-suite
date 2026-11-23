import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { url } from "../../url";

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
    this.deliveryAddress = page
      .getByRole("list")
      .filter({ hasText: "Your delivery address" });
    this.billingAddress = page
      .getByRole("list")
      .filter({ hasText: "Your billing address" });
    this.orderReviewHeading = page.getByRole("heading", {
      name: "Review Your Order",
    });
    // CSS: a layout wrapper around the order <table>, addressed the same way
    // as the cart's. Verified live.
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
    // The same reason `CartPage.proceedToCheckout` waits: `waitForURL` waits
    // for the load event, not only for the new address, so the caller asserts
    // against a payment page that has rendered rather than one that has merely
    // been asked for.
    await this.page.waitForURL(new RegExp(`${url.payment}$`));
  }
}
