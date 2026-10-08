---
description: Audit suite coverage against the plans and decide what to work on next
allowed-tools: Task, Read, Grep, Glob
---

Delegate to the **playwright-test-manager** agent.

Ask it to:

1. Read `specs/STATUS.md`, the coverage baseline.
2. Cross-check every case ID in `specs/test-plans/*.md` and `specs/vr-test-plans/*.md` against what is
   actually implemented in `tests/` and `vr-tests/`. Report both directions: planned-but-missing and
   implemented-but-unplanned.
3. State the current counts per suite.
4. Recommend the single highest-value next piece of work: a state of the page or the API found
   missing, not a count to fill.

Focus area, if given: $ARGUMENTS
