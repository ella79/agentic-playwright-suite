# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/login/login.spec.ts >> Login Page >> TC-09: Logging out returns the visitor to the guest state
- Location: tests/login/login.spec.ts:45:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/account deleted/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/account deleted/i) with timeout 5000ms
  - waiting for getByText(/account deleted/i)

```

```yaml
- heading "This website is under heavy load (queue full)" [level=2]
- paragraph: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
```

# Test source

```ts
  195 |     await loginPage.gotoLoginPage();
  196 |     await loginPage.login(account.email, account.password);
  197 |     await expect(loginPage.logoutLink).toBeVisible();
  198 | 
  199 |     await use(page);
  200 | 
  201 |     const deleted = await accounts.deleteAccount(
  202 |       account.email,
  203 |       account.password,
  204 |     );
  205 |     expect(deleted.responseCode, `deleteAccount: ${deleted.message}`).toBe(200);
  206 |     const lookup = await accounts.getUserDetailByEmail(account.email);
  207 |     expect(lookup.responseCode).toBe(404);
  208 |   },
  209 | 
  210 |   homePage: async ({ page }, use) => {
  211 |     await use(new HomePage(page));
  212 |   },
  213 | 
  214 |   productsPage: async ({ page }, use) => {
  215 |     await use(new ProductsPage(page));
  216 |   },
  217 | 
  218 |   productDetailPage: async ({ page }, use) => {
  219 |     await use(new ProductDetailPage(page));
  220 |   },
  221 | 
  222 |   loginPage: async ({ page }, use) => {
  223 |     await use(new LoginPage(page));
  224 |   },
  225 | 
  226 |   accountInfoPage: async ({ page }, use) => {
  227 |     await use(new AccountInfoPage(page));
  228 |   },
  229 | 
  230 |   confirmationPage: async ({ page }, use) => {
  231 |     await use(new ConfirmationPage(page));
  232 |   },
  233 | 
  234 |   cartPage: async ({ page }, use) => {
  235 |     await use(new CartPage(page));
  236 |   },
  237 | 
  238 |   checkoutPage: async ({ page }, use) => {
  239 |     await use(new CheckoutPage(page));
  240 |   },
  241 | 
  242 |   paymentPage: async ({ page }, use) => {
  243 |     await use(new PaymentPage(page));
  244 |   },
  245 | 
  246 |   orderConfirmationPage: async ({ page }, use) => {
  247 |     await use(new OrderConfirmationPage(page));
  248 |   },
  249 | 
  250 |   /**
  251 |    * Registers a throwaway account for the test and removes it afterwards.
  252 |    * Each test owns its own account, so parallel workers never contend and no
  253 |    * test inherits state from another.
  254 |    */
  255 |   uniqueAccount: async ({ page }, use) => {
  256 |     const account: ActiveAccount = { ...buildAccount(), deleted: false };
  257 | 
  258 |     const loginPage = new LoginPage(page);
  259 |     const accountInfoPage = new AccountInfoPage(page);
  260 |     const confirmationPage = new ConfirmationPage(page);
  261 |     const homePage = new HomePage(page);
  262 | 
  263 |     await loginPage.gotoLoginPage();
  264 |     await loginPage.startSignup(account.name, account.email);
  265 | 
  266 |     await accountInfoPage.createAccount(account);
  267 | 
  268 |     await confirmationPage.continueButton.waitFor({ state: "visible" });
  269 |     await confirmationPage.continue();
  270 | 
  271 |     await use(account);
  272 | 
  273 |     if (account.deleted) {
  274 |       return;
  275 |     }
  276 | 
  277 |     await homePage.gotoHomePage();
  278 |     const stillSignedIn = await homePage.logoutLink
  279 |       .isVisible()
  280 |       .catch(() => false);
  281 | 
  282 |     if (!stillSignedIn) {
  283 |       await loginPage.gotoLoginPage();
  284 |       await loginPage.login(account.email, account.password);
  285 |       // login() submits the form and returns; the session only exists once
  286 |       // that POST has been processed. Navigating straight to /delete_account
  287 |       // can overtake it and arrive anonymously, which deletes nothing and
  288 |       // fails the assertion below for the wrong reason.
  289 |       await expect(homePage.logoutLink).toBeVisible();
  290 |     }
  291 | 
  292 |     await page.goto(url.deleteAccount);
  293 |     // A silent teardown failure would leak accounts run after run with nothing
  294 |     // surfacing, so cleanup asserts its own outcome.
> 295 |     await expect(confirmationPage.accountDeletedBanner).toBeVisible();
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  296 |   },
  297 | });
  298 | 
  299 | export { expect } from "@playwright/test";
  300 | 
```