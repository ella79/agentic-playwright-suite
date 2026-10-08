import { expect, type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { CheckoutGuardModal } from "../shared/checkoutGuardModal";
import { url } from "../../url";

export class CartPage extends BaseAppPage {
  readonly cartItemsSection: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly emptyCartMessage: Locator;
  readonly homeBreadcrumbLink: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // CSS: the section and the table wrapper are layout containers with no
    // role and no accessible name, and `getByRole("table")` resolves to the
    // <table> nested inside `#cart_info` rather than the wrapper the capture
    // needs. The rows are reached through the wrapper for the same reason.
    // Verified live.
    this.cartItemsSection = page.locator("#cart_items");
    this.cartTable = page.locator("#cart_info");
    this.cartRows = page.locator("#cart_info tbody tr");
    this.emptyCartMessage = page.getByText(
      "Cart is empty! Click here to buy products.",
    );
    // Scoped to the breadcrumb, not the header: both carry a "Home" link, and
    // this one's accessible name has no leading icon space, unlike the
    // header's. Verified live.
    this.homeBreadcrumbLink = page
      .getByRole("list")
      .filter({ hasText: "Shopping Cart" })
      .getByRole("link", { name: "Home" });
    // Rendered as an anchor without href, so it carries no link role.
    this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
  }

  async gotoCartPage(): Promise<void> {
    await this.goto(url.cart);
    await expect(this.page).toHaveURL(new RegExp(`${url.cart}$`));
  }

  getRow(productName: string): Locator {
    return this.cartRows.filter({ hasText: productName });
  }

  /**
   * The quantity cell is the only one holding a control: the site renders the
   * number as a disabled button, which is what tells it apart from the price
   * and total cells. Verified live.
   */
  getRowQuantity(productName: string): Locator {
    return this.getRow(productName)
      .getByRole("cell")
      .filter({ has: this.page.getByRole("button") });
  }

  /**
   * CSS: the row holds three paragraphs, price, quantity and total, none of
   * them named, so `getByRole("paragraph")` cannot pick this one out. Verified
   * live.
   */
  getRowTotal(productName: string): Locator {
    return this.getRow(productName).locator(".cart_total_price");
  }

  async removeProduct(productName: string): Promise<void> {
    // Icon-only delete control with no accessible name.
    await this.getRow(productName).locator(".cart_quantity_delete").click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    // waitForURL waits for the load event, not only the new URL. A capture
    // measured before checkout.css lands comes out 30px short (VR-28).
    await this.page.waitForURL(new RegExp(`${url.checkout}$`));
  }

  /**
   * A case that changes the cart runs on an account of its own (see
   * `testFixtures.ts`), so this normally finds the cart empty; it stays so no
   * case depends on that.
   */
  async clearCart(): Promise<void> {
    await this.gotoCartPage();
    let remaining = await this.cartRows.count();

    while (remaining > 0) {
      await this.cartRows.first().locator(".cart_quantity_delete").click();
      await expect(this.cartRows).toHaveCount(remaining - 1);
      remaining -= 1;
    }
  }

  /**
   * Anonymous visitors get the account guard instead of the checkout page.
   */
  async proceedToCheckoutAsGuest(): Promise<CheckoutGuardModal> {
    // Not proceedToCheckout(): a guest never navigates, so waiting for the
    // checkout URL would time out.
    await this.proceedToCheckoutButton.click();
    const modal = new CheckoutGuardModal(this.page);
    await modal.waitForVisible();
    return modal;
  }
}
