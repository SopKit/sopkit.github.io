// Validates that every site URL the site itself hardcodes resolves to a
// real page and follows the site's slash-free canonical story, and fails
// loudly (non-zero exit) when any does not:
//
//   - Every literal `https://sopkit.space/<path>` in src must be
//     slash-free (except the root `/`) and must resolve to a static
//     page directory under src/app (route groups stripped), a registry
//     tool route, a sibling opportunity route, a file under public/, or
//     a documented non-page identifier (see NON_PAGE_IDENTIFIERS).
//     Hardcoded URLs bypass buildCanonicalUrl, so a trailing slash or a
//     dead route in share/copy text ships silently — the DevSpeed
//     share text shipped `https://sopkit.space/dev-speed/` (real page,
//     wrong form vs its own canonical) and the roast tool's copy text
//     shipped a route that exists nowhere at all.
//   - Every value in StructuredData's CATEGORY_HUB_ROUTES map must
//     resolve to a page directory: those values become JSON-LD
//     breadcrumb/category URLs on every tool page. And every registry
//     category slug must either be mapped there or listed in
//     NO_HUB_CATEGORY_SLUGS (categories with no hub page, whose
//     JSON-LD items carry a name and no URL). The old map was keyed by
//     bare names ("image", "pdf", ...) that never matched a slug like
//     "image-tools", so the `/${slug}-tools` fallback emitted dead
//     URLs such as /image-tools-tools on nearly every tool page.
//
// What is deliberately NOT checked, and why:
//   - Template URLs containing `${...}` (dynamic routes such as
//     packages/[slug], tool-guides/[slug], image-converter/[slug],
//     embed-tool/?id=, and the intent page's `/${slug}`): the static
//     prefix page exists as a [slug] directory, and the instance is
//     only known at runtime.
//   - Comment lines (trimmed line starts with `//` or `*`): the
//     sitemap.ts `/slug` placeholder lives in a comment, not a link.
//   - VisitorBadge's trailing-slash target: its literal is only the
//     root URL; the slashed form is built by template and is the key
//     sent to visitorbadge.io (a third-party counter), not a link to a
//     SopKit page — changing it would split existing per-path counts,
//     so it is out of scope by design (see the 2026-10-26 20:37 audit).
//   - window.location.href sharing (SocialShareButtons, UserComments):
//     a runtime URL, not a hardcoded string; the canonical link tag is
//     what search engines use.
//
// This script is intentionally import-free (fs + regex, mirroring
// validate-blog-tool-routes.ts). The bun test in
// tests/seo/site-urls.test.ts covers the same invariants through this
// function plus the specific repaired strings.
//
// Run: bun run validate:site-urls (also wired into `prebuild`, after
// validate:seo-opportunities and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export interface SiteUrlResult {
	checked: number;
	hubRoutes: number;
	categories: number;
	violations: string[];
}

// Identifiers that look like site paths but are not links to SopKit
// pages. Each entry must carry its reason; anything not listed here
// and not resolving to a real page is a violation.
const NON_PAGE_IDENTIFIERS = new Map<string, string>([
	[
		"/bot",
		"bot User-Agent identifier in src/app/_api/visual-sitemap/route.ts, not a link",
	],
]);

function collectFiles(dir: string, extension: string, out: string[]): void {
	if (!fs.existsSync(dir)) return;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			collectFiles(full, extension, out);
		} else if (entry.isFile() && full.endsWith(extension)) {
			out.push(full);
		}
	}
}

function collectPageRoutes(appDir: string): Set<string> {
	const routes = new Set<string>();
	const walk = (dir: string, segments: string[], inDynamic: boolean): void => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
				walk(path.join(dir, entry.name), segments, inDynamic);
			} else if (entry.name.startsWith("[") && entry.name.endsWith("]")) {
				walk(path.join(dir, entry.name), segments, true);
			} else {
				walk(
					path.join(dir, entry.name),
					[...segments, entry.name],
					inDynamic,
				);
			}
		}
		if (!inDynamic && fs.existsSync(path.join(dir, "page.tsx"))) {
			routes.add(`/${segments.join("/")}`);
		}
	};
	walk(appDir, [], false);
	return routes;
}

export function findSiteUrlIssues(root: string): SiteUrlResult {
	const violations: string[] = [];
	let checked = 0;

	const toolsJson = JSON.parse(
		fs.readFileSync(path.join(root, "src", "constants", "tools.json"), "utf8"),
	) as unknown;
	const toolRoutes = new Set<string>();
	const collectTools = (node: unknown): void => {
		if (Array.isArray(node)) {
			for (const item of node) collectTools(item);
			return;
		}
		if (node && typeof node === "object") {
			const item = node as { route?: unknown };
			if (typeof item.route === "string") toolRoutes.add(item.route);
			for (const value of Object.values(node)) collectTools(value);
		}
	};
	collectTools(toolsJson);

	const opportunitiesSource = fs.readFileSync(
		path.join(root, "src", "data", "seo-opportunities.ts"),
		"utf8",
	);
	const opportunityRoutes = new Set<string>();
	const entryPattern =
		/slug:\s*"([^"]+)"[\s\S]*?parentToolSlug:\s*"([^"]+)"[\s\S]*?parentToolRoute:\s*"([^"]+)"/g;
	for (const match of opportunitiesSource.matchAll(entryPattern)) {
		opportunityRoutes.add(`/${match[1]}`);
	}

	const publicFiles = new Set<string>();
	const collectPublic = (dir: string, prefix: string): void => {
		if (!fs.existsSync(dir)) return;
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				collectPublic(full, `${prefix}/${entry.name}`);
			} else if (entry.isFile()) {
				publicFiles.add(`${prefix}/${entry.name}`);
			}
		}
	};
	collectPublic(path.join(root, "public"), "");

	const pageRoutes = collectPageRoutes(path.join(root, "src", "app"));

	const resolves = (route: string): boolean =>
		pageRoutes.has(route) ||
		toolRoutes.has(route) ||
		opportunityRoutes.has(route) ||
		publicFiles.has(route) ||
		NON_PAGE_IDENTIFIERS.has(route);

	// Literal absolute site URLs across src.
	const srcFiles: string[] = [];
	collectFiles(path.join(root, "src"), ".ts", srcFiles);
	collectFiles(path.join(root, "src"), ".tsx", srcFiles);
	const urlPattern = /https:\/\/sopkit\.space([^\s"'`)\]}]*)/g;
	for (const file of srcFiles) {
		const relative = path.relative(root, file);
		const lines = fs.readFileSync(file, "utf8").split("\n");
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
			for (const match of line.matchAll(urlPattern)) {
				// Cut at the first backslash: escaped sequences in
				// sample strings (\\n, \") are not part of the URL.
				let raw = match[1].split("\\")[0];
				if (raw.includes("${")) continue; // dynamic URL, see header
				// Strip query and fragment: resolution is by path.
				raw = raw.split("?")[0].split("#")[0];
				if (raw === "" || raw === "/") {
					checked += 1;
					continue; // root URL, allowed with its slash
				}
				checked += 1;
				if (raw.endsWith("/")) {
					violations.push(
						`${relative} hardcodes trailing-slash site URL https://sopkit.space${raw}; canonical SopKit URLs carry no trailing slash`,
					);
				}
				const route = raw.endsWith("/") ? raw.slice(0, -1) : raw;
				if (!resolves(route)) {
					violations.push(
						`${relative} hardcodes site URL https://sopkit.space${raw}, which resolves to no page, tool route, opportunity route, or public file`,
					);
				}
			}
		}
	}

	// StructuredData JSON-LD hub map + registry category fallback.
	const structuredData = fs.readFileSync(
		path.join(root, "src", "components", "shared", "StructuredData.tsx"),
		"utf8",
	);
	const mapMatch = structuredData.match(
		/CATEGORY_HUB_ROUTES[^=]*=\s*\{([\s\S]*?)\};/,
	);
	if (!mapMatch) {
		violations.push(
			"StructuredData.tsx CATEGORY_HUB_ROUTES map not found; cannot verify JSON-LD hub URLs",
		);
		return { checked, hubRoutes: 0, categories: 0, violations };
	}
	const hubRoutes = new Map<string, string>();
	for (const match of mapMatch[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
		hubRoutes.set(match[1], match[2]);
	}
	if (hubRoutes.size === 0) {
		violations.push(
			"StructuredData.tsx CATEGORY_HUB_ROUTES map parsed empty; cannot verify JSON-LD hub URLs",
		);
	}
	for (const [category, route] of hubRoutes) {
		if (!pageRoutes.has(route)) {
			violations.push(
				`StructuredData CATEGORY_HUB_ROUTES[${category}] = ${route} resolves to no page directory, but it is emitted as a JSON-LD category URL`,
			);
		}
	}

	// Registry slugs, and the documented hub-less set. Every registry
	// slug must be either mapped above or listed here; anything else
	// fails closed instead of silently emitting a dead URL (the old
	// `/${slug}-tools` fallback) or no URL at all.
	const noHubMatch = structuredData.match(
		/NO_HUB_CATEGORY_SLUGS[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/,
	);
	const noHubSlugs = new Set<string>();
	if (noHubMatch) {
		for (const match of noHubMatch[1].matchAll(/"([^"]+)"/g)) {
			noHubSlugs.add(match[1]);
		}
	} else {
		violations.push(
			"StructuredData.tsx NO_HUB_CATEGORY_SLUGS set not found; cannot verify hub-less categories",
		);
	}

	const categories = (toolsJson as { categories?: Record<string, { slug?: string }> })
		.categories ?? {};
	const registrySlugs = new Set<string>();
	for (const [key, category] of Object.entries(categories)) {
		registrySlugs.add(
			typeof category?.slug === "string" ? category.slug : key,
		);
	}
	for (const key of hubRoutes.keys()) {
		if (!registrySlugs.has(key)) {
			violations.push(
				`StructuredData CATEGORY_HUB_ROUTES has key ${key}, which is not a registry category slug (stale mapping; hub keys are slugs, not bare names)`,
			);
		}
	}
	for (const slug of noHubSlugs) {
		if (!registrySlugs.has(slug)) {
			violations.push(
				`StructuredData NO_HUB_CATEGORY_SLUGS lists ${slug}, which is not a registry category slug (stale entry)`,
			);
		}
	}
	for (const slug of registrySlugs) {
		if (!hubRoutes.has(slug) && !noHubSlugs.has(slug)) {
			violations.push(
				`registry category ${slug} is neither mapped in CATEGORY_HUB_ROUTES nor listed in NO_HUB_CATEGORY_SLUGS; getCategoryHubUrl would emit no category URL for it`,
			);
		}
	}

	return {
		checked,
		hubRoutes: hubRoutes.size,
		categories: registrySlugs.size,
		violations,
	};
}

const invokedAsScript =
	process.argv[1] !== undefined &&
	path.resolve(process.argv[1]) === path.resolve(__filename);

if (invokedAsScript) {
	const result = findSiteUrlIssues(rootDir);
	if (result.violations.length > 0) {
		console.error(
			`validate-site-urls: FAILED with ${result.violations.length} violation(s):`,
		);
		for (const violation of result.violations) {
			console.error(`  - ${violation}`);
		}
		process.exit(1);
	}
	console.log(
		`validate-site-urls: OK (${result.checked} literal site URLs, ${result.hubRoutes} JSON-LD hub routes, ${result.categories} registry categories, 0 violations)`,
	);
}
