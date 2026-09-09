#!/usr/bin/env node
/* Verifies a published Allure report against the contract this site consumes.
 *
 * The portfolio's QA suite page reads a report published by another repository.
 * Nothing stops that repository from moving a file or changing a shape, and the
 * page would degrade politely rather than loudly, which is the worst kind of
 * breakage: nobody finds out. This script is the check that finds out.
 *
 * It is written to be run from either side:
 *
 *   node scripts/verify-contract.mjs
 *       against the published report named in the contract, which is what the
 *       scheduled workflow here does.
 *
 *   node scripts/verify-contract.mjs --base ./allure-report
 *       against a report on disk, which is what the suite's own pipeline can do
 *       before it publishes, so a break is caught before it is live rather than
 *       after. That direction is the useful one: the consumer states what it
 *       needs, the provider verifies it.
 *
 * Exit code is 1 if any required document is missing or malformed. An optional
 * document that is absent is reported and forgiven, because the page hides the
 * panel that would have used it.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, isAbsolute, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(name);
  return at === -1 || at === args.length - 1 ? fallback : args[at + 1];
};

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const contractPath = flag("--contract", join(repoRoot, "contract", "allure-report.contract.json"));
const contract = JSON.parse(await readFile(contractPath, "utf8"));
const base = flag("--base", contract.provider);
const isUrl = /^https?:\/\//i.test(base);

/* For a provider that vendors this contract into its own repository rather than
   fetching it at publish time, which is the safer pattern: --expect-version
   turns a silent re-vendor into a loud failure. The provider pins the version
   it read and reviewed; a copy that arrives carrying a different one stops the
   run instead of being verified against expectations nobody has looked at. */
const expected = flag("--expect-version", null);
if (expected !== null && String(contract.version) !== String(expected)) {
  console.error(
    `This contract is version ${contract.version}, and the check was told to expect ${expected}.\n\n` +
      `A vendored copy has been replaced without the pin being updated. Read what\n` +
      `changed in ella79/portfolio, then update the pin, rather than trusting a\n` +
      `contract nobody has reviewed.`,
  );
  process.exit(1);
}

const problems = [];
const notes = [];

/** Read one document of the report, from a URL or from a directory. */
async function load(path) {
  if (isUrl) {
    const response = await fetch(new URL(path, base.endsWith("/") ? base : base + "/"));
    if (!response.ok) throw new Error(`answered ${response.status}`);
    return response.json();
  }
  const dir = isAbsolute(base) ? base : resolve(process.cwd(), base);
  return JSON.parse(await readFile(join(dir, path), "utf8"));
}

const pick = (value, field) =>
  field.split(".").reduce((at, key) => (at === undefined || at === null ? undefined : at[key]), value);

function checkField(document, check, where) {
  const value = pick(document, check.field);
  if (value === undefined || value === null) {
    problems.push(`${where}: missing ${check.field}`);
    return;
  }
  if (check.type && typeof value !== check.type) {
    problems.push(`${where}: ${check.field} is ${typeof value}, expected ${check.type}`);
    return;
  }
  if (check.min !== undefined && value < check.min) {
    problems.push(`${where}: ${check.field} is ${value}, expected at least ${check.min}`);
  }
}

/** Every node that carries a status is a test; the page depends on that shape. */
function leaves(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node.children) && node.children.length) {
    node.children.forEach((child) => leaves(child, out));
  } else if (node.status) {
    out.push(node);
  }
  return out;
}

function runCheck(document, check, where) {
  if (check.field) return checkField(document, check, where);

  if (check.kind === "suiteNames") {
    const found = (document.children || []).map((child) => child.name);
    check.expect.forEach((name) => {
      if (!found.includes(name)) {
        problems.push(`${where}: suite "${name}" is gone, top level holds [${found.join(", ")}]`);
      }
    });
    /* Exactness matters as much as presence here, and it is easy to miss. If a
       suite is added to this report, the page counts its tests into the totals
       and replays them: the same case arriving under a second parent suite
       would double the number a visitor reads, and nothing would look broken.
       A contract that only checks what must exist does not catch that. */
    if (check.exact) {
      found
        .filter((name) => !check.expect.includes(name))
        .forEach((name) => {
          problems.push(
            `${where}: unexpected top level suite "${name}". The page counts every suite in this ` +
              `report into its totals, so a new one silently inflates them.`,
          );
        });
    }
    return;
  }

  /* The engine a result ran on is written twice by the suite: once as the name
     of the branch it sits under, once as a parameter on the result. The page
     relies on that, because it is how a branch that is an engine is told apart
     from a branch that is an area, and reading the tree position instead would
     break the moment a display grouping is reorganised.
     The check is about consistency rather than presence: a parent whose
     branches are areas carries no such parameter and is fine, a parent whose
     branches are engines must carry it on every result. What must never happen
     is half and half, because then the page reads the same tree two ways. */
  if (check.kind === "branchEngine") {
    (document.children || [])
      .filter((parent) => !check.under || parent.name === check.under)
      .forEach((parent) => {
        (parent.children || []).forEach((branch) => {
          const tests = leaves(branch);
          if (!tests.length) return;
          const matching = tests.filter((test) => (test.parameters || []).includes(branch.name));
          if (matching.length && matching.length !== tests.length) {
            problems.push(
              `${where}: branch "${branch.name}" under "${parent.name}" carries its own name as a ` +
                `parameter on ${matching.length} of ${tests.length} results. It has to be all or none, ` +
                `or the page cannot tell an engine from an area.`,
            );
          }
        });
      });
    return;
  }

  if (check.kind === "leaves") {
    const found = leaves(document);
    if (found.length < (check.minCount ?? 1)) {
      problems.push(`${where}: found ${found.length} tests, expected at least ${check.minCount ?? 1}`);
      return;
    }
    const first = found[0];
    (check.require || []).forEach((field) => {
      if (pick(first, field) === undefined) {
        problems.push(`${where}: a test carries no ${field}`);
      }
    });
    return;
  }

  if (check.kind === "arrayOf") {
    if (!Array.isArray(document)) {
      problems.push(`${where}: expected an array, got ${typeof document}`);
      return;
    }
    if (document.length < (check.minLength ?? 1)) {
      problems.push(`${where}: array holds ${document.length} entries, expected at least ${check.minLength ?? 1}`);
      return;
    }
    (check.each || []).forEach((inner) => checkField(document[0], inner, where));
    return;
  }

  problems.push(`${where}: the contract asks for an unknown check "${check.kind}"`);
}

console.log(`Contract ${contract.name} v${contract.version}`);
console.log(`Reading ${base}\n`);

for (const document of contract.documents) {
  let payload;
  try {
    payload = await load(document.path);
  } catch (error) {
    const line = `${document.path}: ${error.message}`;
    if (document.required) problems.push(line);
    else notes.push(`${line} (optional, the page hides ${document.usedFor})`);
    console.log(`${document.required ? "REQUIRED" : "optional"}  ${document.path}  unreachable`);
    continue;
  }
  const before = problems.length;
  document.checks.forEach((check) => runCheck(payload, check, document.path));
  const ok = problems.length === before;
  console.log(`${document.required ? "REQUIRED" : "optional"}  ${document.path}  ${ok ? "ok" : "FAILED"}`);
}

/* the links are not read, only offered to a visitor, so a dead one is still
   worth knowing about: a 404 on the portfolio reads as neglect */
if (isUrl) {
  for (const link of contract.links || []) {
    const url = new URL(link.path, base.endsWith("/") ? base : base + "/");
    let status = 0;
    try {
      status = (await fetch(url, { method: "GET" })).status;
    } catch {
      status = 0;
    }
    const ok = status === 200;
    if (!ok) problems.push(`link ${link.path || "/"}: answered ${status || "nothing"}`);
    console.log(`link      ${link.path || "/"}  ${ok ? "ok" : "FAILED"}`);
  }
}

console.log("");
notes.forEach((note) => console.log(`note: ${note}`));

if (problems.length) {
  console.error(`\nThe report no longer satisfies the contract:\n`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  console.error(
    `\nThe page at ${contract.consumer} reads these documents at runtime.\n` +
      `Either the report moved, in which case the page needs updating, or the\n` +
      `change was unintended, in which case the report needs fixing.`,
  );
  process.exit(1);
}

console.log("The report satisfies the contract.");
