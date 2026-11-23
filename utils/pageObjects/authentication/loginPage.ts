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
   * The session is waited for with `waitFor` rather than asserted. An
   * assertion inside a retry brings its own cap, and that cap, not the host,
   * was deciding how long a submission had to land: five seconds of a slow
   * host's time was enough to throw a submission away and send another, each
   * one starting the wait over until the test's own budget ran out and
   * reported a timeout that named nothing. `waitFor` is how Playwright waits
   * for anything else, so a submission that is merely slow is waited out, and
   * the resubmission is left for the one it was written for: a submission
   * that never landed.
   */
  async signIn(email: string, password: string): Promise<void> {
    await expect(async () => {
      await this.navigate(url.login);
      await this.login(email, password);
      await this.logoutLink.waitFor();
    }).toPass();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}
