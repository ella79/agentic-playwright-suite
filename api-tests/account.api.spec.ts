// spec: specs/api-test-plans/account-api-test-plan.md
import { expect, test } from "../utils/fixtures/testFixtures";
import {
  AccountApiClient,
  type UserDetailBody,
} from "../utils/apiClients/accountApiClient";
import { buildAccount } from "../utils/testData";

test.describe("Account API", () => {
  test("API-01: Creating an account with valid data succeeds", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const account = buildAccount();

    const body = await client.createAccount(account);

    expect(body.responseCode).toBe(201);
    expect(body.message).toBe("User created!");

    await client.deleteAccount(account.email, account.password);
  });

  test("API-02: Creating an account with a required field missing is rejected", async ({
    request,
  }) => {
    const response = await request.post("/api/createAccount", {
      form: { email: "missing-name@example.com" },
    });
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain("name parameter is missing");
  });

  test("API-03: Creating an account with an already-registered email is rejected", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const account = buildAccount();
    await client.createAccount(account);

    const body = await client.createAccount(account);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe("Email already exists!");

    await client.deleteAccount(account.email, account.password);
  });

  test("API-04: An unsupported method on the account endpoint is rejected", async ({
    request,
  }) => {
    const response = await request.get("/api/createAccount");

    expect(response.status()).toBe(405);
  });

  test("API-05: Verifying login with correct credentials succeeds", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const account = buildAccount();
    await client.createAccount(account);

    const body = await client.verifyLogin(account.email, account.password);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User exists!");

    await client.deleteAccount(account.email, account.password);
  });

  test("API-06: Verifying login with an unregistered email is rejected", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const unregistered = buildAccount();

    const body = await client.verifyLogin(
      unregistered.email,
      unregistered.password,
    );

    expect(body.responseCode).toBe(404);
    expect(body.message).toBe("User not found!");
  });

  test("API-07: Looking up a user by email returns their profile", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const account = buildAccount();
    await client.createAccount(account);

    const body = await client.getUserDetailByEmail(account.email);

    expect(body.responseCode).toBe(200);
    // Asserted above; narrows the union so the fields below type-check.
    const found = body as Extract<UserDetailBody, { responseCode: 200 }>;
    expect(found.user.email).toBe(account.email);
    expect(found.user.name).toBe(account.name);

    await client.deleteAccount(account.email, account.password);
  });

  test("API-08: Deleting an account removes it, confirmed by a repeat lookup", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const account = buildAccount();
    await client.createAccount(account);

    const deleteBody = await client.deleteAccount(
      account.email,
      account.password,
    );
    expect(deleteBody.responseCode).toBe(200);
    expect(deleteBody.message).toBe("Account deleted!");

    const lookupBody = await client.getUserDetailByEmail(account.email);
    expect(lookupBody.responseCode).toBe(404);
  });

  test("API-16: Verifying login without an email is rejected", async ({
    request,
  }) => {
    const response = await request.post("/api/verifyLogin", {
      form: { password: "whatever" },
    });
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain("email or password parameter is missing");
  });

  test("API-17: An unsupported method on the verify login endpoint is rejected", async ({
    request,
  }) => {
    // Unlike createAccount, this one answers HTTP 200 with the real outcome
    // inside the body rather than a transport-level 405. Verified live.
    const response = await request.delete("/api/verifyLogin");
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(405);
  });

  test("API-18: Updating an account's details succeeds", async ({
    request,
  }) => {
    const client = new AccountApiClient(request);
    const account = buildAccount();
    await client.createAccount(account);

    const updated = { ...account, company: "Updated Inc." };
    const body = await client.updateAccount(updated);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User updated!");

    const lookupBody = await client.getUserDetailByEmail(account.email);
    expect(lookupBody.responseCode).toBe(200);
    // Asserted above; narrows the union so `user` type-checks below.
    const found = lookupBody as Extract<UserDetailBody, { responseCode: 200 }>;
    expect(found.user.email).toBe(account.email);

    await client.deleteAccount(account.email, account.password);
  });

  test("API-19: Updating an account with a required field missing is rejected", async ({
    request,
  }) => {
    const response = await request.put("/api/updateAccount", {
      form: { name: "Jon Doe" },
    });
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain("email parameter is missing");
  });
});
