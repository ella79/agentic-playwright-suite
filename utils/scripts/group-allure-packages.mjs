// Groups the Allure Packages tab by suite.
//
// allure-playwright derives the package label from the file path, and every
// path starts with the repository folder, so both suites collapse into one
// node. The reporter exposes no option, and a second label is ignored: Allure
// keeps the first. Rewriting the leading segment after the run is the only
// place the change fits, and it leaves the file structure intact.
//
// Usage: node utils/scripts/group-allure-packages.mjs <results-dir> [...]
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const directories = process.argv.slice(2);

if (directories.length === 0) {
  console.error("Usage: group-allure-packages.mjs <results-dir> [...]");
  process.exit(1);
}

for (const directory of directories) {
  let entries;
  try {
    entries = await readdir(directory);
  } catch {
    console.log(`${directory}: not present, skipping`);
    continue;
  }

  let rewritten = 0;
  for (const entry of entries.filter((name) => name.endsWith("-result.json"))) {
    const path = join(directory, entry);
    const result = JSON.parse(await readFile(path, "utf-8"));
    const labels = result.labels ?? [];

    const suite = labels.find((label) => label.name === "parentSuite")?.value;
    const packageLabel = labels.find((label) => label.name === "package");
    if (!suite || !packageLabel) {
      continue;
    }

    const withoutRoot = packageLabel.value.split(".").slice(1).join(".");
    packageLabel.value = withoutRoot ? `${suite}.${withoutRoot}` : suite;

    // Only the first package label is read, so any others are noise.
    result.labels = labels.filter(
      (label) => label.name !== "package" || label === packageLabel,
    );

    await writeFile(path, JSON.stringify(result));
    rewritten += 1;
  }
  console.log(`${directory}: grouped ${rewritten} results by suite`);
}
