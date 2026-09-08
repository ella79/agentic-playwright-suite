---
description: Audit test code against the repository conventions
argument-hint:
  [file or directory, defaults to everything changed on this branch]
allowed-tools: Task, Read, Grep, Glob, Bash
---

Delegate to the **playwright-test-reviewer** agent. It is read-only: it reports, it does not fix.

File set to audit: $ARGUMENTS

If no file set is given, audit everything changed against `main` (`git diff --name-only main...HEAD`).

The reviewer must work through its full checklist and additionally flag assertions that would still
pass if the product were broken. Findings come back as a table with file, line, severity, and the
fix. Blockers first. Clean files are named as clean.
