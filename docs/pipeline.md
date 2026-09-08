# Pipeline and Reporting

```
   build                 check                  end2end

prepare-playwright  →  static-checks  →  e2e-playwright     ┐
      image                           →  visual-regression  ┴→  publish-dashboard
```

Runs on every push and pull request to `main`.

| Job                        | Responsibility                                                                |
| -------------------------- | ----------------------------------------------------------------------------- |
| `prepare-playwright-image` | Builds the execution image and pushes it to the GitHub Container Registry     |
| `static-checks`            | Typecheck, lint, format. Gates everything after it                            |
| `e2e-playwright`           | The functional suite                                                          |
| `visual-regression`        | The visual suite, separate so a screenshot diff never hides functional signal |
| `publish-dashboard`        | Merges both reports, restores trend history, deploys to GitHub Pages          |

Every job after the build runs inside the image the build produced, so browsers and dependencies are
installed once instead of three times. The image tag carries the Playwright version and a hash of
`package.json` plus `yarn.lock`, so a dependency change produces a new tag and no job can run against
an image whose `node_modules` no longer match the lockfile.

Traces, screenshots and visual diffs upload as artifacts on failure.

ESLint findings are exported as SARIF and uploaded to GitHub code scanning, which annotates them on
the pull request line by line. A red job says something is wrong; an annotation says which line.
Suppressed rules carry their suppression into the SARIF, so an intentional inline disable does not
surface as an open alert.

## The Published Report

Playwright project names match the CI job names, so a merged report labels every result
`e2e-playwright` or `visual-regression` instead of leaving forty rows to be told apart by path.

Allure results are labelled by an automatic fixture rather than by hand, because a label applied
only where someone remembered is one the report cannot rely on. Each result carries:

| Label                      | Effect in the report                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `parentSuite`              | Splits the dashboard into Functional E2E and Visual regression under every status filter |
| `suite`                    | Breaks each of those down by area                                                        |
| `epic`, `feature`, `story` | Populates the Behaviours tab                                                             |
| `severity`                 | Critical only where a failure means a user cannot buy or cannot reach their account      |
| `link`                     | The plan that justifies the case, read from its own `// spec:` header, plus its source   |

Three reports are published rather than one. Allure plots status over time for whatever it was
given, so a combined report can only ever draw a single line for both suites. The functional and
visual reports each keep their own history, which is what makes one trend readable next to the
other.

`categories.json` classifies failures, since a screenshot diff, a host 5xx and a real assertion
failure are three different conversations. `environmentInfo` records the base URL, browser,
viewport, commit and branch behind a run. `executor.json` links the published report back to the
pipeline run that produced it.

## Dependency Updates

[`renovate.json`](renovate.json) configures Renovate, which needs the app installed on the
repository to act. The configuration encodes one constraint the project cannot survive without:
`@playwright/test` and the `mcr.microsoft.com/playwright` image tag are grouped into a single pull
request. The image ships browser binaries built for that exact release, so letting them move
separately would leave the repository in a state where the rendering the baselines were captured
with no longer matches the rendering they are compared against.

Any Playwright update carries a note to regenerate the baselines afterwards, and to regenerate the
agent definitions, since both are tied to the installed version.
