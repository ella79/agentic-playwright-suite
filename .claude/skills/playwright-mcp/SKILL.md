---
name: playwright-mcp
description: Drive the live application through the Playwright MCP server for exploration, locator discovery, and failure diagnosis. Use when planning new coverage, confirming an accessible name, or investigating why a test fails.
---

# Playwright MCP Skill

## Outcome

Agents inspect the **real** application instead of guessing. Every locator that lands in a page
object was confirmed against a live accessibility snapshot first.

## Server

Configured in `.mcp.json` as the `playwright` server (`@playwright/mcp`, Chromium, isolated
profile). Isolated means each session starts with a clean browser state — no cookies leak between
an exploration session and the next one, which matters here because the app's logged-in and
anonymous states render different navigation.

## When To Use

| Situation                             | Use MCP for                                                             |
| ------------------------------------- | ----------------------------------------------------------------------- |
| Planning a new feature area           | Walking the flow, listing states, capturing accessible names            |
| A locator does not resolve            | Snapshotting the current DOM to see what the element is actually called |
| A test fails and the error is unclear | Re-driving the exact steps and observing where reality diverges         |
| Deciding a VR threshold               | Comparing repeated screenshots of the same state for natural variance   |

## When Not To Use

- **Do not use MCP to run the test suite.** Tests run through `yarn test:e2e` / `yarn test:vr`.
  MCP is for inspection, not execution.
- **Do not transcribe an MCP session into a test.** A recorded click sequence is not a test; it
  lacks assertions, page objects, and intent. Use what you learned to write a proper spec.

## Method

1. `browser_navigate` to the entry URL.
2. `browser_snapshot` — read the accessibility tree. This is the source of truth for locators:
   the `role` and the accessible `name` are what `getByRole` will match.
3. Interact (`browser_click`, `browser_type`) to reach each state the plan needs.
4. `browser_snapshot` again at every state worth asserting on.
5. Record findings in the test plan, including the exact accessible names.

## Locator Discovery Rules

- If the snapshot shows a real role and name, the locator is `getByRole(role, { name })`.
- If an element has a `data-qa` attribute, `getByTestId` is available — the config maps
  `testIdAttribute` to `data-qa`.
- If an element has neither an accessible name nor a `data-qa` hook, that is a finding worth
  recording in the plan, and the page object will need a documented CSS fallback.
- Two elements sharing one accessible name is a disambiguation problem to solve in the page object
  (scope to a container), not a reason to fall back to `nth()`.

## Known Traps In This Application

- The consent banner renders inside a **shadow DOM**. Playwright locators pierce open shadow roots,
  so `getByRole("button", { name: "Consent" })` resolves it, but `document.querySelector` from an
  evaluate call will not find it. Do not conclude the button is missing.
- Third-party ad iframes inject after load and shift layout. Never anchor a locator or a screenshot
  region to a position that an ad can move.
- `/delete_account` deletes immediately on GET — there is no confirmation dialog. Do not navigate
  there casually during exploration while logged into an account you still need.
