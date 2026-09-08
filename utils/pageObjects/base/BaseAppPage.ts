import { type Locator, type Page } from "@playwright/test";

/**
 * The consent banner is stored per browser context after the first acceptance,
 * so re-checking on every navigation would cost a timeout per call for nothing.
 */
const consentHandled = new WeakSet<Page>();

export abstract class BaseAppPage {
  readonly page: Page;
  readonly header: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAs: Locator;
  readonly consentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("#header");
    this.cartLink = page.getByRole("link", { name: "Cart", exact: true });
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.contactUsLink = page.getByRole("link", { name: "Contact us" });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    this.loggedInAs = page.getByText("Logged in as");
    this.consentButton = page.getByRole("button", { name: "Consent" });
  }

  protected async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.dismissConsentIfPresent();
  }

  /**
   * The banner renders inside a shadow root, which Playwright locators pierce
   * but document.querySelector does not.
   */
  async dismissConsentIfPresent(): Promise<void> {
    if (consentHandled.has(this.page)) {
      return;
    }

    try {
      await this.consentButton.waitFor({ state: "visible", timeout: 3_000 });
      await this.consentButton.click();
      await this.consentButton.waitFor({ state: "hidden", timeout: 5_000 });
    } catch {
      // Banner never appeared: third-party consent script blocked or already accepted.
    }

    consentHandled.add(this.page);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }
}
