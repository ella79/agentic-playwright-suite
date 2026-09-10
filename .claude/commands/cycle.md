---
description: Run a full plan to implement to review to validate cycle for a feature area
argument-hint: <feature area>
allowed-tools: Task, Read, Write, Edit, Grep, Glob, Bash, TodoWrite
---

Delegate to the **playwright-test-manager** agent.

Feature area: $ARGUMENTS

The manager owns the cycle. For a whole feature it runs W9, which chains the two suites in order:
functional to green first, then the visual pass on the page object that pass built. For a single
case it runs W2 or W3 alone. Either way it starts at W1 if the request would push a suite past its
cap.

Step order is planner, generator one case at a time, reviewer on the changed files, static checks,
the case, the suite, healer on failure, then `specs/STATUS.md`.

The review step is not optional because the tests pass. Report the cycle as a table: file, cases
added, review findings, final run result.
