# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/cart/cart.spec.ts >> Cart Page >> TC-19: Proceeding to checkout differs for a guest and a signed-in visitor
- Location: tests/cart/cart.spec.ts:55:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.product-information').getByRole('heading').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.product-information').getByRole('heading').first() with timeout 5000ms
  - waiting for locator('.product-information').getByRole('heading').first()

```

```yaml
- heading "This website is under heavy load (queue full)" [level=2]
- paragraph: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
```

# Test source

```ts
  1  | import { expect, type Locator, type Page } from "@playwright/test";
  2  | import { BaseAppPage } from "../baseAppPage";
  3  | import { AddToCartModal } from "../shared/addToCartModal";
  4  | import { url } from "../../url";
  5  | 
  6  | export class ProductDetailPage extends BaseAppPage {
  7  |   readonly productInformation: Locator;
  8  |   readonly productImage: Locator;
  9  |   readonly productName: Locator;
  10 |   readonly productPrice: Locator;
  11 |   readonly category: Locator;
  12 |   readonly availability: Locator;
  13 |   readonly condition: Locator;
  14 |   readonly brand: Locator;
  15 |   readonly quantityInput: Locator;
  16 |   readonly addToCartButton: Locator;
  17 |   readonly writeYourReviewTab: Locator;
  18 |   readonly reviewSection: Locator;
  19 |   readonly reviewNameInput: Locator;
  20 |   readonly reviewEmailInput: Locator;
  21 |   readonly reviewTextarea: Locator;
  22 |   readonly reviewSubmitButton: Locator;
  23 |   readonly reviewSuccessMessage: Locator;
  24 | 
  25 |   constructor(page: Page) {
  26 |     super(page);
  27 |     this.productInformation = page.locator(".product-information");
  28 |     // Sibling column to .product-information, not inside it — verified live.
  29 |     this.productImage = page.locator(".view-product img");
  30 |     this.productName = this.productInformation.getByRole("heading").first();
  31 |     this.productPrice = this.productInformation.getByText(/^Rs\. \d+/);
  32 |     // Each label sits in its own <b>; scope to the paragraph to get label +
  33 |     // value. Category's paragraph also carries an unrelated ad link appended
  34 |     // after the text, verified live, so assertions on it use `toContainText`.
  35 |     this.category = this.productInformation.locator("p", {
  36 |       hasText: "Category:",
  37 |     });
  38 |     this.availability = this.productInformation.locator("p", {
  39 |       hasText: "Availability:",
  40 |     });
  41 |     this.condition = this.productInformation.locator("p", {
  42 |       hasText: "Condition:",
  43 |     });
  44 |     this.brand = this.productInformation.locator("p", { hasText: "Brand:" });
  45 |     // Number input with no label and no data-qa hook.
  46 |     this.quantityInput = page.locator("#quantity");
  47 |     this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
  48 |     this.writeYourReviewTab = page.getByRole("link", {
  49 |       name: "Write Your Review",
  50 |     });
  51 |     // `.category-tab.shop-details-tab`, not `#review-form` or `#reviews`: the
  52 |     // latter two are both zero-height tab wrappers (floated children with no
  53 |     // clearfix, the same Bootstrap bug documented on VR-19), and neither
  54 |     // includes the "WRITE YOUR REVIEW" tab label, which is `#reviews`'s own
  55 |     // sibling rather than its parent. This one has a real height and holds
  56 |     // both. Verified live.
  57 |     this.reviewSection = page.locator(".category-tab.shop-details-tab");
  58 |     this.reviewNameInput = page.getByPlaceholder("Your Name");
  59 |     // Exact match: the footer's "Your email address" field would otherwise
  60 |     // match this placeholder as a substring.
  61 |     this.reviewEmailInput = page.getByPlaceholder("Email Address", {
  62 |       exact: true,
  63 |     });
  64 |     this.reviewTextarea = page.getByPlaceholder("Add Review Here!");
  65 |     this.reviewSubmitButton = page.getByRole("button", { name: "Submit" });
  66 |     this.reviewSuccessMessage = page.getByText("Thank you for your review.");
  67 |   }
  68 | 
  69 |   async gotoProductDetailPage(productId: number): Promise<void> {
  70 |     await this.goto(url.productDetail(productId));
  71 |     await expect(this.page).toHaveURL(
  72 |       new RegExp(`${url.productDetail(productId)}$`),
  73 |     );
> 74 |     await expect(this.productName).toBeVisible();
     |                                    ^ Error: expect(locator).toBeVisible() failed
  75 |   }
  76 | 
  77 |   async setQuantity(quantity: number): Promise<void> {
  78 |     await this.quantityInput.fill(String(quantity));
  79 |   }
  80 | 
  81 |   async addToCart(): Promise<AddToCartModal> {
  82 |     await this.addToCartButton.click();
  83 |     const modal = new AddToCartModal(this.page);
  84 |     await modal.waitForVisible();
  85 |     return modal;
  86 |   }
  87 | 
  88 |   async submitReview(
  89 |     name: string,
  90 |     email: string,
  91 |     review: string,
  92 |   ): Promise<void> {
  93 |     await this.reviewNameInput.fill(name);
  94 |     await this.reviewEmailInput.fill(email);
  95 |     await this.reviewTextarea.fill(review);
  96 |     await this.reviewSubmitButton.click();
  97 |   }
  98 | }
  99 | 
```