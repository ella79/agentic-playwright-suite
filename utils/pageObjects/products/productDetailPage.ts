import { expect, type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { AddToCartModal } from "../shared/addToCartModal";
import { url } from "../../url";

export class ProductDetailPage extends BaseAppPage {
  readonly productInformation: Locator;
  readonly productImage: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly category: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly brand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly writeYourReviewTab: Locator;
  readonly reviewSection: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextarea: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productInformation = page.locator(".product-information");
    // Sibling column to .product-information, not inside it — verified live.
    this.productImage = page.locator(".view-product img");
    this.productName = this.productInformation.getByRole("heading").first();
    this.productPrice = this.productInformation.getByText(/^Rs\. \d+/);
    // Each label sits in its own <b>; scope to the paragraph to get label +
    // value. Category's paragraph also carries an unrelated ad link appended
    // after the text, verified live, so assertions on it use `toContainText`.
    this.category = this.productInformation.locator("p", {
      hasText: "Category:",
    });
    this.availability = this.productInformation.locator("p", {
      hasText: "Availability:",
    });
    this.condition = this.productInformation.locator("p", {
      hasText: "Condition:",
    });
    this.brand = this.productInformation.locator("p", { hasText: "Brand:" });
    // Number input with no label and no data-qa hook.
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.writeYourReviewTab = page.getByRole("link", {
      name: "Write Your Review",
    });
    // `.category-tab.shop-details-tab`, not `#review-form` or `#reviews`: the
    // latter two are both zero-height tab wrappers (floated children with no
    // clearfix, the same Bootstrap bug documented on VR-19), and neither
    // includes the "WRITE YOUR REVIEW" tab label, which is `#reviews`'s own
    // sibling rather than its parent. This one has a real height and holds
    // both. Verified live.
    this.reviewSection = page.locator(".category-tab.shop-details-tab");
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
    await expect(this.page).toHaveURL(
      new RegExp(`${url.productDetail(productId)}$`),
    );
    await expect(this.productName).toBeVisible();
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
