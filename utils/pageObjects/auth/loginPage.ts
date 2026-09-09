import { expect, type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { url } from "../../url";

/**
 * The application serves login and signup entry from one route, as two separate
 * forms. Both are modelled here because a user sees a single page.
 */
export class LoginPage extends BaseAppPage {
  readonly loginHeading: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  readonly signupHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

  readonly loginForm: Locator;
  readonly signupForm: Locator;

  constructor(page: Page) {
    super(page);
    // CSS: a form has no role until it carries an accessible name, and these
    // carry none. Scoped by action because the page holds two of them, and the
    // scope is what lets the fields inside be addressed by placeholder: both
    // forms have a field placeheld "Email Address".
    this.loginForm = page.locator('form[action="/login"]');
    this.signupForm = page.locator('form[action="/signup"]');

    this.loginHeading = page.getByRole("heading", {
      name: "Login to your account",
    });
    this.loginEmailInput = this.loginForm.getByPlaceholder("Email Address");
    this.loginPasswordInput = this.loginForm.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.loginErrorMessage = page.getByText(
      "Your email or password is incorrect!",
    );

    this.signupHeading = page.getByRole("heading", {
      name: "New User Signup!",
    });
    this.signupNameInput = this.signupForm.getByPlaceholder("Name");
    this.signupEmailInput = this.signupForm.getByPlaceholder("Email Address");
    this.signupButton = page.getByRole("button", { name: "Signup" });
    this.signupErrorMessage = page.getByText("Email Address already exist!");
  }

  async gotoLoginPage(): Promise<void> {
    await this.goto(url.login);
    await expect(this.page).toHaveURL(new RegExp(`${url.login}$`));
    await expect(this.loginHeading).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}
