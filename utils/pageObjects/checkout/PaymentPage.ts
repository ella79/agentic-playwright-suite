import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";
import { type paymentCard } from "../../testData";

export class PaymentPage extends BaseAppPage {
  readonly paymentHeading: Locator;
  readonly paymentForm: Locator;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page);
    this.paymentHeading = page.getByRole("heading", { name: "Payment" });
    // The <form id="payment-form"> itself has a zero-height box: the app wraps
    // every field in a Bootstrap 4 `.form-row`, but ships Bootstrap 3 CSS, which
    // has no `.form-row` rule and therefore no clearfix. Each row contains only
    // floated `.col-*` children, so the rows — and the form — collapse to
    // height 0. The form still renders correctly because its parent grid column
    // is floated and so contains the floats. Screenshotting the form directly is
    // impossible (Playwright reports "element is not visible" for an empty
    // bounding box), so capture that parent column, which is the form's real
    // visual box and holds nothing else. Anchored to the form's id rather than
    // the grid class so a Bootstrap upgrade does not silently retarget it.
    this.paymentForm = page.locator("div:has(> #payment-form)");
    this.nameOnCardInput = page.getByTestId("name-on-card");
    this.cardNumberInput = page.getByTestId("card-number");
    this.cvcInput = page.getByTestId("cvc");
    this.expiryMonthInput = page.getByTestId("expiry-month");
    this.expiryYearInput = page.getByTestId("expiry-year");
    this.payButton = page.getByTestId("pay-button");
  }

  async payAndConfirmOrder(card: typeof paymentCard): Promise<void> {
    await this.nameOnCardInput.fill(card.nameOnCard);
    await this.cardNumberInput.fill(card.cardNumber);
    await this.cvcInput.fill(card.cvc);
    await this.expiryMonthInput.fill(card.expiryMonth);
    await this.expiryYearInput.fill(card.expiryYear);
    await this.payButton.click();
  }
}
