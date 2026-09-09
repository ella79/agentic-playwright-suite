import { type Locator, type Page } from "@playwright/test";
import { BaseComponentPage } from "../baseComponentPage";
import { url } from "../../url";

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
    // The cart's controls are href-less anchors whose behaviour comes from the
    // site's own JavaScript, so a click landing before those scripts run is a
    // silent no-op: Playwright reports success and nothing happens. An in-page
    // click guarantees the new markup, not that its scripts ran, so wait for
    // the document to finish loading first.
    await this.page.waitForURL(`**${url.cart}`);
  }
}
