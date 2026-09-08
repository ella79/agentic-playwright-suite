---
description: Explore a feature area on the live site via MCP and write a test plan
argument-hint: <feature area, e.g. "recommended items carousel">
allowed-tools: Task, Read, Write, Grep, Glob, mcp__playwright-test__planner_setup_page, mcp__playwright-test__planner_save_plan, mcp__playwright-test__browser_navigate, mcp__playwright-test__browser_snapshot, mcp__playwright-test__browser_click, mcp__playwright-test__browser_type, mcp__playwright-test__browser_evaluate
---

Delegate to the **playwright-test-planner** agent.

Feature area to plan: $ARGUMENTS

Requirements:

- Call `planner_setup_page` first, then explore through the browser tools. Locators in the plan must
  come from an actual accessibility snapshot, not from memory.
- Record every state the area can be in, including empty, error, and unauthenticated states.
- Write the plan to `specs/test-plans/<area>-test-plan.md` in the format its agent definition
  specifies, including the "Out of Scope" section and confirmed accessible names.
- Respect the suite caps. If the plan would push the suite past 20 functional or 20 visual cases,
  say which existing case it should replace and why.
