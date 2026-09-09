---
description: Implement one test case from an existing plan
argument-hint: <case id, e.g. "TC-21" or "VR-21">
allowed-tools: Task, Read, Write, Edit, Grep, Glob, Bash
---

Delegate to the **playwright-test-generator** agent.

Case to implement: $ARGUMENTS

Requirements:

- Read the plan the case belongs to first. Implement exactly that case, nothing adjacent.
- Follow `.claude/skills/playwright-pageobject-testing/SKILL.md`. For a visual case, also follow
  `.claude/skills/playwright-visual-regression/SKILL.md`.
- Reuse existing page objects before writing new ones. Any new class extends `BaseAppPage` or
  `BaseComponentPage` and is exported from `utils/pageObjects/index.ts`.
- Run `npm run typecheck && npm run lint`, then the single case, and report whether it passed on the
  first attempt. A case that only passed on a retry is reported as flaky, not as done.
