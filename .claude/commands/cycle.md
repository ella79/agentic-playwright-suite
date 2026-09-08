---
description: Run a full plan to implement to review to validate cycle for a feature area
argument-hint: <feature area>
allowed-tools: Task, Read, Write, Edit, Grep, Glob, Bash, TodoWrite
---

Delegate to the **playwright-test-companion** agent.

Feature area: $ARGUMENTS

It owns the full cycle and delegates each step:

1. `playwright-test-planner` writes the plan from live exploration
2. `playwright-test-generator` implements each case, one at a time
3. `playwright-test-reviewer` audits the resulting file set
4. The companion runs `yarn typecheck && yarn lint && yarn stylecheck`, then the suite
5. `playwright-test-healer` handles any failure
6. `specs/STATUS.md` is updated with what landed

Step 3 is not optional because the tests pass. Report the cycle as a table: file, cases added,
review findings, final run result.
