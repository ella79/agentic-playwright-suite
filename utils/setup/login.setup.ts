import { test as setup, expect } from "@playwright/test";
import { HomePage, LoginPage } from "../pageObjects";
import { buildAccount } from "../testData";

const authFile = "./.auth/user.json";

/**
 * The account this project depends on for every test that only needs "a
 * logged-in user" as a precondition, not proof that signup or login itself
 * works. Its email and password never appear in source: they come from the
 * environment, a GitHub Actions secret in CI and a gitignored `.env` file
 * locally (see `.env.example`).
 */
function credentialsFromEnv() {
  const email = process.env.E2E_LOGIN_EMAIL;
  const password = process.env.E2E_LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E_LOGIN_EMAIL and E2E_LOGIN_PASSWORD are required to authenticate the " +
        "shared test account. Set them as GitHub Actions secrets in CI, or in " +
        "a local .env file (see .env.example).",
    );
  }

  return { email, password };
}

setup("authenticate", async ({ page, request }) => {
  const { email, password } = credentialsFromEnv();
  const account = buildAccount({ email, password });

  // API first: registering through /api/createAccount is one request against
  // a form eleven fields long, and it is idempotent here on purpose. The
  // account already existing from a previous run is not a failure, it is the
  // steady state this setup runs into on every run after the first.
  const response = await request.post("/api/createAccount", {
    form: {
      name: account.name,
      email: account.email,
      password: account.password,
      title: "Mr",
      birth_date: account.birthDay,
      birth_month: account.birthMonth,
      birth_year: account.birthYear,
      firstname: account.firstName,
      lastname: account.lastName,
      company: account.company,
      address1: account.address,
      address2: "",
      country: account.country,
      zipcode: account.zipcode,
      state: account.state,
      city: account.city,
      mobile_number: account.mobileNumber,
    },
  });

  const body: { responseCode: number; message: string } = await response.json();
  const alreadyExists =
    body.responseCode === 400 && body.message.includes("already exists");

  if (body.responseCode !== 201 && !alreadyExists) {
    throw new Error(
      `POST /api/createAccount answered ${body.responseCode}: ${body.message}`,
    );
  }

  // UI second, and not optional: verifyLogin answers JSON with no Set-Cookie
  // header, so it proves credentials are valid without ever starting a
  // session a browser could use. The real session, and the storageState this
  // project produces, can only come from the login form itself.
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login(account.email, account.password);
  await expect(homePage.logoutLink).toBeVisible();

  await page.context().storageState({ path: authFile });
});
