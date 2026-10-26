// Validates that every reference in src/data/seo-opportunities.ts resolves
// to a real page, and fails loudly (non-zero exit, no partial output) when
// any does not:
//
//   - Every parentToolSlug must be a registry tool id in
//     src/constants/tools.json, and every parentToolRoute must equal that
//     tool's registry route (strict equality, not mere route membership).
//     The OpenAI copy-paste case is why: eight entries declared parent
//     route "/openai-api-key-tester", which is a real opportunity route
//     but not a tool route, so the intent page's related-tools filter
//     matched nothing and the parent card never rendered — while the
//     article line named the OpenAI tool for Claude/Gemini/Cohere/
//     Stability/Hugging Face/Mailgun/Postmark pages.
//   - Every relatedSlug must resolve to a registry tool id, a registry
//     tool route, a tool extraSlug (src/data/tool-extraslugs.json), or a
//     sibling opportunity slug. Anything else (hub names like
//     "student-calculators", invented slugs like
//     "engineering-sgpa-calculator") is silently dropped by the related
//     filter today, so it is a dead reference, not a link.
//   - No duplicate opportunity slugs, and every opportunity route must
//     equal "/" + slug (the intent page and sitemap both assume this).
//
// Why this exists: the intent page builds its "Parent tool" article line
// from getToolById(parentToolSlug) and its related cards from
// parentToolRoute/relatedSlugs through a filter, so a bad reference fails
// silently — a fallback sentence or a missing card, with no warning.
// The sibling-opportunity and extraSlug allowances match what
// relatedToolsForOpportunity (src/lib/seo-opportunity-related.ts) renders:
// tool matches first, then extraSlug tools, then sibling opportunity
// cards.
//
// Scope limits, stated plainly:
//   - Only seo-opportunities.ts is checked here. Intent landers in
//     src/lib/intent-data.ts use parentToolId, not these fields, and are
//     not covered; categoryHub breadcrumb URLs are not validated either.
//   - This script is intentionally import-free (fs + regex, mirroring
//     validate-blog-tool-routes.ts): it checks the committed source text
//     directly instead of depending on module resolution or tsconfig path
//     aliases. The bun test in tests/seo/seo-opportunities.test.ts covers
//     the same invariants through the real modules.
//   - Entry parsing assumes each object literal lists slug, then
//     parentToolSlug, then parentToolRoute, then a single-line
//     relatedSlugs array, in that order — the shape all 148 entries use.
//     The script fails if the entry and relatedSlugs counts disagree,
//     rather than silently zipping mismatched lists.
//
// Run: bun run validate:seo-opportunities (also wired into `prebuild`,
// after validate-comment-actions and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const toolsJsonPath = path.join(rootDir, "src", "constants", "tools.json");
const extraslugsJsonPath = path.join(
	rootDir,
	"src",
	"data",
	"tool-extraslugs.json",
);
const opportunitiesPath = path.join(
	rootDir,
	"src",
	"data",
	"seo-opportunities.ts",
);

interface ToolItem {
	id?: string;
	route?: string;
}

const toolsJson = JSON.parse(
	fs.readFileSync(toolsJsonPath, "utf8"),
) as unknown;
const extraslugsJson = JSON.parse(
	fs.readFileSync(extraslugsJsonPath, "utf8"),
) as Record<string, unknown>;

const toolById = new Map<string, string>();
const toolRoutes = new Set<string>();
const collectTools = (node: unknown): void => {
	if (Array.isArray(node)) {
		for (const item of node) collectTools(item);
		return;
	}
	if (node && typeof node === "object") {
		const item = node as ToolItem;
		if (typeof item.id === "string" && typeof item.route === "string") {
			toolById.set(item.id, item.route);
			toolRoutes.add(item.route);
		}
		for (const value of Object.values(node)) collectTools(value);
	}
};
collectTools(toolsJson);

const extraSlugs = new Set<string>();
for (const value of Object.values(extraslugsJson)) {
	if (Array.isArray(value)) {
		for (const slug of value) {
			if (typeof slug === "string") extraSlugs.add(slug);
		}
	}
}

const source = fs.readFileSync(opportunitiesPath, "utf8");

// Entry fields in file order: slug, then parentToolSlug, then parentToolRoute.
const entryPattern =
	/slug:\s*"([^"]+)"[\s\S]*?parentToolSlug:\s*"([^"]+)"[\s\S]*?parentToolRoute:\s*"([^"]+)"/g;
const entries: Array<{ slug: string; parentId: string; parentRoute: string }> =
	[];
for (const match of source.matchAll(entryPattern)) {
	entries.push({
		slug: match[1],
		parentId: match[2],
		parentRoute: match[3],
	});
}

const relatedPattern = /relatedSlugs:\s*\[([^\]]*)\]/g;
const relatedLists: string[][] = [];
for (const match of source.matchAll(relatedPattern)) {
	relatedLists.push(
		[...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]),
	);
}

const violations: string[] = [];

if (entries.length === 0) {
	violations.push("no seo-opportunity entries parsed from seo-opportunities.ts");
}
if (entries.length !== relatedLists.length) {
	violations.push(
		`parsed ${entries.length} entries but ${relatedLists.length} relatedSlugs arrays; refusing to zip mismatched lists`,
	);
}

const opportunitySlugs = new Set(entries.map((entry) => entry.slug));
if (opportunitySlugs.size !== entries.length) {
	const seen = new Set<string>();
	for (const entry of entries) {
		if (seen.has(entry.slug)) {
			violations.push(`duplicate opportunity slug: ${entry.slug}`);
		}
		seen.add(entry.slug);
	}
}

const routePattern = /slug:\s*"([^"]+)"[\s\S]*?route:\s*"([^"]+)"/g;
for (const match of source.matchAll(routePattern)) {
	if (match[2] !== `/${match[1]}`) {
		violations.push(
			`opportunity ${match[1]} has route ${match[2]}, expected /${match[1]}`,
		);
	}
}

let relatedChecked = 0;
entries.forEach((entry, index) => {
	const expectedRoute = toolById.get(entry.parentId);
	if (expectedRoute === undefined) {
		violations.push(
			`opportunity ${entry.slug} has parentToolSlug ${entry.parentId}, which is not a registry tool id`,
		);
	} else if (expectedRoute !== entry.parentRoute) {
		violations.push(
			`opportunity ${entry.slug} declares parentToolRoute ${entry.parentRoute} for parent ${entry.parentId}, whose registry route is ${expectedRoute}`,
		);
	}

	const related = relatedLists[index] ?? [];
	for (const slug of related) {
		relatedChecked += 1;
		const resolves =
			toolById.has(slug) ||
			toolRoutes.has(`/${slug}`) ||
			extraSlugs.has(slug) ||
			opportunitySlugs.has(slug);
		if (!resolves) {
			violations.push(
				`opportunity ${entry.slug} has relatedSlug ${slug}, which resolves to no tool, extraSlug, or sibling opportunity`,
			);
		}
	}
});

if (violations.length > 0) {
	console.error(
		`validate-seo-opportunities: FAILED with ${violations.length} violation(s):`,
	);
	for (const violation of violations) console.error(`  - ${violation}`);
	process.exit(1);
}

console.log(
	`validate-seo-opportunities: OK (${entries.length} opportunities, ${toolById.size} registry tools, ${relatedChecked} relatedSlugs, 0 violations)`,
);
