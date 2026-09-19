# Home Test Plan

## Metadata

| Field       | Value                                |
| ----------- | ------------------------------------ |
| Page URL    | `/`                                  |
| Page Title  | `Automation Exercise`                |
| Spec File   | `tests/home/home.spec.ts`            |
| Page Object | `utils/pageObjects/home/homePage.ts` |

## Scope

The newsletter subscription in the footer, which is the only behaviour the home page offers. Its appearance, and the header and featured grid, are covered by `specs/vr-test-plans/home-vr-test-plan.md`.

## Preconditions

Seed: `specs/seed.spec.ts`

- No account required.

## Test Cases

| ID    | Name                                                      | Type  | Scenario                                               | Expected                                  |
| ----- | --------------------------------------------------------- | ----- | ------------------------------------------------------ | ----------------------------------------- |
| TC-20 | A visitor can subscribe to the newsletter from the footer | happy | A visitor subscribes to the newsletter from the footer | The subscription success message is shown |

## Locator Notes

- The subscription success banner appears in place, without navigation.

## Out of Scope

- The hero carousel: it advances on a timer, so any assertion on its content races its own state.
