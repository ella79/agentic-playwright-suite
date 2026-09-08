# Specs

Test plans, project state, and decision history for this suite.

## Structure

| Path             | Purpose                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `STATUS.md`      | Coverage tables, findings raised against the application, next steps       |
| `DECISIONS.md`   | Append-only decision log — every scope and architecture call, with why     |
| `test-plans/`    | Five functional plans, one per feature area, covering TC-01 to TC-20       |
| `vr-test-plans/` | The visual plan covering VR-01 to VR-20, with each capture's justification |

## Conventions

- Every spec file references its plan through a `// spec: specs/…` header, so a case can always be
  traced back to the reasoning that produced it
- Plans define cases as TC-nn or VR-nn with steps and expected outcomes, and state what they
  deliberately leave uncovered
- `STATUS.md` is updated whenever coverage changes
- `DECISIONS.md` is append-only: a decision that gets superseded gains a new entry saying so, rather
  than being edited away. The reasoning that turned out wrong is the part worth keeping.

## Suite Caps

Twenty functional cases and twenty visual cases, both full. Adding coverage means naming the weakest
existing case it replaces. The cap exists so the suite stays reviewable: a portfolio of two hundred
shallow assertions demonstrates less than twenty that each earn their place.
