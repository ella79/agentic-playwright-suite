# Playwright MCP Best-Practice Map

Source material for the MCP standard. Each rule names where it comes from and what it means in this
repository. Where this repository departs from a recommendation, that is stated rather than hidden.

## Official Documentation Anchors

- Server, flags and tool set:
  - https://github.com/microsoft/playwright-mcp
- Accessibility snapshots:
  - https://playwright.dev/mcp/snapshots
- The agents that drive it:
  - https://playwright.dev/docs/test-agents

## What The Server Is For

Playwright MCP drives a real browser through **structured accessibility snapshots rather than
screenshots**, which is the whole point of it: the agent receives a few kilobytes of YAML naming
every interactive element by role, accessible name and state, each carrying a reference id it can act
on. That is deterministic, cheap in context, and does not shift when the page's appearance does.

Vision mode, where the agent works from a screenshot and clicks coordinates, is the fallback for
canvas, charts and image-heavy surfaces. This repository does not use it: everything under test has
a real accessibility tree, and a coordinate click would produce exactly the brittle locator the
coding standard forbids.

## The Two Servers Here

`.mcp.json` defines both, and they are not interchangeable.

| Server            | Package                          | Used by                         | For                                                   |
| ----------------- | -------------------------------- | ------------------------------- | ----------------------------------------------------- |
| `playwright-test` | `playwright run-test-mcp-server` | planner, generator, healer      | authoring and running cases, saving a plan, debugging |
| `playwright`      | `@playwright/mcp`                | exploration from a chat session | walking the live application, confirming a locator    |

The exploration server is started with `--isolated`, `--test-id-attribute data-qa` and
`--viewport-size 1920,1080`, which are the three settings that make what it sees match what the suite
sees. `data-qa` is the attribute this application ships and the one `testIdAttribute` names in
`playwright.config.ts`; the viewport is the one every project runs at. A session started without them
reports locators the suite cannot reproduce.

## Practical Rules For This Repository

1. **Snapshot before acting.** Read the accessibility tree, then act on a reference from it. Guessing
   a selector and checking whether it worked is the slow path and it produces locators nobody
   verified.
2. **Prefer the accessibility snapshot to a screenshot** for anything structural. Take a screenshot
   only when the question is genuinely about appearance — which, in this repository, means the visual
   suite, not exploration.
3. **Keep the snapshot small.** Scope to the region under discussion rather than dumping the whole
   page. A large snapshot costs context that the rest of the task needs.
4. **A locator confirmed through MCP still goes through the priority order** in the page object
   skill: role, label, placeholder, text, `data-qa`, then CSS with a written reason. MCP tells you
   what is on the page, not which locator to keep.
5. **MCP is not a test.** The server emits traces and screenshots but no machine-readable report, and
   it is not built for CI. The durable artefact is the committed spec, run by the Playwright test
   runner. Nothing in this repository's pipeline calls MCP.
6. **`--isolated` is deliberate.** A persistent browser profile can only be used by one instance at a
   time, so two sessions sharing a profile conflict. Isolated keeps the profile in memory; state a
   session needs comes from a fixture, not from a browser that remembers.
7. **The server is not a security boundary.** It drives a real browser with the permissions it was
   given. Point it at the application under test, not at anything holding real credentials.
8. **Do not use MCP for what the runner does better.** Running the suite, reading a failure, checking
   a threshold: those are `yarn test:e2e`, `yarn test:vr` and the HTML report. MCP earns its cost
   during exploration, locator discovery and diagnosis of a failure whose cause is not in the trace.

## Definition Of Done

- Every locator that reached a page object was confirmed against the live page, not inferred from
  markup someone remembered.
- The confirmation used the same `data-qa` attribute and viewport the suite runs at.
- Anything discovered through MCP ended up in a committed artefact: a page object, a plan, a case.
  An MCP session is not a deliverable.
- No coordinate-based interaction survived into a spec.
