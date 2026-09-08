import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";
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
    this.accountForm = page.locator('form[action="/signup"]');
    // Radios carry values but no accessible names in this markup.
    this.titleMrsRadio = page.locator("#id_gender2");
    this.nameInput = page.getByTestId("name");
    this.emailInput = page.getByTestId("email");
    this.passwordInput = page.getByTestId("password");
    this.birthDaySelect = page.getByTestId("days");
    this.birthMonthSelect = page.getByTestId("months");
    this.birthYearSelect = page.getByTestId("years");
    this.newsletterCheckbox = page.locator("#newsletter");
    this.specialOffersCheckbox = page.locator("#optin");
    this.firstNameInput = page.getByTestId("first_name");
    this.lastNameInput = page.getByTestId("last_name");
    this.companyInput = page.getByTestId("company");
    this.addressInput = page.getByTestId("address");
    this.countrySelect = page.getByTestId("country");
    this.stateInput = page.getByTestId("state");
    this.cityInput = page.getByTestId("city");
    this.zipcodeInput = page.getByTestId("zipcode");
    this.mobileNumberInput = page.getByTestId("mobile_number");
    this.createAccountButton = page.getByTestId("create-account");
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
