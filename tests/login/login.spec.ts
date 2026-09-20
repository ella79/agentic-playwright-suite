// spec: specs/test-plans/login-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { AccountApiClient } from "../../utils/apiClients/accountApiClient";
import { buildAccount } from "../../utils/testData";
import { url } from "../../utils/url";

// Every case here proves something about the guest/signed-in boundary itself,
// which the shared logged-in session every other functional spec depends on
// would redirect away from.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login Page", () => {
  test("TC-07: Signing in with wrong credentials is rejected", async ({
    page,
    loginPage,
    homePage,
  }) => {
    const unregistered = buildAccount();

    await loginPage.gotoLoginPage();
    await loginPage.login(unregistered.email, "DefinitelyWrong123!");

    await expect(loginPage.loginErrorMessage).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${url.login}$`));
    await expect(homePage.loggedInAs).toBeHidden();
  });

  test("TC-08: A registered user can sign in with valid credentials", async ({
    homePage,
    loginPage,
    uniqueAccount,
  }) => {
    // The fixture's own provisioning leaves the session signed in; back to
    // guest first so this case proves the login form itself.
    await homePage.gotoHomePage();
    await homePage.logout();

    await loginPage.login(uniqueAccount.email, uniqueAccount.password);

    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);
    await expect(homePage.logoutLink).toBeVisible();
  });

  test("TC-09: Logging out returns the visitor to the guest state", async ({
    page,
    homePage,
    uniqueAccount,
  }) => {
    await homePage.gotoHomePage();
    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);

    await homePage.logout();

    await expect(page).toHaveURL(new RegExp(`${url.login}$`));
    await expect(homePage.logoutLink).toBeHidden();
  });

  test("TC-10: A signed-in user can delete their account, with the deletion confirmed", async ({
    request,
    homePage,
    confirmationPage,
    uniqueAccount,
  }) => {
    await homePage.gotoHomePage();
    await homePage.deleteAccount();

    await expect(confirmationPage.accountDeletedBanner).toBeVisible();
    await expect(confirmationPage.accountDeletedMessage).toBeVisible();

    // Tells the fixture teardown the account is already gone.
    uniqueAccount.deleted = true;

    await test.step("the deletion is confirmed against the API", async () => {
      const body = await new AccountApiClient(request).getUserDetailByEmail(
        uniqueAccount.email,
      );
      expect(body.responseCode).toBe(404);
    });

    await confirmationPage.continue();
    await expect(homePage.signupLoginLink).toBeVisible();
  });
});
