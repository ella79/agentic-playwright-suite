# The Agent Workflow

`.claude/` holds five agents, three skills, two MCP server registrations and the slash commands that
connect them. They were used to build and audit this suite, not written as decoration.

Planner, generator and healer are generated rather than hand written. `npx playwright init-agents
--loop=claude` produces definitions matched to the installed Playwright version, carrying the exact
tool names and call protocol of its authoring MCP server. Each then gains a project rules section,
because the official definitions know nothing about this codebase: the generator's own example
writes `page.click(...)` directly, which this repository does not allow. Manager and reviewer are hand
written, since the official set has no equivalent.

| Agent                       | Responsibility                                  | Source        |
| --------------------------- | ----------------------------------------------- | ------------- |
| `playwright-test-manager`   | Scope, the caps, the gates, and the whole cycle | hand written  |
| `playwright-test-planner`   | Live exploration, then a written plan           | `init-agents` |
| `playwright-test-generator` | One case at a time, from an existing plan       | `init-agents` |
| `playwright-test-reviewer`  | Read only convention audit                      | hand written  |
| `playwright-test-healer`    | Root cause diagnosis of failures                | `init-agents` |

| Command             | Effect                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| `/coverage`         | The manager audits plans against implementations and proposes the next move |
| `/plan <area>`      | The planner explores the live site and writes a plan                        |
| `/implement <case>` | The generator implements exactly that case                                  |
| `/review [files]`   | The reviewer audits against the checklist                                   |
| `/heal <case>`      | The healer diagnoses before touching anything                               |
| `/cycle <area>`     | The manager runs the whole loop                                             |
| `/baseline [case]`  | The manager triages a failing visual case before any baseline changes       |
| `/triage [run]`     | The manager separates an infrastructure failure from a test failure         |

Two MCP servers are registered in `.mcp.json`. `playwright-test`
(`npx playwright run-test-mcp-server`) is the authoring server the generated agents use. It reads
`playwright.config.ts`, so an agent inherits the base URL, the `data-qa` test id attribute and the
viewport instead of being told them twice, and it exposes generation tools that a general browser
server does not have. [`@playwright/mcp`](https://github.com/microsoft/playwright-mcp) stays
registered for exploration outside test authoring.

The skills are enforced rather than suggested. Four rules from
`.claude/skills/playwright-pageobject-testing/SKILL.md`, namely no hard waits, no skipped tests, no
forced clicks and every test must assert, are configured as ESLint errors scoped to spec files. A
violation fails `static-checks` before any test runs, because a standard that lives only in prose is
a standard that erodes.

## The Loop

The agents are not six ways to ask for a test. They are one chain, and each link hands the next
something narrower than it received.

1. **Explore.** The planner opens the application through MCP and reads the accessibility tree, so
   the locators that end up in code were seen rather than guessed.
2. **Plan.** It writes the area's plan into `specs/test-plans/`, with the cases, the states worth
   covering, and an explicit list of what it is leaving out.
3. **Implement one case.** The generator takes a single case from that plan, walks it in the
   browser, and writes the spec, whose `// spec:` header points back at the plan that justifies it.
4. **Page object first.** If a locator it needs does not exist, it goes into the page object before
   it is used. The generated agent's own example writes `page.click(...)` directly, which is exactly
   why the project rules section overrides it.
5. **Review.** The reviewer audits the result against the coding standard and reports. It cannot
   edit, so it cannot quietly fix what it should be reporting.
6. **Heal.** If a case fails, the healer establishes the cause before changing anything, and
   classifies it: application changed, test raced the UI, state left by another test, third party
   noise, or a genuine defect, which is parked with `test.fixme()` rather than repaired.

The manager runs that chain for one area, decides which area is next, and owns the caps. Its
workflows cover the cases a suite actually meets: a coverage request against a full cap, a new
functional or visual case, a failing baseline, a red pipeline, an existing case that is wrong, a
plan implemented only in part, and a health check. Skills are not chosen by the agents: they are the
standards each step is measured against.
