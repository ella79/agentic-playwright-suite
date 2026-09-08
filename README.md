# Agentic Playwright Suite

End-to-end and visual regression tests for [Automation Exercise](https://automationexercise.com),
written with Playwright and TypeScript.

## Quick Start

```bash
yarn install
yarn playwright:install
yarn test:e2e
```

## Commands

| Command            | Purpose                         |
| ------------------ | ------------------------------- |
| `yarn test:e2e`    | Run the functional E2E suite    |
| `yarn test:vr`     | Run the visual regression suite |
| `yarn test:report` | Open the last HTML report       |
| `yarn typecheck`   | TypeScript check                |
| `yarn lint`        | ESLint                          |
| `yarn stylecheck`  | Prettier check                  |

## Status

Work in progress. See [`specs/STATUS.md`](specs/STATUS.md) for current coverage and next steps.
