# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/payment/payment.spec.ts >> Payment Page >> TC-21: The payment form collects card details and completes the order
- Location: tests/payment/payment.spec.ts:8:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: Host unavailable: /api/deleteAccount answered HTTP 503 with a page instead of JSON
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Place Order' })

```

# Page snapshot

```yaml
- generic [active] [ref=f6e1]:
  - heading "This website is under heavy load (queue full)" [level=2] [ref=f6e2]
  - paragraph [ref=f6e3]: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
```

# Test source

```ts
  1  | import { type Locator, type Page } from "@playwright/test";
  2  | import { BaseAppPage } from "../baseAppPage";
  3  | 
  4  | export class CheckoutPage extends BaseAppPage {
  5  |   readonly addressDetailsHeading: Locator;
  6  |   readonly deliveryAddress: Locator;
  7  |   readonly billingAddress: Locator;
  8  |   readonly orderReviewHeading: Locator;
  9  |   readonly orderTable: Locator;
  10 |   readonly orderRows: Locator;
  11 |   readonly commentTextarea: Locator;
  12 |   readonly placeOrderLink: Locator;
  13 | 
  14 |   constructor(page: Page) {
  15 |     super(page);
  16 |     this.addressDetailsHeading = page.getByRole("heading", {
  17 |       name: "Address Details",
  18 |     });
  19 |     this.deliveryAddress = page
  20 |       .getByRole("list")
  21 |       .filter({ hasText: "Your delivery address" });
  22 |     this.billingAddress = page
  23 |       .getByRole("list")
  24 |       .filter({ hasText: "Your billing address" });
  25 |     this.orderReviewHeading = page.getByRole("heading", {
  26 |       name: "Review Your Order",
  27 |     });
  28 |     // CSS: a layout wrapper around the order <table>, addressed the same way
  29 |     // as the cart's. Verified live.
  30 |     this.orderTable = page.locator("#cart_info");
  31 |     // The same table also renders a trailing Total Amount row with no
  32 |     // product id; scoping to `product-<id>` rows excludes it. Verified live.
  33 |     this.orderRows = page.locator('#cart_info tbody tr[id^="product-"]');
  34 |     // Textarea with neither a label nor a placeholder.
  35 |     this.commentTextarea = page.locator('textarea[name="message"]');
  36 |     this.placeOrderLink = page.getByRole("link", { name: "Place Order" });
  37 |   }
  38 | 
  39 |   async addOrderComment(comment: string): Promise<void> {
  40 |     await this.commentTextarea.fill(comment);
  41 |   }
  42 | 
  43 |   async placeOrder(): Promise<void> {
> 44 |     await this.placeOrderLink.click();
     |                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  45 |   }
  46 | }
  47 | 
```