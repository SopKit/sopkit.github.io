// Generates src/data/tool-lastmod.json: one honest lastmod date per registry
// tool, derived from version control — NOT from the build date and NOT
// invented.
//
// Method: for each tool in src/constants/tools.json, resolve its route to
// the page.tsx file that serves it (route groups such as (money) are
// stripped; a dynamic [slug] page serves every tool whose route matches
// it), then take the author date of the most recent commit touching that
// file (`git log -1 --format=%ad --date=short`). Tools served by the same
// dynamic page therefore share one date, which is correct: they are the
// same page.
//
// Why this is honest and why it is still an approximation, stated plainly:
//   - It corrects the previous behaviour (every tool stamped with the single
//     site-wide date 2026-09-21), which overstated freshness for tools
//     untouched since 2026-07-16 and understated it for tools changed
//     since.
//   - It does NOT capture registry-only metadata edits (a title or
//     description change in tools.json touches no page file), and a bulk
//     formatting commit stamps every page it touches. Both limits are
//     inherent to file-history dating; the date is "last change to the
//     tool's page file", not "last change to anything about the tool".
//
// WHEN TO REGENERATE: after any commit that changes tool page files, run
//   bun run generate:tool-lastmod
// and commit the regenerated file together with the page change. The
// validator (scripts/validate-tool-lastmod.ts) checks coverage and date
// validity but cannot check freshness against git at deploy time, so a
// stale file fails silently in that one respect — regenerate it as part of
// the page-change commit, never as an afterthought.
//
// FAILS LOUDLY (non-zero exit, no file written) when: the working tree is
// not a git checkout, any tool route cannot be resolved to exactly one
// page file, any page file has no commit, or any derived date is invalid
// or in the future. Never write a partial file.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const toolsJsonPath = path.join(rootDir, "src", "constants", "tools.json");
const appDir = path.join(rootDir, "src", "app");
const outPath = path.join(rootDir, "src", "data", "tool-lastmod.json");

function fail(message: string): never {
  console.error(`generate-tool-lastmod: ERROR: ${message}`);
  process.exit(1);
}

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
  } catch (error) {
    fail(`git ${args.join(" ")} failed: ${(error as Error).message}`);
  }
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

// 1. Read the registry.
let registry: any;
try {
  registry = JSON.parse(fs.readFileSync(toolsJsonPath, "utf8"));
} catch (error) {
  fail(`cannot read ${toolsJsonPath}: ${(error as Error).message}`);
}
const tools: Array<{ id: string; route: string }> = [];
for (const [catKey, category] of Object.entries(registry.categories || {}) as any[]) {
  if (!category || !Array.isArray(category.tools)) continue;
  for (const tool of category.tools) {
    tools.push({ id: tool.id, route: tool.route });
  }
}
if (tools.length === 0) fail("registry contains no tools");

// 2. Map every src/app/**/page.tsx to its public route: strip group
// segments such as (money), keep [slug] parameters as-is.
const pageFiles: Array<{ routePattern: string; file: string }> = [];
function walk(dir: string): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === "page.tsx") {
      const rel = path.relative(appDir, full);
      const segments = rel.split(path.sep).slice(0, -1);
      const kept = segments.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
      pageFiles.push({ routePattern: `/${kept.join("/")}`, file: full });
    }
  }
}
walk(appDir);

// 3. Resolve each tool route: exact match wins; otherwise the single
// dynamic pattern whose [param] segments match. Ambiguity is an error.
function patternToRegex(pattern: string): RegExp {
  // Split on [param] tokens first, then escape only the literal parts: a
  // [param] segment matches exactly one path segment.
  const parts = pattern.split(/(\[[^\]]+\])/g).map((part) => {
    if (/^\[[^\]]+\]$/.test(part)) return "[^/]+";
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  return new RegExp(`^${parts.join("")}$`);
}
function resolveRoute(route: string): string {
  const exact = pageFiles.find((p) => p.routePattern === route);
  if (exact) return exact.file;
  const matches = pageFiles.filter((p) => p.routePattern.includes("[") && patternToRegex(p.routePattern).test(route));
  if (matches.length === 1) return matches[0].file;
  if (matches.length === 0) fail(`no page file serves tool route ${route}`);
  fail(`tool route ${route} matches multiple page files: ${matches.map((m) => m.file).join(", ")}`);
}

// 4. Derive one date per tool from its page file's history.
const headCommit = git(["rev-parse", "HEAD"]);
if (!/^[0-9a-f]{40}$/.test(headCommit)) fail(`unexpected HEAD commit: ${headCommit}`);
const todayUtc = new Date().toISOString().slice(0, 10);
const lastmod: Record<string, string> = {};
const fileDateCache = new Map<string, string>();
for (const tool of tools) {
  if (!tool.route || !tool.route.startsWith("/")) fail(`tool ${tool.id} has no usable route`);
  const file = resolveRoute(tool.route);
  let date = fileDateCache.get(file);
  if (!date) {
    date = git(["log", "-1", "--format=%ad", "--date=short", "--", path.relative(rootDir, file)]);
    if (!date) fail(`page file ${file} (tool ${tool.id}) has no commit`);
    if (!isValidDate(date)) fail(`page file ${file} produced invalid date ${date}`);
    if (date > todayUtc) fail(`page file ${file} produced future date ${date}`);
    fileDateCache.set(file, date);
  }
  lastmod[tool.route] = date;
}

const output = {
  generated: {
    commit: headCommit,
    method:
      "Author date of the most recent commit touching the tool's own page.tsx file (git log -1 --format=%ad --date=short); tools served by a dynamic [slug] page share that page's date. See scripts/generate-tool-lastmod.ts for the limits of this dating.",
    note: "Regenerate with `bun run generate:tool-lastmod` after any commit that changes tool pages, and commit the result with that change. Registry-only metadata edits do not move these dates.",
  },
  lastmod,
};

fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
const distinct = new Set(Object.values(lastmod)).size;
console.log(
  `generate-tool-lastmod: wrote ${Object.keys(lastmod).length} tool lastmod dates ` +
    `(${distinct} distinct dates, ${fileDateCache.size} page files) from commit ${headCommit.slice(0, 12)} to ${outPath}`,
);
