---
description: Triage a failing visual case and decide whether its baseline may change
argument-hint: [case id or spec file, defaults to whatever failed last]
allowed-tools: Read, Grep, Glob, Bash
---

Delegate to the **playwright-test-manager** agent, workflow W4.

Target: $ARGUMENTS

Open the diff before anything else, then classify the failure as a regression, an intended UI
change, or an unstable capture. Report the classification with the evidence that supports it.

A regression is reported, never absorbed by regenerating. An intended change is regenerated through
`Update VR baselines` with a written reason, and a human looks at the PNG before it is committed.
Instability is fixed in state preparation, never by raising a threshold.
