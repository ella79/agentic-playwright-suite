import { type Locator, type Page } from "@playwright/test";
import { BaseComponentPage } from "../baseComponentPage";

/**
 * Shown when an anonymous visitor tries to check out: the application requires
 * an account before the checkout flow becomes reachable.
 */
export class CheckoutGuardModal extends BaseComponentPage {
  readonly heading: Locator;
  readonly message: Locator;
  readonly registerLoginLink: Locator;
  readonly continueOnCartButton: Locator;

  constructor(page: Page) {
    // Bootstrap modal without a dialog role; identified by its id.
    super(page, page.locator("#checkoutModal"));
    this.heading = this.root.getByText("Checkout", { exact: true });
    this.message = this.root.getByText(
      "Register / Login account to proceed on checkout.",
    );
    this.registerLoginLink = this.root.getByRole("link", {
      name: "Register / Login",
    });
    this.continueOnCartButton = this.root.getByRole("button", {
      name: "Continue On Cart",
    });
  }
}
