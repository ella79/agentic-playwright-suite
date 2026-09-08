# Decisions

Append-only log of scope, architecture, and prioritization decisions, and why they were made.

## 2026-09-08 — Single demo app: Automation Exercise

Chose one application instead of combining several practice sites. Automation Exercise has enough
depth (catalog, search/filters, cart, checkout, account lifecycle, contact form) to justify a real
page-object hierarchy and stateful fixtures, unlike simpler single-flow demos.

## 2026-09-08 — No shared seed account / no storageState reuse

The reference architecture this project's structure is adapted from (an internal OAuth-backed app)
reuses a single authenticated `storageState` across the whole suite, because login there is an
expensive OAuth redirect. Automation Exercise's login is a two-field POST — cheap enough that the
speed gained from reusing storage state isn't worth the shared-state risk (a `delete-account` test
would destroy the shared session for every other test, and parallel shards would race on one
account). Every test that needs a logged-in user creates and deletes its own throwaway account via
the `uniqueAccount` fixture instead. Fully isolated, no bootstrap step, safe under parallel workers.

## 2026-09-08 — MCP over CLI for agent↔browser integration

Standardized on the official `playwright-mcp` server for agent-driven exploration, generation, and
healing, rather than the newer token-efficient `@playwright/cli`. MCP is the more widely recognized
integration point and matches the skill this project is meant to demonstrate.

## 2026-09-08 — VR uses native `toHaveScreenshot()` directly, no custom runtime wrapper

Considered building a `vrSnapshot()` abstraction over strategies (static component, overlay,
fullscreen) as seen in more mature internal suites. Skipped for this project's scope — with a 20-test
cap, a custom runtime adds indirection without enough repetition to pay for itself. Thresholds and
state-preparation rules are still documented and enforced by convention (see the
`playwright-visual-regression` skill), just not wrapped in a runtime.

## 2026-09-08 — Cookie consent dismissal is a first-class base page concern

Automation Exercise renders a GDPR/TCF consent banner inside a shadow DOM on first load, plus
third-party ad iframes that inject unpredictably. `BaseAppPage` dismisses the consent banner on every
`goto`; VR tests mask or avoid regions where ads can inject rather than asserting on them.
