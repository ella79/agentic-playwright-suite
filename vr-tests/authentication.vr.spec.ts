// spec: specs/vr-test-plans/authentication-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { buildAccount } from "../utils/testData";

test.describe("Visual regression - authentication", () => {
  test("VR-14: login form", async ({ loginPage }) => {
    await loginPage.gotoLoginPage();
    await expect(loginPage.loginButton).toBeVisible();

    await expect(loginPage.loginForm).toHaveScreenshot(
      "authentication-login-form.png",
    );
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
      "authentication-account-info-form.png",
    );
  });
});
