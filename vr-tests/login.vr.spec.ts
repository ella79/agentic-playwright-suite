// spec: specs/vr-test-plans/login-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";

// Every case here proves what the login form itself looks like, which the
// shared logged-in session every other spec depends on would redirect away
// from.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Visual regression - Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.gotoLoginPage();
  });

  test("VR-11: Login form, default", async ({ page, loginPage }) => {
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.loginForm).toBeVisible();

    // A clip, not an element screenshot: the heading is the form's own
    // sibling inside `.login-form`, not its parent, so no single locator's
    // own box covers both.
    const clip = await loginPage.unionBoundingBox([
      loginPage.loginHeading,
      loginPage.loginForm,
    ]);
    await expect(page).toHaveScreenshot("login-default.png", { clip });
  });

  test("VR-12: Login form, error", async ({ page, loginPage }) => {
    // A fixed, literal email rather than `buildAccount()`: this case only
    // proves what the error state renders, and a per-run generated address
    // would leave the field's own text different on every capture.
    await loginPage.login("nobody@example.com", "DefinitelyWrong123!");
    await expect(loginPage.loginErrorMessage).toBeVisible();

    const clip = await loginPage.unionBoundingBox([
      loginPage.loginHeading,
      loginPage.loginForm,
    ]);
    await expect(page).toHaveScreenshot("login-error.png", { clip });
  });
});
