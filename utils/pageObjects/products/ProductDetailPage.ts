import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";
import { AddToCartModal } from "../cart/modals/AddToCartModal";
import { url } from "../../url";

export class ProductDetailPage extends BaseAppPage {
  readonly productInformation: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly availability: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly reviewSection: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextarea: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productInformation = page.locator(".product-information");
    this.productName = this.productInformation.getByRole("heading").first();
    this.productPrice = this.productInformation.getByText(/^Rs\. \d+/);
    // The label sits in its own <b>; scope to the paragraph to get label + value.
    this.availability = this.productInformation.locator("p", {
      hasText: "Availability:",
    });
    // Number input with no label and no data-qa hook.
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    // #reviews is a zero-height tab wrapper; the form inside it is what renders.
    this.reviewSection = page.locator("#review-form");
    this.reviewNameInput = page.getByPlaceholder("Your Name");
    // Exact match: the footer's "Your email address" field would otherwise
    // match this placeholder as a substring.
    this.reviewEmailInput = page.getByPlaceholder("Email Address", {
      exact: true,
    });
    this.reviewTextarea = page.getByPlaceholder("Add Review Here!");
    this.reviewSubmitButton = page.getByRole("button", { name: "Submit" });
    this.reviewSuccessMessage = page.getByText("Thank you for your review.");
  }

  async gotoProductDetailPage(productId: number): Promise<void> {
    await this.goto(url.productDetail(productId));
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<AddToCartModal> {
    await this.addToCartButton.click();
    const modal = new AddToCartModal(this.page);
    await modal.waitForVisible();
    return modal;
  }

  async submitReview(
    name: string,
    email: string,
    review: string,
  ): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextarea.fill(review);
    await this.reviewSubmitButton.click();
  }
}
