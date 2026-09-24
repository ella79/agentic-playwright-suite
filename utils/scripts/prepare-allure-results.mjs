// Prepares Allure results before a report is generated from them.
//
// 1. Drops the `setup` project's result when it passed. Signing the shared
//    account in is a precondition, not a case: counted, it put a
//    "Functional E2E · Chromium" row into the visual report and one extra case
//    into every total. A failed setup stays, so the reason the cases after it
//    never ran is still in the report.
// 2. Marks a result flaky when it passed only after an earlier attempt of the
//    same case failed. allure-playwright keeps every attempt but never sets
//    `statusDetails.flaky`, the field Allure reads to mark a result flaky, so a
//    case Playwright itself reports as flaky showed in Allure as a plain pass.
//
// Usage: node utils/scripts/prepare-allure-results.mjs <results-dir> [...]
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stripVTControlCharacters } from "node:util";

const directories = process.argv.slice(2);

if (directories.length === 0) {
  console.error("Usage: prepare-allure-results.mjs <results-dir> [...]");
  process.exit(1);
}

const isSetup = (result) =>
  (result.parameters ?? []).some(
    (parameter) => parameter.name === "Project" && parameter.value === "setup",
  );

function attachmentSources(item, sources = []) {
  for (const attachment of item.attachments ?? [])
    sources.push(attachment.source);
  for (const step of item.steps ?? []) attachmentSources(step, sources);
  return sources;
}

for (const directory of directories) {
  let entries;
  try {
    entries = await readdir(directory);
  } catch {
    console.log(`${directory}: not present, skipping`);
    continue;
  }

  const results = [];
  for (const entry of entries.filter((name) => name.endsWith("-result.json"))) {
    const path = join(directory, entry);
    results.push({ path, result: JSON.parse(await readFile(path, "utf-8")) });
  }

  let dropped = 0;
  const kept = [];
  for (const item of results) {
    if (isSetup(item.result) && item.result.status === "passed") {
      await unlink(item.path);
      for (const source of attachmentSources(item.result)) {
        await unlink(join(directory, source)).catch(() => {});
      }
      dropped += 1;
    } else {
      kept.push(item);
    }
  }

  const attempts = new Map();
  for (const item of kept) {
    const group = attempts.get(item.result.historyId) ?? [];
    group.push(item);
    attempts.set(item.result.historyId, group);
  }

  let flaky = 0;
  for (const group of attempts.values()) {
    if (group.length < 2) continue;
    group.sort((a, b) => a.result.start - b.result.start);
    const last = group[group.length - 1];
    const firstFailure = group
      .slice(0, -1)
      .find((item) => ["failed", "broken"].includes(item.result.status));
    if (last.result.status === "passed" && firstFailure) {
      // Allure groups a category by message; a passing attempt has none.
      const reason = stripVTControlCharacters(
        firstFailure.result.statusDetails?.message ?? "",
      ).split("\n")[0];
      last.result.statusDetails = {
        ...last.result.statusDetails,
        flaky: true,
        message: `Passed on retry. First attempt: ${reason}`,
      };
      await writeFile(last.path, JSON.stringify(last.result));
      flaky += 1;
    }
  }

  console.log(
    `${directory}: dropped ${dropped} passed setup result(s), marked ${flaky} flaky`,
  );
}
