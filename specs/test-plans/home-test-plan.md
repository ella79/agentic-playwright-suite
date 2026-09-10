# Home Test Plan

## Scope

The newsletter subscription in the footer, which is the only behaviour the home page offers. Its appearance, and the header and featured grid, are covered by `specs/vr-test-plans/home-vr-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- No account required.

## Test Cases

| ID    | Type  | Scenario                                               | Expected                                  |
| ----- | ----- | ------------------------------------------------------ | ----------------------------------------- |
| TC-20 | happy | A visitor subscribes to the newsletter from the footer | The subscription success message is shown |

## Locator Notes

- The subscription success banner appears in place, without navigation.

## Out of Scope

- The hero carousel: it advances on a timer, so any assertion on its content races its own state.
