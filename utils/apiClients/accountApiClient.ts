import { type APIRequestContext } from "@playwright/test";
import { sendJson } from "./sendJson";
import { type TestAccount } from "../testData";

export interface ApiResponseBody {
  responseCode: number;
  message: string;
}

export type UserDetailBody =
  | { responseCode: 200; user: { email: string; name: string } }
  | { responseCode: 404; message: string };

/**
 * Wraps the account endpoints under `/api`. Every one of them answers HTTP
 * 200 with its real outcome inside `responseCode` — 201, 400 or 404 — even
 * for a rejected request; only an unsupported HTTP method itself produces a
 * non-200 status. Verified live on 2026-09-20.
 */
export class AccountApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private accountForm(account: TestAccount) {
    return {
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
    };
  }

  async createAccount(account: TestAccount): Promise<ApiResponseBody> {
    return sendJson(() =>
      this.request.post("/api/createAccount", {
        form: this.accountForm(account),
      }),
    );
  }

  async updateAccount(account: TestAccount): Promise<ApiResponseBody> {
    return sendJson(() =>
      this.request.put("/api/updateAccount", {
        form: this.accountForm(account),
      }),
    );
  }

  async deleteAccount(
    email: string,
    password: string,
  ): Promise<ApiResponseBody> {
    return sendJson(() =>
      this.request.delete("/api/deleteAccount", {
        form: { email, password },
      }),
    );
  }

  async verifyLogin(email: string, password: string): Promise<ApiResponseBody> {
    return sendJson(() =>
      this.request.post("/api/verifyLogin", {
        form: { email, password },
      }),
    );
  }

  async getUserDetailByEmail(email: string): Promise<UserDetailBody> {
    return sendJson(() =>
      this.request.get(
        `/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`,
      ),
    );
  }
}
