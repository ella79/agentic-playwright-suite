# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: utils/setup/login.setup.ts >> authenticate
- Location: utils/setup/login.setup.ts:35:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('banner').getByRole('link', { name: 'Logout' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('banner').getByRole('link', { name: 'Logout' }) with timeout 5000ms
  - waiting for getByRole('banner').getByRole('link', { name: 'Logout' })

```

```yaml
- banner:
  - heading "Web server is returning an unknown error Error code 520" [level=1]
  - text: Visit
  - link "cloudflare.com":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
  - text: for more information. 2026-10-16 13:56:05 UTC
- text: You
- heading "Browser" [level=3]
- text: Working
- link:
  - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
- text: Detroit
- heading "Cloudflare" [level=3]:
  - link "Cloudflare":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
- text: Working automationexercise.com
- heading "Host" [level=3]
- text: Error
- heading "What happened?" [level=2]
- paragraph: There is an unknown connection issue between Cloudflare and the origin web server. As a result, the web page can not be displayed.
- heading "What can I do?" [level=2]
- heading "If you are a visitor of this website:" [level=3]
- paragraph: Please try again in a few minutes.
- heading "If you are the owner of this website:" [level=3]
- paragraph:
  - text: There is an issue between Cloudflare's cache and your origin web server. Cloudflare monitors for these errors and automatically investigates the cause. To help support the investigation, you can pull the corresponding error log from your web server and submit it our support team. Please include the Ray ID (which is at the bottom of this error page).
  - link "Additional troubleshooting resources":
    - /url: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-520/
  - text: .
- paragraph:
  - text: "Cloudflare Ray ID:"
  - strong: a4b7909ccbe2a952
  - text: "• Your IP:"
  - button "Click to reveal"
  - text: • Performance & security by
  - link "Cloudflare":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
```

# Test source

```ts
  1  | // The shared `test`, not Playwright's bare one: without its `allureLabels`
  2  | // auto-fixture, this project's one test carried no `parentSuite` label, so
  3  | // Allure gave it its own top-level suite named "setup" — invisible until the
  4  | // first real run of the consumer contract's `exact: true` check rejected it
  5  | // outright as an unannounced suite. Verified live, in that run's own logs.
  6  | import { AccountApiClient } from "../apiClients/accountApiClient";
  7  | import { test as setup, expect } from "../fixtures/testFixtures";
  8  | import { HomePage, LoginPage } from "../pageObjects";
  9  | import { buildAccount } from "../testData";
  10 | 
  11 | const authFile = "./.auth/user.json";
  12 | 
  13 | /**
  14 |  * The account this project depends on for every test that only needs "a
  15 |  * logged-in user" as a precondition, not proof that signup or login itself
  16 |  * works. Its email and password never appear in source: they come from the
  17 |  * environment, a GitHub Actions secret in CI and a gitignored `.env` file
  18 |  * locally (see `.env.example`).
  19 |  */
  20 | function credentialsFromEnv() {
  21 |   const email = process.env.E2E_LOGIN_EMAIL;
  22 |   const password = process.env.E2E_LOGIN_PASSWORD;
  23 | 
  24 |   if (!email || !password) {
  25 |     throw new Error(
  26 |       "E2E_LOGIN_EMAIL and E2E_LOGIN_PASSWORD are required to authenticate the " +
  27 |         "shared test account. Set them as GitHub Actions secrets in CI, or in " +
  28 |         "a local .env file (see .env.example).",
  29 |     );
  30 |   }
  31 | 
  32 |   return { email, password };
  33 | }
  34 | 
  35 | setup("authenticate", async ({ page, request }) => {
  36 |   const { email, password } = credentialsFromEnv();
  37 |   const account = buildAccount({ email, password });
  38 | 
  39 |   // API first, and idempotent on purpose: the account already existing from a
  40 |   // previous run is the steady state, not a failure. Retried with growing
  41 |   // pauses, because every project waits on this one call and the demo host
  42 |   // sheds load for seconds at a time.
  43 |   await expect(async () => {
  44 |     const body = await new AccountApiClient(request).createAccount(account);
  45 |     const alreadyExists =
  46 |       body.responseCode === 400 && body.message.includes("already exists");
  47 | 
  48 |     if (body.responseCode !== 201 && !alreadyExists) {
  49 |       throw new Error(
  50 |         `POST /api/createAccount answered ${body.responseCode}: ${body.message}`,
  51 |       );
  52 |     }
  53 |   }).toPass({ intervals: [2_000, 5_000], timeout: 20_000 });
  54 | 
  55 |   // UI second, and not optional: verifyLogin answers JSON with no Set-Cookie
  56 |   // header, so it proves credentials are valid without ever starting a
  57 |   // session a browser could use. The real session, and the storageState this
  58 |   // project produces, can only come from the login form itself.
  59 |   const loginPage = new LoginPage(page);
  60 |   const homePage = new HomePage(page);
  61 | 
  62 |   await loginPage.gotoLoginPage();
  63 |   await loginPage.login(account.email, account.password);
> 64 |   await expect(homePage.logoutLink).toBeVisible();
     |                                     ^ Error: expect(locator).toBeVisible() failed
  65 | 
  66 |   await page.context().storageState({ path: authFile });
  67 | });
  68 | 
```