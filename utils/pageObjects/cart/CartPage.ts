import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";
import { CheckoutGuardModal } from "./modals/CheckoutGuardModal";
import { url } from "../../url";

export class CartPage extends BaseAppPage {
  readonly cartItemsSection: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItemsSection = page.locator("#cart_items");
    this.cartTable = page.locator("#cart_info");
    this.cartRows = page.locator("#cart_info tbody tr");
    this.emptyCartMessage = page.getByText("Cart is empty!");
    // Rendered as an anchor without href, so it carries no link role.
    this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
  }

  async gotoCartPage(): Promise<void> {
    await this.goto(url.cart);
  }

  getRow(productName: string): Locator {
    return this.cartRows.filter({ hasText: productName });
  }

  getRowQuantity(productName: string): Locator {
    return this.getRow(productName).locator(".cart_quantity");
  }

  getRowTotal(productName: string): Locator {
    return this.getRow(productName).locator(".cart_total_price");
  }

  async removeProduct(productName: string): Promise<void> {
    // Icon-only delete control with no accessible name.
    await this.getRow(productName).locator(".cart_quantity_delete").click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  /**
   * Anonymous visitors get the account guard instead of the checkout page.
   */
  async proceedToCheckoutAsGuest(): Promise<CheckoutGuardModal> {
    await this.proceedToCheckout();
    const modal = new CheckoutGuardModal(this.page);
    await modal.waitForVisible();
    return modal;
  }
}
