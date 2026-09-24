import { type APIResponse } from "@playwright/test";

/** The demo host sheds load with an HTML page instead of JSON; report that, not a parse error. */
export async function readJson<T>(response: APIResponse): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    const { pathname } = new URL(response.url());
    throw new Error(
      `Host unavailable: ${pathname} answered HTTP ${response.status()} with a page instead of JSON`,
    );
  }
}
