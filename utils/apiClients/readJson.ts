import { type APIResponse } from "@playwright/test";
import { attachment } from "allure-js-commons";

/** Bodies here are small JSON documents; this only guards against a surprise. */
const MAX_ATTACHED_CHARACTERS = 8_000;

/**
 * What the response is called in the report.
 *
 * The transport status on its own is misleading here: a rejected request still
 * answers HTTP 200 and carries its real outcome in the body's `responseCode`,
 * so a row reading `200` beside a case named "is rejected" looks like the case
 * asserted the wrong thing. Both are named when they differ, and the transport
 * status alone when the body did not parse, which is itself the signal that the
 * host answered with something other than JSON.
 */
function attachmentName(response: APIResponse, body: unknown): string {
  const { pathname } = new URL(response.url());
  const code =
    body && typeof body === "object" && "responseCode" in body
      ? (body as { responseCode?: unknown }).responseCode
      : undefined;
  return typeof code === "number" && code !== response.status()
    ? `${response.status()} · responseCode ${code} ${pathname}`
    : `${response.status()} ${pathname}`;
}

/**
 * Puts the response in the Allure report.
 *
 * The API suite is the only one that produced no artefacts at all: a failure on
 * `responseCode` left a reader with the assertion message and nothing to read
 * it against, while the functional and visual suites both hand over a trace or
 * an image diff. Attached on every call rather than only on failure, because
 * the body is a few hundred bytes and the interesting case is usually the one
 * that passed next to the one that did not.
 *
 * Never allowed to fail a test: outside a running test there is nothing to
 * attach to, and a report detail is not worth an error.
 */
async function attachResponse(
  response: APIResponse,
  text: string,
  body: unknown,
): Promise<void> {
  try {
    await attachment(
      attachmentName(response, body),
      text.slice(0, MAX_ATTACHED_CHARACTERS),
      "application/json",
    );
  } catch {
    // No test context, or the reporter is not running.
  }
}

/** The demo host sheds load with an HTML page instead of JSON; report that, not a parse error. */
export async function readJson<T>(response: APIResponse): Promise<T> {
  const text = await response.text();

  let body: unknown;
  let parsed = true;
  try {
    body = JSON.parse(text);
  } catch {
    parsed = false;
  }

  // Attached before the throw below, so a response the host mangled is still
  // readable in the report rather than only described in the error message.
  await attachResponse(response, text, body);

  if (!parsed) {
    const { pathname } = new URL(response.url());
    throw new Error(
      `Host unavailable: ${pathname} answered HTTP ${response.status()} with a page instead of JSON`,
    );
  }
  return body as T;
}
