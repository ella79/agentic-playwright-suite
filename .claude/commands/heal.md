---
description: Diagnose and repair a failing test
argument-hint: <case id or spec file>
allowed-tools: Task, Read, Edit, Grep, Glob, Bash, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_click, mcp__playwright__browser_evaluate
---

Delegate to the **playwright-test-healer** agent.

Failing test: $ARGUMENTS

The healer must establish the root cause before changing anything, using the trace or a live MCP
session, and classify the failure per its definition. Hard limits it may not cross:

- No weakening what the test asserts to make it green
- No `waitForTimeout`, no raising `retries`
- No updating a VR baseline without first confirming the visual change was intentional
- If the application is genuinely broken, mark `test.fixme()` with the defect named and report it
  rather than editing the test until it passes

It reports root cause, evidence, fix, and a clean verification run without retries.
