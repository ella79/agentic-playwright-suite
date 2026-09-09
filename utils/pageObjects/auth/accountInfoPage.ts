import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { type TestAccount } from "../../testData";

/**
 * Second step of registration: the full account and address form reached after
 * submitting name and email on the signup entry form.
 */
export class AccountInfoPage extends BaseAppPage {
  readonly enterAccountInfoHeading: Locator;
  readonly accountForm: Locator;
  readonly titleMrsRadio: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly birthDaySelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthYearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly specialOffersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.enterAccountInfoHeading = page.getByText("Enter Account Information");
    // CSS: the form has no accessible name, so it has no form role to
    // address. Scoped by action because the page carries more than one form.
    this.accountForm = page.locator('form[action="/signup"]');
    this.titleMrsRadio = page.getByLabel("Mrs.");
    this.nameInput = page.getByLabel("Name *", { exact: true });
    this.emailInput = page.getByLabel("Email *", { exact: true });
    this.passwordInput = page.getByLabel("Password *");
    // Test ids: the three date selects carry no label and no placeholder.
    this.birthDaySelect = page.getByTestId("days");
    this.birthMonthSelect = page.getByTestId("months");
    this.birthYearSelect = page.getByTestId("years");
    this.newsletterCheckbox = page.getByLabel("Sign up for our newsletter!");
    this.specialOffersCheckbox = page.getByLabel(
      "Receive special offers from our partners!",
    );
    this.firstNameInput = page.getByLabel("First name *");
    this.lastNameInput = page.getByLabel("Last name *");
    this.companyInput = page.getByLabel("Company", { exact: true });
    this.addressInput = page.getByLabel(
      "Address * (Street address, P.O. Box, Company name, etc.)",
    );
    this.countrySelect = page.getByLabel("Country *");
    this.stateInput = page.getByLabel("State *");
    this.cityInput = page.getByLabel("City *");
    // Test id: the only field on this form with no label element.
    this.zipcodeInput = page.getByTestId("zipcode");
    this.mobileNumberInput = page.getByLabel("Mobile Number *");
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });
  }

  async fillAccountDetails(account: TestAccount): Promise<void> {
    await this.titleMrsRadio.check();
    await this.passwordInput.fill(account.password);
    await this.birthDaySelect.selectOption(account.birthDay);
    await this.birthMonthSelect.selectOption(account.birthMonth);
    await this.birthYearSelect.selectOption(account.birthYear);
    await this.newsletterCheckbox.check();
    await this.specialOffersCheckbox.check();
  }

  async fillAddressDetails(account: TestAccount): Promise<void> {
    await this.firstNameInput.fill(account.firstName);
    await this.lastNameInput.fill(account.lastName);
    await this.companyInput.fill(account.company);
    await this.addressInput.fill(account.address);
    await this.countrySelect.selectOption(account.country);
    await this.stateInput.fill(account.state);
    await this.cityInput.fill(account.city);
    await this.zipcodeInput.fill(account.zipcode);
    await this.mobileNumberInput.fill(account.mobileNumber);
  }

  async createAccount(account: TestAccount): Promise<void> {
    await this.fillAccountDetails(account);
    await this.fillAddressDetails(account);
    await this.createAccountButton.click();
  }
}
