# Functional test plan template

Every plan in `specs/test-plans/` uses this shape. A plan written in any other shape is rejected:
five plans already exist and a sixth in a different form makes the set unreadable.

```markdown
# <Area> Test Plan

## Metadata

| Field       | Value                                        |
| ----------- | -------------------------------------------- |
| Page URL    | `/<route>`                                   |
| Page Title  | The page's real `<title>`, read from the app |
| Spec File   | `tests/<area>/<area>.spec.ts`                |
| Page Object | `utils/pageObjects/<area>/<name>Page.ts`     |

## Scope

What this area covers, in two or three sentences. State the boundary, not the feature list.

## Preconditions

Seed: `specs/seed.spec.ts`

- What the suite provides automatically (fresh context, per-test account).
- What a case must arrange itself.

## Test Cases

| ID    | Name                                                     | Type  | Scenario                                   | Expected                                  |
| ----- | -------------------------------------------------------- | ----- | ------------------------------------------ | ----------------------------------------- |
| TC-nn | a product added from its detail page appears in the cart | happy | What the user does, in the user's language | The observable outcome, not the mechanism |

## Locator Notes

Only where the DOM forced a decision: an anchor without `href`, a control with no accessible name,
a duplicated label. Each note says what was chosen and why.

## Out of Scope

What this plan deliberately leaves out, with the reason.
```

## Rules

- The `Metadata` block comes first, immediately after the title and before `## Scope`, so a reader
  knows which page the plan covers and which files implement it without grepping for them.
- `Page URL` is the route as `utils/url.ts` holds it. A plan that spans two surfaces names both, in
  the order the flow visits them; the same goes for `Page Object` when the cases drive more than one
  class.
- `Page Title` is the live `<title>` of that page, read from the running application. It is never
  derived from the heading, from the URL, or from what a title probably says.
- `Name` is the case's test title, not a second description of it. The spec titles the case
  `<ID>: <Name>`, so the cell holds exactly the text that follows the ID prefix, character for
  character. Whichever is written first, the other copies it: the plan and the spec hold one string
  in two places, and a name reworded in either one breaks the link this column exists to create.
- A name reads as the outcome, in lower case, the way the test title does:
  `the quantity set before adding is the quantity in the cart`. It is not a restatement of the
  `Scenario` cell, and it is not a title-cased label.
- `Type` is one of `happy`, `edge`, `error`. Every area carries at least one non-happy case.
- IDs are assigned in sequence, `TC-01` upward, taking the next number after the highest the suite
  holds. They are never reused and never renumbered: the ID is what ties the plan to the test title,
  to `STATUS.md` and, for a visual case, to the baseline name.
- A retired case leaves its number behind. The gap is the record that it existed; closing it by
  renumbering would silently repoint every one of those links.
- The scenario column reads as behaviour. `A visitor adds a product from its detail page`, not
  `test add to cart`.
- The expected column is observable: what a person would see, not which function ran.
