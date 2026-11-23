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
  return (await sendJsonResponse<T>(send)).body;
}

/**
 * The same re-send, handing back the response as well.
 *
 * A client wrapping an endpoint wants the body alone, which is why `sendJson`
 * keeps the response to itself. A case whose own subject is the transport —
 * the ones proving an unsupported method is answered with HTTP 200 and the
 * refusal in `responseCode` — has to assert on both, and reaching for the raw
 * `readJson` to get there is what left those cases with no re-send at all.
 */
export async function sendJsonResponse<T>(
  send: () => Promise<APIResponse>,
): Promise<{ response: APIResponse; body: T }> {
  let result: { response: APIResponse; body: T } | undefined;

  await expect(async () => {
    const response = await send();
    result = { response, body: await readJson<T>(response) };
  }).toPass();

  return result as { response: APIResponse; body: T };
}
