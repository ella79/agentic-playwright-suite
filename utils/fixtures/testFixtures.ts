import path from "path";
import { expect, test as base, type Page } from "@playwright/test";
import { AccountApiClient } from "../apiClients/accountApiClient";
import { applyAllureLabels } from "./allureLabels";
import {
  AccountInfoPage,
  CartPage,
  CheckoutPage,
  ConfirmationPage,
  HomePage,
  LoginPage,
  OrderConfirmationPage,
  PaymentPage,
  ProductDetailPage,
  ProductsPage,
} from "../pageObjects";
import { buildAccount, type TestAccount } from "../testData";

export interface ActiveAccount extends TestAccount {
  /** Set by a test that deletes the account itself, so teardown skips cleanup. */
  deleted: boolean;
}

/**
 * Page objects reach a test as fixtures, the shape Playwright's fixtures
 * documentation recommends: built on demand for the tests that name them, so a
 * spec declares the surfaces it touches in its signature.
 */
interface PageObjects {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  loginPage: LoginPage;
  accountInfoPage: AccountInfoPage;
  confirmationPage: ConfirmationPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  orderConfirmationPage: OrderConfirmationPage;
}

interface Fixtures extends PageObjects {
  uniqueAccount: ActiveAccount;
}

/**
 * The spec files whose cases change the cart. The cart belongs to the
 * account, so through the shared account they all shared one cart, and the
 * parallel CI jobs emptied each other's carts mid-test (VR-28, verified in two
 * traces). Each case in these files gets an account created through the API,
 * is signed into it through the login form, and has it deleted afterwards.
 */
const CART_SPECS = new Set([
  "cart.spec.ts",
  "checkout.spec.ts",
  "payment.spec.ts",
  "confirmation.spec.ts",
  "cart.vr.spec.ts",
  "checkout.vr.spec.ts",
  "payment.vr.spec.ts",
  "confirmation.vr.spec.ts",
]);

/**
 * Everything the product itself needs to render: its own origin, plus the two
 * Google Fonts hosts its stylesheets reference. Everything else — ads,
 * analytics, consent management, the Maps embed on Contact Us, which no test
 * depends on — is third-party noise, verified against every host the site
 * actually requests across a full run of every page.
 *
 * An allowlist, not a blocklist of known-bad vendors: a blocklist can only
 * ever cover the hosts someone thought to name, and this one already missed
 * one live. Funding Choices' own dialog root has been seen built without
 * ever requesting `fundingchoicesmessages.google.com`, so naming that host
 * more precisely would not have closed the gap either — verified against a
 * real captured failure, not assumed.
 */
const ALLOWED_HOSTS = new Set([
  "automationexercise.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]);

function isAllowedRequest(rawUrl: string): boolean {
  let requestUrl: URL;
  try {
    requestUrl = new URL(rawUrl);
  } catch {
    return true;
  }
  if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") {
    return true;
  }
  return ALLOWED_HOSTS.has(requestUrl.hostname);
}

/**
 * The cart's AJAX write endpoints. Both are GETs that mutate the session cart,
 * so re-issuing one is safe: it sets the same quantity or removes the same row.
 */
const CART_WRITE_ENDPOINTS =
  /automationexercise\.com\/(add_to_cart|delete_cart)\//;

export const test = base.extend<Fixtures & { allureLabels: void }>({
  /**
   * Labels every result so the dashboard can group and filter it: the two
   * suites separate, each area becomes its own branch, and a case links to the
   * plan that justifies it. Automatic, because a label applied only where
   * someone remembered is a label the report cannot rely on.
   */
  allureLabels: [
    // The empty pattern is Playwright's own signature for a fixture that
    // depends on nothing; naming a dependency here would force it to be built.
    async ({}, use, testInfo) => {
      await applyAllureLabels(testInfo);
      await use();
    },
    { auto: true },
  ],

  page: async ({ page, request }, use, testInfo) => {
    await page.route(
      (url) => !isAllowedRequest(url.href),
      (route) => route.abort(),
    );

    /**
     * Funding Choices still injects its dialog root with its own script
     * blocked above: the container renders empty, but it keeps intercepting
     * clicks underneath it. Seen live as a real failure — Playwright's own
     * actionability check reported `<div class="fc-dialog-overlay">…</div>
     * intercepts pointer events` on an "Add to cart" click with nothing to do
     * with consent. There is never content in it to dismiss, only a hitbox
     * left behind to disarm.
     *
     * `addLocatorHandler` is Playwright's own mechanism for exactly this: an
     * unpredictable overlay that must be cleared before the action underneath
     * it can proceed. Registered once here, it survives every navigation
     * within the test, fires only when the element is actually blocking
     * something, and Playwright itself re-verifies it is gone before
     * retrying — no separate observer racing the page's own timing.
     *
     * The handler targets `.fc-consent-root`, the outer container, not
     * `.fc-dialog-overlay` alone: removing only the inner overlay left the
     * root itself still intercepting the next click, verified live against a
     * reliable reproduction of the real element — the failure just moved from
     * "`.fc-dialog-overlay` intercepts" to "`.fc-consent-root` intercepts".
     * Removing the root removes the overlay along with it.
     */
    await page.addLocatorHandler(
      page.locator(".fc-consent-root"),
      async (root) => {
        await root.evaluate((el) => el.remove());
      },
    );

    /**
     * The demo host sporadically sheds a cart write with a 503, seen in a trace
     * as `GET /add_to_cart/1?quantity=1 -> 503` on a page where every other
     * request returned 200. The app ignores the failure silently, so the modal
     * never opens and the test times out on a state that cannot arrive.
     *
     * One retry on that request, not a loop. It changes nothing the tests
     * assert: an endpoint that is genuinely broken still fails twice.
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

    if (!CART_SPECS.has(path.basename(testInfo.file))) {
      await use(page);
      return;
    }

    const account = buildAccount();
    const accounts = new AccountApiClient(request);

    // The context starts signed in as the shared account; dropping its
    // session cookie is what lets the login below sign in as this one.
    await page.context().clearCookies();
    await signInAsNewAccount(page, accounts, account);

    await use(page);

    await removeAccount(accounts, account);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountInfoPage: async ({ page }, use) => {
    await use(new AccountInfoPage(page));
  },

  confirmationPage: async ({ page }, use) => {
    await use(new ConfirmationPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },

  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },

  /**
   * A throwaway account for the test, created and deleted through the API and
   * signed in through the login form. Each test owns its own account, so
   * parallel workers never contend and no test inherits state from another.
   */
  uniqueAccount: async ({ page, request }, use) => {
    const account: ActiveAccount = { ...buildAccount(), deleted: false };
    const accounts = new AccountApiClient(request);

    await signInAsNewAccount(page, accounts, account);

    await use(account);

    if (!account.deleted) {
      await removeAccount(accounts, account);
    }
  },
});

/**
 * Creates the account through the API and signs the page into it through the
 * login form, the only way to a browser session: the login API answers no
 * cookie. The signup form and the cleanup pages this replaces were each one
 * more request for the demo host to answer 503, as it did in run 241.
 */
async function signInAsNewAccount(
  page: Page,
  accounts: AccountApiClient,
  account: TestAccount,
): Promise<void> {
  const created = await accounts.createAccount(account);
  expect(created.responseCode, `createAccount: ${created.message}`).toBe(201);

  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.login(account.email, account.password);
  await expect(loginPage.logoutLink).toBeVisible();
}

/**
 * A silent cleanup failure would leak accounts run after run with nothing
 * surfacing, so the deletion confirms its own outcome.
 */
async function removeAccount(
  accounts: AccountApiClient,
  account: TestAccount,
): Promise<void> {
  const deleted = await accounts.deleteAccount(account.email, account.password);
  expect(deleted.responseCode, `deleteAccount: ${deleted.message}`).toBe(200);
  const lookup = await accounts.getUserDetailByEmail(account.email);
  expect(lookup.responseCode).toBe(404);
}

export { expect } from "@playwright/test";
