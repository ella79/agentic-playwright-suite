---
description: Read the last red pipeline run and separate an infrastructure failure from a test failure
argument-hint: [run id, defaults to the latest failed run on this branch]
allowed-tools: Read, Grep, Glob, Bash(gh run *), Bash(gh pr checks *)
---

Delegate to the **playwright-test-manager** agent, workflow W5.

Run: $ARGUMENTS

Name the job and the failing step first. A setup, image, install or publish step is infrastructure
and is fixed in the workflow file; only a failing test step goes to the healer.

Report: job, step, first error line, classification, and the fix you propose. Never re-run a job
without a hypothesis for why the second attempt would differ.
