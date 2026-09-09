# Functional test plan template

Every plan in `specs/test-plans/` uses this shape. A plan written in any other shape is rejected:
five plans already exist and a sixth in a different form makes the set unreadable.

```markdown
# <Area> Test Plan

## Scope

What this area covers, in two or three sentences. State the boundary, not the feature list.

## Preconditions

Seed: `specs/seed.spec.ts`

- What the suite provides automatically (fresh context, per-test account).
- What a case must arrange itself.

## Test Cases

| ID    | Type  | Scenario                                   | Expected                                  |
| ----- | ----- | ------------------------------------------ | ----------------------------------------- |
| TC-nn | happy | What the user does, in the user's language | The observable outcome, not the mechanism |

## Locator Notes

Only where the DOM forced a decision: an anchor without `href`, a control with no accessible name,
a duplicated label. Each note says what was chosen and why.

## Out of Scope

What this plan deliberately leaves out, with the reason.
```

## Rules

- `Type` is one of `happy`, `edge`, `error`. Every area carries at least one non-happy case.
- IDs are continuous across the whole suite, `TC-01` upward, and never reused after a swap.
- The scenario column reads as behaviour. `A visitor adds a product from its detail page`, not
  `test add to cart`.
- The expected column is observable: what a person would see, not which function ran.
