// spec: specs/vr-test-plans/authentication-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { buildAccount } from "../utils/testData";

test.describe("Visual regression - authentication", () => {
  test("VR-14: login form", async ({ loginPage }) => {
    await loginPage.gotoLoginPage();
    await expect(loginPage.loginButton).toBeVisible();

    await expect(loginPage.loginForm).toHaveScreenshot("auth-login-form.png");
  });

  test("VR-15: signup entry form", async ({ loginPage }) => {
    await loginPage.gotoLoginPage();
    await expect(loginPage.signupButton).toBeVisible();

    await expect(loginPage.signupForm).toHaveScreenshot("auth-signup-form.png");
  });

  test("VR-16: full registration form", async ({
    loginPage,
    accountInfoPage,
  }) => {
    const candidate = buildAccount();

    await loginPage.gotoLoginPage();
    await loginPage.startSignup(candidate.name, candidate.email);
    await expect(accountInfoPage.createAccountButton).toBeVisible();

    // Captured before submission, so no account is created.
    await expect(accountInfoPage.accountForm).toHaveScreenshot(
      "auth-account-info-form.png",
    );
  });

  test("VR-17: site header for a signed-in user", async ({
    homePage,
    uniqueAccount,
  }) => {
    await homePage.gotoHomePage();
    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);

    await expect(homePage.header).toHaveScreenshot(
      "auth-header-signed-in.png",
      {
        mask: [homePage.loggedInAs], // the account name differs per run
      },
    );
  });
});
