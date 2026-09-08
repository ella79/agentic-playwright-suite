import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { url } from "../../url";

export class HomePage extends BaseAppPage {
  readonly featuresItemsHeading: Locator;
  readonly featuresItemsSection: Locator;
  readonly subscriptionHeading: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitButton: Locator;
  readonly subscriptionSuccessMessage: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.featuresItemsHeading = page.getByRole("heading", {
      name: "Features Items",
    });
    // No accessible name on the products container: it is a layout wrapper.
    this.featuresItemsSection = page.locator(".features_items");
    this.subscriptionHeading = page.getByRole("heading", {
      name: "Subscription",
    });
    this.subscriptionEmailInput = page.getByPlaceholder("Your email address");
    // Icon-only submit control with no accessible name.
    this.subscriptionSubmitButton = page.locator("#subscribe");
    this.subscriptionSuccessMessage = page.getByText(
      "You have been successfully subscribed!",
    );
    this.footer = page.locator("#footer");
  }

  async gotoHomePage(): Promise<void> {
    await this.goto(url.home);
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }
}
