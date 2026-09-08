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
3. State the current counts against the suite caps (20 functional, 20 visual).
4. Recommend the single highest-value next piece of work. If the caps are already reached, name the
   weakest existing case and propose a swap rather than growing the suite.

Focus area, if given: $ARGUMENTS
