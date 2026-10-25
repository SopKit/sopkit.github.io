// Validates src/data/tool-lastmod.json against the live registry. This check
// is deliberately git-free so it is safe to run in prebuild and at deploy
// time: it proves coverage and date validity, NOT freshness against git
// history. Freshness is the generator's job (scripts/generate-tool-lastmod.ts)
// and must be re-run as part of any commit that changes tool pages.
//
// Checks (all failures are fatal, non-zero exit):
//   1. generated.commit is a 40-hex git SHA.
//   2. lastmod keys are exactly the registry's tool routes — no missing
//      tool, no stale route, no duplicate (JSON keys cannot duplicate, but
//      a route listed twice in the registry would surface as a count
//      mismatch here).
//   3. Every date is a real calendar date in YYYY-MM-DD form.
//   4. No date is in the future, allowing one day of timezone tolerance
//      (git author dates are local to the committer; the check runs in UTC).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const failures: string[] = [];
function check(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

let registry: any;
let lastmodFile: any;
try {
  registry = JSON.parse(fs.readFileSync(path.join(rootDir, "src", "constants", "tools.json"), "utf8"));
} catch (error) {
  failures.push(`cannot read tools.json: ${(error as Error).message}`);
}
try {
  lastmodFile = JSON.parse(fs.readFileSync(path.join(rootDir, "src", "data", "tool-lastmod.json"), "utf8"));
} catch (error) {
  failures.push(`cannot read tool-lastmod.json: ${(error as Error).message}`);
}

if (registry && lastmodFile) {
  check(/^[0-9a-f]{40}$/.test(lastmodFile?.generated?.commit ?? ""), "generated.commit is not a 40-hex SHA");

  const registryRoutes: string[] = [];
  for (const category of Object.values(registry.categories || {}) as any[]) {
    if (!category || !Array.isArray(category.tools)) continue;
    for (const tool of category.tools) registryRoutes.push(tool.route);
  }
  const lastmod = lastmodFile.lastmod ?? {};
  const lastmodRoutes = Object.keys(lastmod);
  const registrySet = new Set(registryRoutes);
  const lastmodSet = new Set(lastmodRoutes);
  const missing = registryRoutes.filter((r) => !lastmodSet.has(r));
  const extra = lastmodRoutes.filter((r) => !registrySet.has(r));
  check(registryRoutes.length === lastmodRoutes.length, `route count mismatch: registry ${registryRoutes.length}, tool-lastmod ${lastmodRoutes.length}`);
  check(missing.length === 0, `missing lastmod for ${missing.length} route(s): ${missing.slice(0, 10).join(", ")}`);
  check(extra.length === 0, `stale lastmod for ${extra.length} route(s): ${extra.slice(0, 10).join(", ")}`);

  const tomorrowUtc = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const badDates: string[] = [];
  for (const [route, date] of Object.entries(lastmod)) {
    const valid =
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(new Date(`${date}T00:00:00Z`).getTime()) &&
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date &&
      date <= tomorrowUtc;
    if (!valid) badDates.push(`${route}=${date}`);
  }
  check(badDates.length === 0, `invalid or future lastmod date(s): ${badDates.slice(0, 10).join(", ")}`);
}

if (failures.length > 0) {
  console.error("validate-tool-lastmod: FAILED");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `validate-tool-lastmod: OK (${Object.keys(lastmodFile.lastmod).length} routes, ` +
    `${new Set(Object.values(lastmodFile.lastmod)).size} distinct dates, generated from ${String(lastmodFile.generated.commit).slice(0, 12)})`,
);
