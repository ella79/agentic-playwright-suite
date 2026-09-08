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
    this.paymentForm = page.locator("#payment-form");
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
