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
    await this.goto(url.login, this.loginHeading);
    await expect(this.page).toHaveURL(new RegExp(`${url.login}$`));
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
    // The submit replaces the document whichever way it goes: a session lands
    // on the home page, a rejection re-renders the form carrying its error.
    // Neither is a new address in both cases, so there is no URL to wait for —
    // the document itself is what the caller needs, and returning on the click
    // alone left it asserting against whatever was still on screen. TC-07 and
    // TC-08 both failed that way, on an error message and a header that were
    // never missing, only late.
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Signs in as a precondition, for a caller that needs a session rather than
   * proof that the form works; a case about the form itself drives
   * `gotoLoginPage` and `login` directly, and asserts its own outcome.
   *
   * Submitted again rather than waited on. The host sheds load on this POST
   * too, and what comes back then is a page instead of a session: the form
   * submits, and the header never gains the link an assertion could wait for.
   * Arriving at the form is part of the retry because that page is gone once
   * the submission lands somewhere else. Credentials that are genuinely wrong
   * fail every attempt, so this cannot turn a real failure into a pass.
   *
   * The session is asserted, not merely waited for, and the assertion's own
   * cap is the point rather than an oversight. An uncapped wait here was
   * tried: it waits out a slow submission, but a shed one has nothing to
   * wait for, and the wait then spends the test's whole budget without the
   * retry around it ever taking a turn. Waiting and retrying cannot both have
   * the budget; the cap is what hands it from one to the other, and the host
   * this suite runs against sheds submissions rather than merely delaying
   * them. Measured, not assumed: the uncapped version left the sign-in
   * reporting a bare test timeout with neither a session nor a rejection on
   * the page, which is the shed answer and the one only a resubmission
   * reaches.
   */
  async signIn(email: string, password: string): Promise<void> {
    await expect(async () => {
      await this.navigate(url.login);
      await this.login(email, password);
      await expect(this.logoutLink).toBeVisible();
    }).toPass();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
    // Either the account information form or this one again carrying its
    // error: both replace the document, neither is a single address to wait
    // for.
    await this.page.waitForLoadState("domcontentloaded");
  }
}
