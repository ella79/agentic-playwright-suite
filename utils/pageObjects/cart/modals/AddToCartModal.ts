import { type Locator, type Page } from "@playwright/test";
import { BaseComponentPage } from "../../base/BaseComponentPage";

export class AddToCartModal extends BaseComponentPage {
  readonly heading: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    // Bootstrap modal without a dialog role; identified by its id.
    super(page, page.locator("#cartModal"));
    this.heading = this.root.getByText("Added!");
    // Rendered as an anchor without href, so it carries no link role.
    this.viewCartLink = this.root.getByText("View Cart");
    this.continueShoppingButton = this.root.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  async viewCart(): Promise<void> {
    await this.viewCartLink.click();
  }
}
