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
  guestPage: Page;
}

/** Specs whose cases change the cart; the cart belongs to the account, so each case gets its own. */
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
    await hardenPage(page);

    if (!CART_SPECS.has(path.basename(testInfo.file))) {
      await use(page);
      return;
    }

    const account = buildAccount();
    const accounts = new AccountApiClient(request);

    // Drop the shared account's session before signing in as this one.
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

  /** A throwaway account per test, created and deleted through the API. */
  uniqueAccount: async ({ page, request }, use) => {
    const account: ActiveAccount = { ...buildAccount(), deleted: false };
    const accounts = new AccountApiClient(request);

    await signInAsNewAccount(page, accounts, account);

    await use(account);

    if (!account.deleted) {
      await removeAccount(accounts, account);
    }
  },

  /** A signed-out page, for a case that compares a guest with the signed-in visitor. */
  guestPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await hardenPage(page);
    await use(page);
    await context.close();
  },
});

/** Every page the suite drives gets the same protection from third-party noise. */
async function hardenPage(page: Page): Promise<void> {
  await page.route(
    (url) => !isAllowedRequest(url.href),
    (route) => route.abort(),
  );

  // Google's consent dialog can cover the page: accept it when it renders, and
  // remove the empty container it leaves, which still intercepts clicks, when
  // its script is blocked.
  await page.addLocatorHandler(
    page.locator(".fc-consent-root"),
    async (root) => {
      const consent = root.getByRole("button", { name: "Consent" });
      if (await consent.isVisible()) {
        await consent.click();
      } else {
        await root.evaluate((el) => el.remove());
      }
    },
  );

  // One retry on a cart write the host sheds with a 5xx; a broken endpoint
  // still fails twice.
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
}

/** The login API sets no session cookie, so the browser signs in through the form. */
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

/** Confirms the deletion, so a failed cleanup surfaces instead of leaking accounts. */
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
