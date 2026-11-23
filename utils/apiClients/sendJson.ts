import { expect, type APIResponse } from "@playwright/test";
import { readJson } from "./readJson";

/**
 * Sends the request and reads its body, re-sending while the host answers with
 * a page instead of JSON.
 *
 * The same shape `BaseAppPage.goto` uses against the same symptom, for the
 * same reason: the holding page this host sheds load with never becomes the
 * answer, so the call is re-sent rather than waited on. No timeout and no
 * interval are named here either — the retry is bounded by the test's own
 * timeout, and a deadline of its own would only be a second place to tune.
 *
 * `maxRetries` on the request cannot stand in for this. Playwright retries
 * only network errors there, `ECONNRESET` alone, and states it "does not retry
 * based on HTTP response codes", so a 503 carrying an error page arrives as a
 * perfectly successful response and is never re-sent.
 *
 * Only the send and the read sit inside the block, never a caller's
 * assertion: an endpoint that rejects answers HTTP 200 and carries the
 * rejection in `responseCode`, which `readJson` returns without complaint, so
 * nothing here can turn a real rejection into a retry.
 *
 * Mirrors `BaseAppPage.navigate` in the other direction as well: a caller that
 * already retries a block this would be a step of keeps calling `readJson`
 * directly, so no second retry nests inside the first.
 */
export async function sendJson<T>(
  send: () => Promise<APIResponse>,
): Promise<T> {
  let body: T | undefined;

  await expect(async () => {
    body = await readJson<T>(await send());
  }).toPass();

  return body as T;
}
