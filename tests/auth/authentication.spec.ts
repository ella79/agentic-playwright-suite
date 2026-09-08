// spec: specs/test-plans/authentication-test-plan.md
import { expect, test } from "../../utils/fixtures/testFixtures";
import { buildAccount } from "../../utils/testData";
import { url } from "../../utils/url";

test.describe("Authentication", () => {
  test("TC-01: a new visitor can register and lands in the signed-in state", async ({
    loginPage,
    accountInfoPage,
    confirmationPage,
    homePage,
  }) => {
    const account = buildAccount();

    await test.step("start signup from the login page", async () => {
      await loginPage.gotoLoginPage();
      await expect(loginPage.signupHeading).toBeVisible();
      await loginPage.startSignup(account.name, account.email);
      await expect(accountInfoPage.enterAccountInfoHeading).toBeVisible();
    });

    await test.step("complete account and address details", async () => {
      await accountInfoPage.createAccount(account);
      await expect(confirmationPage.accountCreatedBanner).toBeVisible();
    });

    await test.step("continue into the signed-in application", async () => {
      await confirmationPage.continue();
      await expect(homePage.loggedInAs).toContainText(account.name);
      await expect(homePage.logoutLink).toBeVisible();
    });

    // Registered outside the fixture, so this test owns the cleanup.
    await homePage.deleteAccount();
    await expect(confirmationPage.accountDeletedBanner).toBeVisible();
  });

  test("TC-02: a registered user can sign in with valid credentials", async ({
    uniqueAccount,
    homePage,
    loginPage,
  }) => {
    await homePage.gotoHomePage();
    await homePage.logout();

    await loginPage.login(uniqueAccount.email, uniqueAccount.password);

    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);
    await expect(homePage.logoutLink).toBeVisible();
  });

  test("TC-03: signing in with wrong credentials is rejected", async ({
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

  test("TC-04: signing up with an already registered email is rejected", async ({
    uniqueAccount,
    homePage,
    loginPage,
    accountInfoPage,
  }) => {
    await homePage.gotoHomePage();
    await homePage.logout();

    await loginPage.startSignup(uniqueAccount.name, uniqueAccount.email);

    await expect(loginPage.signupErrorMessage).toBeVisible();
    await expect(accountInfoPage.enterAccountInfoHeading).toBeHidden();
  });

  test("TC-05: a signed-in user can delete their account", async ({
    uniqueAccount,
    homePage,
    confirmationPage,
  }) => {
    await homePage.gotoHomePage();
    await homePage.deleteAccount();

    await expect(confirmationPage.accountDeletedBanner).toBeVisible();

    // Tells the fixture teardown the account is already gone.
    uniqueAccount.deleted = true;

    await confirmationPage.continue();
    await expect(homePage.signupLoginLink).toBeVisible();
  });

  test("TC-06: logging out returns the visitor to the anonymous state", async ({
    page,
    uniqueAccount,
    homePage,
    loginPage,
  }) => {
    await homePage.gotoHomePage();
    await expect(homePage.loggedInAs).toContainText(uniqueAccount.name);

    await homePage.logout();

    await expect(page).toHaveURL(new RegExp(`${url.login}$`));
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(homePage.logoutLink).toBeHidden();
  });
});
