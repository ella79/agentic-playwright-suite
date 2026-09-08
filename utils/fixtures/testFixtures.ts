import { test as base } from "@playwright/test";
import {
  AccountInfoPage,
  ConfirmationPage,
  HomePage,
  LoginPage,
} from "../pageObjects";
import { buildAccount, type TestAccount } from "../testData";
import { url } from "../url";

export interface ActiveAccount extends TestAccount {
  /** Set by a test that deletes the account itself, so teardown skips cleanup. */
  deleted: boolean;
}

interface Fixtures {
  uniqueAccount: ActiveAccount;
}

/**
 * Ad, analytics, and consent-management traffic. None of it belongs to the
 * product under test, and all of it injects layout shifts and timing noise.
 */
const THIRD_PARTY_HOSTS =
  /(googlesyndication|doubleclick|googletagservices|googletagmanager|google-analytics|adtrafficquality|fundingchoicesmessages)\./;

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(THIRD_PARTY_HOSTS, (route) => route.abort());
    await use(page);
  },

  /**
   * Registers a throwaway account for the test and removes it afterwards.
   * Each test owns its own account, so parallel workers never contend and no
   * test inherits state from another.
   */
  uniqueAccount: async ({ page }, use) => {
    const account: ActiveAccount = { ...buildAccount(), deleted: false };

    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.startSignup(account.name, account.email);

    const accountInfoPage = new AccountInfoPage(page);
    await accountInfoPage.createAccount(account);

    const confirmationPage = new ConfirmationPage(page);
    await confirmationPage.continueButton.waitFor({ state: "visible" });
    await confirmationPage.continue();

    await use(account);

    if (account.deleted) {
      return;
    }

    const homePage = new HomePage(page);
    await homePage.gotoHomePage();
    const stillSignedIn = await homePage.logoutLink
      .isVisible()
      .catch(() => false);

    if (!stillSignedIn) {
      await loginPage.gotoLoginPage();
      await loginPage.login(account.email, account.password);
    }

    await page.goto(url.deleteAccount);
  },
});

export { expect } from "@playwright/test";
