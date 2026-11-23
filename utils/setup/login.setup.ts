// The shared `test`, not Playwright's bare one: without its `allureLabels`
// auto-fixture, this project's one test carried no `parentSuite` label, so
// Allure gave it its own top-level suite named "setup" — invisible until the
// first real run of the consumer contract's `exact: true` check rejected it
// outright as an unannounced suite. Verified live, in that run's own logs.
import { AccountApiClient } from "../apiClients/accountApiClient";
import { test as setup } from "../fixtures/testFixtures";
import { LoginPage } from "../pageObjects";
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

  // API first, and idempotent on purpose: the account already existing from a
  // previous run is the steady state, not a failure.
  //
  // No retry of its own. The client re-sends what the host sheds, and that
  // re-send is uncapped, so a second retry wrapped around it could never take
  // a turn: the inner one held the budget until this test's own ran out, and
  // every project waits on this one call. What reaches the check below is the
  // application's own answer, which is not worth asking twice.
  const body = await new AccountApiClient(request).createAccount(account);
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
  await new LoginPage(page).signIn(account.email, account.password);

  await page.context().storageState({ path: authFile });
});
