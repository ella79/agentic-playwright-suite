// spec: specs/test-plans/signup-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../../utils/fixtures/testFixtures";
import { AccountApiClient } from "../../utils/apiClients/accountApiClient";
import { buildAccount } from "../../utils/testData";

// Starting a signup navigates to the login page's quick form, which the
// shared logged-in session every other spec depends on would redirect away
// from.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Signup Page", () => {
  test("TC-11: A new visitor completes signup end to end and lands signed in", async ({
    request,
    loginPage,
    accountInfoPage,
    confirmationPage,
    homePage,
  }) => {
    const account = buildAccount();

    await test.step("start signup from the login page", async () => {
      await loginPage.gotoLoginPage();
      await loginPage.startSignup(account.name, account.email);
      await expect(accountInfoPage.enterAccountInfoHeading).toBeVisible();
    });

    await test.step("complete the account and address information forms", async () => {
      await expect(accountInfoPage.addressInformationHeading).toBeVisible();
      await accountInfoPage.createAccount(account);
      await expect(confirmationPage.accountCreatedBanner).toBeVisible();
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
    });

    await test.step("continuing lands back on the home page, signed in", async () => {
      await confirmationPage.continue();
      await expect(homePage.loggedInAs).toContainText(account.name);
    });

    await test.step("the account the UI created is confirmed against the API", async () => {
      const body = await new AccountApiClient(request).getUserDetailByEmail(
        account.email,
      );
      expect(body.responseCode).toBe(200);
    });

    // Registered outside any fixture, so this test owns its own cleanup.
    await homePage.deleteAccount();
    await expect(confirmationPage.accountDeletedBanner).toBeVisible();
  });

  test("TC-12: Signing up with an already registered email is rejected", async ({
    homePage,
    loginPage,
    accountInfoPage,
    uniqueAccount,
  }) => {
    // The fixture's own provisioning leaves the session signed in as
    // uniqueAccount; back to guest before starting a second signup with it.
    await homePage.gotoHomePage();
    await homePage.logout();

    await loginPage.startSignup(uniqueAccount.name, uniqueAccount.email);

    await expect(loginPage.signupErrorMessage).toBeVisible();
    await expect(accountInfoPage.enterAccountInfoHeading).toBeHidden();
  });
});
