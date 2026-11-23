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
  let refused: APIResponse | undefined;

  await expect(async () => {
    const response = await send();

    // A refusal is not load shedding, and the two are worth telling apart.
    // Shedding passes if the call is made again; a refusal answers the same
    // way however many times it is asked, so re-sending one only spends the
    // test's whole budget to arrive at the answer the first call already
    // gave. It leaves the block instead, and is thrown below.
    if (isRefusal(response.status())) {
      refused = response;
      return;
    }

    result = { response, body: await readJson<T>(response) };
  }).toPass();

  if (refused) {
    const { pathname } = new URL(refused.url());
    throw new Error(
      `Host refused: ${pathname} answered HTTP ${refused.status()}, which re-sending does not change`,
    );
  }

  return result as { response: APIResponse; body: T };
}

/**
 * Whether the host is turning the call down rather than buckling under it.
 *
 * Everything this application answers normally, a rejection included, arrives
 * as HTTP 200 with the outcome in `responseCode`, so a 4xx here is never the
 * application speaking: it is the host in front of it, and 403 is the one it
 * uses on traffic it has decided not to serve. 429 is the exception, since
 * being asked to slow down is precisely an invitation to ask again, and 5xx
 * is the shedding this whole helper exists for.
 */
function isRefusal(status: number): boolean {
  return status >= 400 && status < 500 && status !== 429;
}
