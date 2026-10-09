import { type APIResponse } from "@playwright/test";
import { attachment } from "allure-js-commons";

const MAX_ATTACHED_CHARACTERS = 8_000;

/** The numeric `responseCode` this application answers with, in the body. */
function responseCodeOf(body: unknown): number | undefined {
  const code = (body as { responseCode?: unknown } | null)?.responseCode;
  return typeof code === "number" ? code : undefined;
}

/** What arrived, so the error points at the response rather than at the test. */
function describeShape(body: unknown): string {
  if (body === null) return "null";
  if (typeof body !== "object") return typeof body;
  const keys = Object.keys(body);
  return keys.length ? `an object holding ${keys.join(", ")}` : "{}";
}

/**
 * Reads the body and puts it in the report.
 *
 * Every endpoint under `/api` answers HTTP 200, a rejection included, and
 * carries 201, 400, 404 or 405 in `responseCode`, so the report is named after
 * that code; the transport status appears only when it is not 200, where it is
 * news in itself. Two answers are rejected rather than cast: a page instead of
 * JSON, which is the host shedding load, and JSON without a numeric
 * `responseCode`, which would otherwise surface one assertion later as
 * `expected 400, received undefined`.
 */
export async function readJson<T>(response: APIResponse): Promise<T> {
  const { pathname } = new URL(response.url());
  const status = response.status();
  const text = await response.text();

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    body = undefined;
  }
  const code = responseCodeOf(body);

  // Before either throw, so a mangled answer is still readable in the report.
  // Never allowed to fail a test: a report detail is not worth an error.
  try {
    const name = code === undefined ? `HTTP ${status}` : String(code);
    await attachment(
      status === 200 || code === undefined
        ? `${name} ${pathname}`
        : `${name} ${pathname} · HTTP ${status}`,
      text.slice(0, MAX_ATTACHED_CHARACTERS),
      "application/json",
    );
  } catch {
    // No test context, or the reporter is not running.
  }

  if (body === undefined) {
    throw new Error(
      `Host unavailable: ${pathname} answered HTTP ${status} with a page instead of JSON`,
    );
  }
  if (code === undefined) {
    throw new Error(
      `Unexpected response shape: ${pathname} answered HTTP ${status} with ${describeShape(body)}, with no numeric responseCode`,
    );
  }
  return body as T;
}
