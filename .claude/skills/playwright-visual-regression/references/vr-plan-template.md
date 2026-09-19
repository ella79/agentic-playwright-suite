# Visual regression plan template

Every plan in `specs/vr-test-plans/` uses this shape.

```markdown
# <Area> Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                        |
| ----------- | -------------------------------------------- |
| Page URL    | `/<route>`                                   |
| Page Title  | The page's real `<title>`, read from the app |
| Spec File   | `vr-tests/<area>.vr.spec.ts`                 |
| Page Object | `utils/pageObjects/<area>/<name>Page.ts`     |
| Baselines   | `vr-tests/<area>.vr.spec.ts-snapshots/`      |

## Scope

Why this area is worth capturing: which visual states break in ways a functional assertion never
notices.

## Cases

| ID    | Name                           | Screenshot       | State captured         |
| ----- | ------------------------------ | ---------------- | ---------------------- |
| VR-nn | Add-to-cart confirmation modal | `<area>-<state>` | The state, in one line |

## Notes

Only where a case departs from the default: a raised threshold, a mask, a viewport capture instead
of an element. Each note carries the reason.

## Out of Scope

States deliberately not captured, each with its reason: a state another case already covers, or one
that cannot be captured stably, such as a carousel that advances on a timer.
```

## Rules

- The `Metadata` block comes first, immediately after the title and before `## Scope`, so a reader
  knows which page the plan covers and which files implement it without grepping for them. It is the
  functional block plus `Baselines`, and it holds the spec file, so the opening line carries only the
  conventions link and the seed.
- `Page URL` is the route as `utils/url.ts` holds it. A plan that spans two surfaces names both, in
  the order the flow visits them; the same goes for `Page Object` when the cases drive more than one
  class.
- `Page Title` is the live `<title>` of that page, read from the running application. It is never
  derived from the heading, from the URL, or from what a title probably says.
- `Name` is the case's test title, not a second description of the state. The spec titles the case
  `<ID>: <Name>`, so the cell holds exactly the text that follows the ID prefix, character for
  character. Whichever is written first, the other copies it: the plan and the spec hold one string
  in two places, and a name reworded in either one breaks the link this column exists to create.
- `Name` and `Screenshot` are two different strings and neither is derived from the other. The name
  is the title a person reads in the report; the screenshot is the baseline file name.
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
