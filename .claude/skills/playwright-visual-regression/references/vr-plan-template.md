# Visual regression plan template

Every plan in `specs/vr-test-plans/` uses this shape.

```markdown
# <Area> Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/<area>.vr.spec.ts`.

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
```

## Rules

- The screenshot column holds the baseline name without `.png` and without the platform suffix
  Playwright appends. It must match the name in the spec exactly.
- IDs are continuous across the visual suite, `VR-01` upward.
- A case is one state and one capture. Two states are two cases.
- No note means the case uses the project default threshold. A raised threshold without a note is a
  defect.
