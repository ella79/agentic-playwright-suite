---
description: Run a full plan to implement to review to validate cycle for a feature area
argument-hint: <feature area>
allowed-tools: Task, Read, Write, Edit, Grep, Glob, Bash, TodoWrite
---

Delegate to the **playwright-test-manager** agent.

Feature area: $ARGUMENTS

The manager owns the cycle. It runs W2 for a functional area and W3 for a visual one, and starts at
W1 instead if the request would add a case beyond the cap.

Step order is planner, generator one case at a time, reviewer on the changed files, static checks,
the case, the suite, healer on failure, then `specs/STATUS.md`.

The review step is not optional because the tests pass. Report the cycle as a table: file, cases
added, review findings, final run result.
