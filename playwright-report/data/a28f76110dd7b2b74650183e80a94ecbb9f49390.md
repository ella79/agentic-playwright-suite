# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/payment/payment.spec.ts >> Payment Page >> TC-21: The payment form collects card details and completes the order
- Location: tests/payment/payment.spec.ts:8:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator:  getByRole('heading', { name: 'Payment' })
Expected: visible
Received: undefined

```

# Page snapshot

```yaml
- generic [ref=f7e1]:
  - banner [ref=f7e2]:
    - generic [ref=f7e5]:
      - link [ref=f7e8]:
        - /url: /
        - img "Website for automation practice" [ref=f7e9]
      - list [ref=f7e12]:
        - listitem [ref=f7e13]:
          - link " Home" [ref=f7e14]:
            - /url: /
            - generic [ref=f7e15]: 
            - text: Home
        - listitem [ref=f7e16]:
          - link " Products" [ref=f7e17]:
            - /url: /products
            - generic [ref=f7e18]: 
            - text: Products
        - listitem [ref=f7e19]:
          - link " Cart" [ref=f7e20]:
            - /url: /view_cart
            - generic [ref=f7e21]: 
            - text: Cart
        - listitem [ref=f7e22]:
          - link " Logout" [ref=f7e23]:
            - /url: /logout
            - generic [ref=f7e24]: 
            - text: Logout
        - listitem [ref=f7e25]:
          - link " Delete Account" [ref=f7e26]:
            - /url: /delete_account
            - generic [ref=f7e27]: 
            - text: Delete Account
        - listitem [ref=f7e28]:
          - link " Test Cases" [ref=f7e29]:
            - /url: /test_cases
            - generic [ref=f7e30]: 
            - text: Test Cases
        - listitem [ref=f7e31]:
          - link " API Testing" [ref=f7e32]:
            - /url: /api_list
            - generic [ref=f7e33]: 
            - text: API Testing
        - listitem [ref=f7e34]:
          - link " Video Tutorials" [ref=f7e35]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=f7e36]: 
            - text: Video Tutorials
        - listitem [ref=f7e37]:
          - link " Contact us" [ref=f7e38]:
            - /url: /contact_us
            - generic [ref=f7e39]: 
            - text: Contact us
        - listitem [ref=f7e40]:
          - generic [ref=f7e41]:
            - generic [ref=f7e42]: 
            - text: Logged in as Jon Doe
  - generic [ref=f7e44]:
    - list [ref=f7e46]:
      - listitem [ref=f7e47]:
        - link "Home" [ref=f7e48]:
          - /url: /
      - listitem [ref=f7e49]: Checkout
    - heading "Address Details" [level=2] [ref=f7e51]
    - generic [ref=f7e53]:
      - list [ref=f7e55]:
        - listitem [ref=f7e56]:
          - heading "Your delivery address" [level=3] [ref=f7e57]
        - listitem [ref=f7e58]: Mr. Jon Doe
        - listitem [ref=f7e59]: Acme Inc.
        - listitem [ref=f7e60]: 123 Main Street
        - listitem
        - listitem [ref=f7e61]: Springfield Ontario A1A 1A1
        - listitem [ref=f7e62]: Canada
        - listitem [ref=f7e63]: 416-555-0123
      - list [ref=f7e65]:
        - listitem [ref=f7e66]:
          - heading "Your billing address" [level=3] [ref=f7e67]
        - listitem [ref=f7e68]: Mr. Jon Doe
        - listitem [ref=f7e69]: Acme Inc.
        - listitem [ref=f7e70]: 123 Main Street
        - listitem
        - listitem [ref=f7e71]: Springfield Ontario A1A 1A1
        - listitem [ref=f7e72]: Canada
        - listitem [ref=f7e73]: 416-555-0123
    - heading "Review Your Order" [level=2] [ref=f7e75]
    - table [ref=f7e77]:
      - rowgroup [ref=f7e78]:
        - row [ref=f7e79]:
          - cell "Item" [ref=f7e80]
          - cell "Description" [ref=f7e81]
          - cell "Price" [ref=f7e82]
          - cell "Quantity" [ref=f7e83]
          - cell "Total" [ref=f7e84]
          - cell [ref=f7e85]
      - rowgroup [ref=f7e86]:
        - row [ref=f7e87]:
          - cell [ref=f7e88]:
            - link [ref=f7e89]:
              - /url: ""
              - img "Product Image" [ref=f7e90]
          - cell [ref=f7e91]:
            - heading [level=4] [ref=f7e92]:
              - link "Blue Top" [ref=f7e93]:
                - /url: /product_details/1
            - paragraph [ref=f7e94]: Women > Tops
          - cell [ref=f7e95]:
            - paragraph [ref=f7e96]: Rs. 500
          - cell [ref=f7e97]:
            - button "1" [ref=f7e98] [cursor=pointer]
          - cell [ref=f7e99]:
            - paragraph [ref=f7e100]: Rs. 500
        - row [ref=f7e101]:
          - cell [ref=f7e102]
          - cell [ref=f7e103]
          - cell [ref=f7e104]:
            - heading "Total Amount" [level=4] [ref=f7e105]
          - cell [ref=f7e106]:
            - paragraph [ref=f7e107]: Rs. 500
    - generic [ref=f7e108]:
      - generic [ref=f7e109]: If you would like to add a comment about your order, please write it in the field below.
      - textbox [ref=f7e110]
    - link "Place Order" [active] [ref=f7e112] [cursor=pointer]:
      - /url: /payment
  - contentinfo [ref=f7e113]:
    - generic [ref=f7e118]:
      - heading "Subscription" [level=2] [ref=f7e119]
      - generic [ref=f7e120]:
        - textbox "Your email address" [ref=f7e121]
        - button "" [ref=f7e122] [cursor=pointer]
        - paragraph [ref=f7e124]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=f7e128]: Copyright © 2021 All rights reserved
  - link "" [ref=f7e129]:
    - /url: "#top"
```

# Test source

```ts
  1  | // spec: specs/test-plans/payment-test-plan.md
  2  | // seed: specs/seed.spec.ts
  3  | import { expect, test } from "../../utils/fixtures/testFixtures";
  4  | import { paymentCard, products } from "../../utils/testData";
  5  | import { urlPattern } from "../../utils/url";
  6  | 
  7  | test.describe("Payment Page", () => {
  8  |   test("TC-21: The payment form collects card details and completes the order", async ({
  9  |     page,
  10 |     cartPage,
  11 |     productDetailPage,
  12 |     checkoutPage,
  13 |     paymentPage,
  14 |   }) => {
  15 |     await test.step("reach the payment page", async () => {
  16 |       await cartPage.clearCart();
  17 |       await productDetailPage.gotoProductDetailPage(products.blueTop.id);
  18 |       const modal = await productDetailPage.addToCart();
  19 |       await modal.viewCart();
  20 | 
  21 |       await cartPage.proceedToCheckout();
  22 |       await checkoutPage.placeOrder();
  23 |     });
  24 | 
  25 |     await test.step("every field is visible before submitting", async () => {
> 26 |       await expect(paymentPage.paymentHeading).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  27 |       await expect(paymentPage.nameOnCardInput).toBeVisible();
  28 |       await expect(paymentPage.cardNumberInput).toBeVisible();
  29 |       await expect(paymentPage.cvcInput).toBeVisible();
  30 |       await expect(paymentPage.expiryMonthInput).toBeVisible();
  31 |       await expect(paymentPage.expiryYearInput).toBeVisible();
  32 |     });
  33 | 
  34 |     await test.step("submitting completes the order", async () => {
  35 |       await paymentPage.payAndConfirmOrder(paymentCard);
  36 |       await expect(page).toHaveURL(urlPattern.orderPlaced);
  37 |     });
  38 |   });
  39 | });
  40 | 
```