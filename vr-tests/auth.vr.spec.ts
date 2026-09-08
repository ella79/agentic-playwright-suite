// spec: specs/vr-test-plans/authentication-vr-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import { AccountInfoPage, HomePage, LoginPage } from "../utils/pageObjects";
import { buildAccount } from "../utils/testData";

test.describe("Visual regression - authentication", () => {
  test("VR-14: login form", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();
    await expect(loginPage.loginButton).toBeVisible();

    await expect(loginPage.loginForm).toHaveScreenshot("auth-login-form.png");
  });

  test("VR-15: signup entry form", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();
    await expect(loginPage.signupButton).toBeVisible();

    await expect(loginPage.signupForm).toHaveScreenshot("auth-signup-form.png");
  });

  test("VR-16: full registration form", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountInfoPage = new AccountInfoPage(page);

    const candidate = buildAccount();

    await loginPage.gotoLoginPage();
    await loginPage.startSignup(candidate.name, candidate.email);
    await expect(accountInfoPage.createAccountButton).toBeVisible();

    // Captured before submission, so no account is created and none needs cleanup.
    await expect(accountInfoPage.accountForm).toHaveScreenshot(
      "auth-account-info-form.png",
    );
  });

  test("VR-18: site header for a signed-in user", async ({
    page,
    uniqueAccount,
  }) => {
    const homePage = new HomePage(page);

    await homePage.gotoHomePage();
    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);

    await expect(homePage.header).toHaveScreenshot(
      "auth-header-signed-in.png",
      // VR: the header carries the account name, which differs per run.
      { mask: [homePage.loggedInAs] },
    );
  });
});
