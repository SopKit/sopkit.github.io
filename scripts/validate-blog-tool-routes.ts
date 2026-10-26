// Validates that every tool reference in blog articles resolves to a real
// SopKit tool, and fails loudly (non-zero exit, no partial output) when any
// does not:
//
//   - Every `featuredToolRoutes` / `toolRoutes` entry in
//     src/constants/blog-data.ts must be a route in src/constants/tools.json.
//
// Why this exists: the blog article page maps each route through
// `getToolByRoute` and `.filter(Boolean)`, so a route that is not a registry
// tool route is silently dropped — the featured/section tool card simply
// never renders, with no warning, no log and no placeholder. Hub and
// directory routes (`/tools`, `/seo-tools`, `/calculators`) and invented
// routes (`/tax-calculator`) all failed this way before this validator
// existed: 13 occurrences across 7 articles rendered no tool card at all.
//
// Scope limits, stated plainly:
//   - Only blog-data.ts is checked here. Curated content pages
//     (src/constants/content-pages.ts) use the same field names but are
//     currently an empty array; if they gain entries, extend this script
//     rather than assuming they are covered.
//   - This script is intentionally import-free (fs + regex, mirroring
//     validate-registry.ts): it checks the committed source text directly
//     instead of depending on module resolution or tsconfig path aliases.
//     The bun test in tests/seo/blog-tool-routes.test.ts covers the same
//     invariant through the real modules (`blogs` + `getToolByRoute`).
//
// Run: bun run validate:blog-tool-routes (also wired into `prebuild`,
// after validate-page-metadata and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const toolsJsonPath = path.join(rootDir, "src", "constants", "tools.json");
const blogDataPath = path.join(rootDir, "src", "constants", "blog-data.ts");

interface ToolItem {
  route: string;
}

interface CategoryItem {
  tools: ToolItem[];
}

interface ToolsRegistry {
  categories: Record<string, CategoryItem>;
}

function fail(message: string): never {
  console.error(`\u274c ${message}`);
  process.exit(1);
}

if (!fs.existsSync(toolsJsonPath)) {
  fail(`tools.json not found: ${toolsJsonPath}`);
}

if (!fs.existsSync(blogDataPath)) {
  fail(`blog-data.ts not found: ${blogDataPath}`);
}

let registry: ToolsRegistry;
try {
  registry = JSON.parse(fs.readFileSync(toolsJsonPath, "utf8"));
} catch (e) {
  fail(`tools.json is not valid JSON: ${(e as Error).message}`);
}

const registryRoutes = new Set<string>();
for (const category of Object.values(registry.categories || {})) {
  for (const tool of category?.tools || []) {
    if (tool?.route) registryRoutes.add(tool.route);
  }
}

if (registryRoutes.size === 0) {
  fail("tools.json contains no tool routes; refusing to validate against an empty set");
}

const blogSource = fs.readFileSync(blogDataPath, "utf8");

// Article slugs, in file order. The interface line (`slug: string;`) carries
// no quoted value and therefore cannot match this pattern.
const slugPattern = /"?slug"?\s*:\s*"([^"]+)"/g;
const slugPositions: Array<{ position: number; slug: string }> = [];
for (const match of blogSource.matchAll(slugPattern)) {
  slugPositions.push({ position: match.index ?? 0, slug: match[1] });
}

if (slugPositions.length === 0) {
  fail("blog-data.ts contains no article slugs; refusing to validate an empty set");
}

function slugFor(position: number): string {
  let current = "(unknown article)";
  for (const entry of slugPositions) {
    if (entry.position <= position) {
      current = entry.slug;
    } else {
      break;
    }
  }
  return current;
}

// One pattern covers both field spellings (`featuredToolRoutes` and
// `toolRoutes`, quoted or unquoted keys) without double-counting the
// featured arrays: the alternation matches the full field name at once.
const routesPattern = /"?(?:featuredTool|tool)Routes"?\s*:\s*\[([^\]]*)\]/g;
const routeStringPattern = /"(\/[^"]+)"/g;

const failures: string[] = [];
let checkedEntries = 0;
let checkedArrays = 0;

for (const match of blogSource.matchAll(routesPattern)) {
  checkedArrays += 1;
  const articleSlug = slugFor(match.index ?? 0);
  const body = match[1] ?? "";
  for (const routeMatch of body.matchAll(routeStringPattern)) {
    checkedEntries += 1;
    const route = routeMatch[1];
    if (!registryRoutes.has(route)) {
      failures.push(
        `${articleSlug}: tool route "${route}" is not a registry tool route ` +
          `(hub/directory routes and invented routes render no tool card)`,
      );
    }
  }
}

if (checkedEntries === 0) {
  fail("blog-data.ts contains no tool route entries; refusing to pass vacuously");
}

if (failures.length > 0) {
  console.error(
    `\u274c validate-blog-tool-routes: ${failures.length} unresolved tool route(s) ` +
      `across ${checkedEntries} checked entries (${checkedArrays} arrays, ${slugPositions.length} articles):`,
  );
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(
  `\u2705 validate-blog-tool-routes: all ${checkedEntries} tool route entries ` +
    `in ${checkedArrays} arrays across ${slugPositions.length} articles resolve ` +
    `to registry tool routes.`,
);
