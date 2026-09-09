import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
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
    // <form id="payment-form"> has a zero-height box: the app uses Bootstrap 4
    // `.form-row` markup with Bootstrap 3 CSS, which has no such rule and so no
    // clearfix, leaving every row holding only floated children. Playwright
    // refuses to screenshot an empty bounding box, so capture the parent grid
    // column, which is the form's real visual box and holds nothing else.
    // Anchored to the form's id so a Bootstrap upgrade cannot retarget it.
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
