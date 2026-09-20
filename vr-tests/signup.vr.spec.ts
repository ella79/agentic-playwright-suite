// spec: specs/vr-test-plans/signup-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";
import { AccountApiClient } from "../utils/apiClients/accountApiClient";
import { buildAccount } from "../utils/testData";

// Starting a signup navigates to the login page's quick form, which the
// shared logged-in session every other spec depends on would redirect away
// from.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Visual regression - Signup Page", () => {
  test("VR-13: Signup quick form, default", async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();
    await expect(loginPage.signupHeading).toBeVisible();
    await expect(loginPage.signupForm).toBeVisible();

    // A clip, not an element screenshot: the heading is the form's own
    // sibling inside `.signup-form`, not its parent, so no single locator's
    // own box covers both.
    const clip = await loginPage.unionBoundingBox([
      loginPage.signupHeading,
      loginPage.signupForm,
    ]);
    await expect(page).toHaveScreenshot("signup-quick-form.png", { clip });
  });

  test("VR-14: Account Information form", async ({
    page,
    loginPage,
    accountInfoPage,
  }) => {
    // A fixed, literal email rather than `buildAccount()`: this step never
    // submits, so nothing is created, and a per-run generated address would
    // leave the pre-filled Email field's text different on every capture.
    const account = buildAccount({ email: "signup.form.preview@example.com" });
    await loginPage.gotoLoginPage();
    await loginPage.startSignup(account.name, account.email);
    await accountInfoPage.scrollToTop(accountInfoPage.enterAccountInfoHeading);
    await expect(accountInfoPage.enterAccountInfoHeading).toBeVisible();

    // A viewport capture clipped to just above "Address Information", not the
    // whole form or the full viewport: the full form is 1,375px tall, taller
    // than the viewport, and at this scroll position the Address Information
    // heading already sits at y=511, well inside the 1080px viewport, so an
    // unclipped capture would bleed into the next section. VR-15 anchors
    // further down for the address fields themselves. Verified live.
    const addressHeadingBox =
      await accountInfoPage.addressInformationHeading.boundingBox();
    if (!addressHeadingBox) {
      throw new Error("Address Information heading is not rendered.");
    }
    await expect(page).toHaveScreenshot("signup-account-info.png", {
      clip: {
        x: 0,
        y: 0,
        width: page.viewportSize()?.width ?? 0,
        height: addressHeadingBox.y,
      },
    });
  });

  test("VR-15: Address Information form", async ({
    page,
    loginPage,
    accountInfoPage,
  }) => {
    const account = buildAccount({ email: "signup.form.preview@example.com" });
    await loginPage.gotoLoginPage();
    await loginPage.startSignup(account.name, account.email);
    await accountInfoPage.scrollToTop(
      accountInfoPage.addressInformationHeading,
    );
    await expect(accountInfoPage.addressInformationHeading).toBeVisible();

    await expect(page).toHaveScreenshot("signup-address-info.png");
  });

  test("VR-16: Signup quick form, error", async ({
    page,
    request,
    loginPage,
  }) => {
    // Registered directly through the API with a fixed, literal email rather
    // than `uniqueAccount`: this case only proves what the rejected form
    // renders, and a per-run generated address would leave the field's own
    // text different on every capture.
    const account = buildAccount({
      email: "signup.form.duplicate@example.com",
    });
    const client = new AccountApiClient(request);
    await client.createAccount(account);

    await loginPage.gotoLoginPage();
    await loginPage.startSignup(account.name, account.email);
    await expect(loginPage.signupErrorMessage).toBeVisible();

    const clip = await loginPage.unionBoundingBox([
      loginPage.signupHeading,
      loginPage.signupForm,
    ]);
    await expect(page).toHaveScreenshot("signup-quick-form-error.png", {
      clip,
    });

    await client.deleteAccount(account.email, account.password);
  });

  test("VR-17: Account Created confirmation", async ({
    homePage,
    loginPage,
    accountInfoPage,
    confirmationPage,
  }) => {
    const account = buildAccount();
    await loginPage.gotoLoginPage();
    await loginPage.startSignup(account.name, account.email);
    await accountInfoPage.createAccount(account);
    await expect(confirmationPage.accountCreatedBanner).toBeVisible();

    await expect(confirmationPage.confirmationSection).toHaveScreenshot(
      "signup-confirmation.png",
    );

    // Registered outside any fixture, so this case owns its own cleanup.
    await confirmationPage.continue();
    await homePage.deleteAccount();
    await expect(confirmationPage.accountDeletedBanner).toBeVisible();
  });
});
