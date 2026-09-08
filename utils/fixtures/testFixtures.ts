import { expect, test as base } from "@playwright/test";
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

/**
 * The cart's AJAX write endpoints. Both are GETs that mutate the session cart,
 * so re-issuing one is safe: it sets the same quantity or removes the same row.
 */
const CART_WRITE_ENDPOINTS =
  /automationexercise\.com\/(add_to_cart|delete_cart)\//;

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(THIRD_PARTY_HOSTS, (route) => route.abort());

    /**
     * The demo host sporadically sheds a cart write with a 503 — observed in a
     * trace as `GET /add_to_cart/1?quantity=1 -> 503` (261ms) on a page whose
     * every other request, scripts included, returned 200. The application's
     * own JavaScript ignores the failed response and surfaces nothing, so the
     * confirmation modal never opens and the test waits out its timeout on a
     * state that can no longer arrive.
     *
     * Re-issuing only that request keeps host capacity noise out of the
     * functional signal. It is one retry, not a loop, and it changes nothing
     * about what the tests assert: an endpoint that is actually broken still
     * returns 5xx twice and still fails the test.
     */
    await page.route(CART_WRITE_ENDPOINTS, async (route, request) => {
      if (request.method() !== "GET") {
        return route.fallback();
      }

      let response = await route.fetch();
      if (response.status() >= 500) {
        response = await route.fetch();
      }

      await route.fulfill({ response });
    });

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
      // login() submits the form and returns; the session only exists once
      // that POST has been processed. Navigating straight to /delete_account
      // can overtake it and arrive anonymously, which deletes nothing and
      // fails the assertion below for the wrong reason.
      await expect(homePage.logoutLink).toBeVisible();
    }

    await page.goto(url.deleteAccount);
    // A silent teardown failure would leak accounts run after run with nothing
    // surfacing, so cleanup asserts its own outcome.
    await expect(new ConfirmationPage(page).accountDeletedBanner).toBeVisible();
  },
});

export { expect } from "@playwright/test";
