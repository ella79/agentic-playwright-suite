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
    // The cart's controls are href-less anchors ("Proceed To Checkout" is
    // `<a class="btn btn-default check_out">` with no href in both the
    // anonymous and the signed-in state; the row delete icon is the same
    // shape). Their behaviour is attached by the site's own JavaScript, so a
    // click that lands before those scripts have executed is a silent no-op:
    // Playwright reports the click as successful and the application does
    // nothing. Arriving here via an in-page click only guarantees the new
    // markup, not that its scripts have run, so wait for the document to
    // finish loading before any caller interacts with it.
    await this.page.waitForURL(`**${url.cart}`);
  }
}
