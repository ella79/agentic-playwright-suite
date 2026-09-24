# Pipeline and Reporting

```
                                  resolve-pr-run
                                         │
                                         ▼
                             prepare-playwright-image
                                         │
                                         ▼
                                   static-checks
                                         │
          ┌────────────────────┬────────┴─────────┬────────────────────┐
          ▼                    ▼                   ▼                    ▼
    e2e-chromium          e2e-webkit       visual-regression           api
          │                    │                   │                    │
          └────────────────────┴────────┬─────────┴────────────────────┘
                                         │
                                         ▼
                                 publish-dashboard
```

Runs on every pull request to `main` and on every push to it.

| Job                        | Responsibility                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `resolve-pr-run`           | On a push to `main`, finds the pull request run that already tested the same files; see below |
| `prepare-playwright-image` | Builds the execution image and pushes it to the GitHub Container Registry                     |
| `static-checks`            | Typecheck, lint, format. Gates everything after it                                            |
| `e2e-chromium`             | The functional suite on Chromium, one entry of the `e2e` matrix                               |
| `visual-regression`        | The visual suite, separate so a screenshot diff never hides functional signal                 |
| `e2e-webkit`               | The same cases on WebKit, the second `e2e` entry                                              |
| `api`                      | The REST API suite. No `setup` dependency: every case provisions its own throwaway account    |
| `publish-dashboard`        | Merges the reports, restores trend history, builds the suite health page, deploys to Pages    |
| `ci-gate`                  | Reads every other job's result. The only check the branch protection requires                 |

`api` feeds `publish-dashboard` the same way the other two do: its own Allure results join the
combined report, and it gets its own `api/` report with its own trend line, the same treatment
`functional/` and `visual/` already had.

## Reusing the Pull Request's Run

Every suite runs on the pull request, both engines included, so the push its merge makes to `main`
has nothing new to test. On that push, `resolve-pr-run` finds the merged pull request behind the
commit, compares the files its head holds with the files `main` now holds, and looks up the pull
request's latest successful run:

- Same files and a successful run: that run tested exactly what `main` now holds. A pull request that
  was not up to date merges onto a newer `main`, so its files differ and it does not qualify.
- Anything else, including a pull request from a fork, whose run executed code nobody had merged yet:
  everything runs here.

For now the job only reports what it would reuse, and every suite still runs on `main`. Handing the
run downstream, so `publish-dashboard` reads its artifacts instead of testing again, is the next step.

## Branch Protection

`main` accepts no direct pushes, from anyone, and the bypass list is empty on purpose: a rule with an
exception for its author is a rule a reviewer discounts. Every change arrives through a pull request
that cannot merge until `ci-gate` is green, and force pushes and branch deletion are refused.

The gate exists because GitHub treats a skipped job as a satisfied requirement. Naming the test jobs
directly would have meant that a job which stopped running quietly stopped being enforced.

The two functional boxes come from one job with a matrix over the Playwright project, which is the
shape GitHub offers for this and the one Playwright's CI guidance uses: each entry gets its own
runner, so the engines run in parallel instead of trebling one job's wall clock. Both run on pull
requests too, so a WebKit failure blocks the merge instead of surfacing on `main` after it.

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

For the functional engines, the Playwright project name and the CI job name are the same string
(`e2e-chromium`, `e2e-webkit`), so a reader moves from a box in the pipeline graph to a branch in the
report without a lookup table. The visual suite is the exception: its Playwright project is `vr`, its
CI job is `visual-regression`, and neither is what the report shows. The branch there reads
`Visual Regression` because that string is written by hand in `allureLabels.ts`, not derived from
either name. It does not borrow the `E2E` that the functional suite carries, either: this repository's
own VR / E2E boundary (see the `playwright-visual-regression` skill) treats E2E as naming the
functional suite specifically, and a screenshot comparison is a different kind of check.

Allure results are labelled by an automatic fixture rather than by hand, because a label applied
only where someone remembered is one the report cannot rely on. Each result carries:

| Label                      | Effect in the report                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `parentSuite`              | One row per suite and engine on the dashboard, `Functional E2E · Chromium` and so on   |
| `suite`                    | The area inside that row                                                               |
| `epic`, `feature`, `story` | Populates the Behaviours tab                                                           |
| `severity`                 | Critical only where a failure means a user cannot buy or cannot reach their account    |
| `link`                     | The plan that justifies the case, read from its own `// spec:` header, plus its source |

Four reports are published, not one per engine. The root report holds every result, seventy-four
distinct cases (22 functional, 33 visual, 19 API) with the functional cases counted once per engine,
for ninety-six results in total. `functional/`, `visual/` and `api/` exist because Allure draws a
single trend line per report, so a combined one could never show three trends at once.

Before any report is generated, `utils/scripts/prepare-allure-results.mjs` makes two corrections.
It drops the `setup` project's result when it passed: signing the shared account in is a
precondition, not a case, and counted it put a `Functional E2E · Chromium` row into the visual
report. A failed setup stays, so the reason nothing after it ran is still visible. And it marks a
result flaky when it passed only after an earlier attempt failed: allure-playwright keeps every
attempt but never sets `statusDetails.flaky`, so without this a case Playwright reports as flaky
reached Allure as a plain pass. The "Flaky" category in `categories.json` then lists those cases.

The engine sits in `parentSuite` rather than a level below it because Allure's Overview reads only
the top level of the suites tree. While both engines shared a parent, the dashboard drew one bar for
forty results, and a run that failed every case on Chromium and passed every case on WebKit read as
a single suite that half worked. The engine is still recorded as a parameter on every result as
well, which is what the portfolio page filters its replay on, and the contract checks that the name
and the parameter agree rather than trusting either alone.

`categories.json` classifies failures, since a screenshot diff, a host 5xx and a real assertion
failure are three different conversations. The same file reaches the suite health page as
`--categories`, alongside `--allure`, which points at the generated report so the page can read the
counts Allure worked out for those rules rather than matching the regexes a second time and possibly
disagreeing with the Categories tab one click away. `environmentInfo` records the base URL, browser,
viewport, commit and branch behind a run; the API run records no browser or viewport, and the
functional and root reports name both engines. `executor.json` links the published report back to the
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
