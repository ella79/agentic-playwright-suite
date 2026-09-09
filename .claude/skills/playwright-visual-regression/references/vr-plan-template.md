# Visual regression plan template

Every plan in `specs/vr-test-plans/` uses this shape.

```markdown
# <Area> Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/<area>.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

Why this area is worth capturing: which visual states break in ways a functional assertion never
notices.

## Cases

| ID    | Screenshot       | State captured         |
| ----- | ---------------- | ---------------------- |
| VR-nn | `<area>-<state>` | The state, in one line |

## Notes

Only where a case departs from the default: a raised threshold, a mask, a viewport capture instead
of an element. Each note carries the reason.

## Out of Scope

States deliberately not captured, each with its reason: a state another case already covers, or one
that cannot be captured stably, such as a carousel that advances on a timer.
```

## Rules

- The screenshot column holds the baseline name without `.png` and without the platform suffix
  Playwright appends. It must match the name in the spec exactly.
- IDs are assigned in sequence, `VR-01` upward, taking the next number after the highest the suite
  holds. They are never reused and never renumbered: the ID is what ties the plan to the test title,
  to `STATUS.md` and, for a visual case, to the baseline name.
- A retired case leaves its number behind. The gap is the record that it existed; closing it by
  renumbering would silently repoint every one of those links.
- A case is one state and one capture. Two states are two cases.
- `Out of Scope` is not optional. At a cap of twenty captures, what was left out and why is the
  argument that the twenty were chosen rather than collected.
- No note means the case uses the project default threshold. A raised threshold without a note is a
  defect.
