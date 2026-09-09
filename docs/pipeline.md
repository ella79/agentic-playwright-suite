# Pipeline and Reporting

```
   build                 check                  end2end

prepare-playwright  →  static-checks  →  e2e-playwright     ┐
      image                           →  visual-regression  ┴→  publish-dashboard
```

Runs on every push and pull request to `main`.

| Job                        | Responsibility                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `prepare-playwright-image` | Builds the execution image and pushes it to the GitHub Container Registry                  |
| `static-checks`            | Typecheck, lint, format. Gates everything after it                                         |
| `e2e-playwright`           | The functional suite                                                                       |
| `visual-regression`        | The visual suite, separate so a screenshot diff never hides functional signal              |
| `cross-browser`            | The same twenty functional cases replayed on WebKit, skipped on pull requests              |
| `publish-dashboard`        | Merges the reports, restores trend history, builds the suite health page, deploys to Pages |
| `ci-gate`                  | Reads every other job's result. The only check the branch protection requires              |

## Branch Protection

`main` accepts no direct pushes, from anyone, and the bypass list is empty on purpose: a rule with an
exception for its author is a rule a reviewer discounts. Every change arrives through a pull request
that cannot merge until `ci-gate` is green, and force pushes and branch deletion are refused.

The gate exists because GitHub treats a skipped job as a satisfied requirement. Naming the test jobs
directly would have meant that a job which stopped running quietly stopped being enforced.

Every job after the build runs inside the image the build produced, so browsers and dependencies are
installed once instead of three times. The image tag carries the Playwright version and a hash of
`package.json` plus `package-lock.json`, so a dependency change produces a new tag and no job can run against
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

### The report is verified before it is published

The portfolio at [ella79.github.io/portfolio](https://ella79.github.io/portfolio/) reads this
report. It publishes a contract, `contract/allure-report.contract.json` in
[ella79/portfolio](https://github.com/ella79/portfolio), naming exactly which documents and fields
it depends on. Everything the contract does not name is free to change here without warning.

`publish-dashboard` runs that contract against the freshly generated report before deploying. A
report that no longer fits fails the job, and the previously published dashboard stays up: a stale
report the page can read beats a fresh one that breaks it, and the failed run is the notification.

Both the contract and its checker are vendored into `env/contract/` rather than downloaded at run
time. A pipeline that fetches and executes a script from a URL is not a pattern worth demonstrating,
and a vendored copy shows up in the diff where a reviewer can see it. The check is pinned with
`--expect-version`, so refreshing the copy without reading what changed fails loudly instead of
verifying against expectations nobody reviewed.

## Dependency Updates

[`renovate.json`](../renovate.json) extends `config:best-practices`, which is what Renovate's own
upgrade guidance recommends over `config:recommended`. That preset is where most of the behaviour
comes from: it pins Docker images to digests, pins GitHub Actions to commit SHAs, pins dev
dependencies, maintains lock files weekly, and holds npm releases for a minimum age before offering
them. Every dependency pull request this repository has received came from those rules rather than
from anything written here.

Three rules are local, because no preset can know them:

| Rule             | Why it cannot come from a preset                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `playwright`     | The npm package and the `mcr.microsoft.com/playwright` image must move together. The image ships browser binaries built for that release, so splitting them would leave the suite comparing screenshots against baselines captured by a different renderer. The pull request also carries the instructions to regenerate baselines and agent definitions afterwards |
| `allure`         | The reporter and the command line generator have to agree on the results format                                                                                                                                                                                                                                                                                     |
| `github actions` | Keeps the pipeline's own updates in one review                                                                                                                                                                                                                                                                                                                      |

Linting is grouped by the official `group:linters` preset rather than by hand. It covers `eslint**`,
`@typescript-eslint/**`, `@stylistic/eslint-plugin**` and `prettier`, and its documented reason is
better than the one a local rule would give: upgrading linters individually means reasoning about
peer dependencies one package at a time.

Three categories merge themselves once `ci-gate` is green: linters and formatters on non major
updates, and weekly lock file maintenance. Renovate's automerge guidance names development
dependencies, linters and formatters in particular, as the safest category and limits the practice
to non major updates, and it asks for a fourteen day minimum release age on anything automerged, so
that is set. Playwright is excluded by name: a version change moves glyph rendering, so it needs the
baselines regenerated and the agents rebuilt before it can be believed.

Automerging still cannot bypass the branch protection. Renovate opens a pull request, waits for the
gate, and merges only if it passed. Branch level automerge, which skips the pull request entirely,
is not possible on a repository that requires them, which this one does.

Nothing else is configured. `dependencyDashboard`, weekly lock file maintenance and a concurrent
pull request limit of ten are all already what the presets or the defaults give, so setting them
again would only be noise that reads like configuration.
