import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { findSiteUrlIssues } from "../../scripts/validate-site-urls";

// The site hardcodes its own URLs in places that bypass
// buildCanonicalUrl — share/copy text, JSON-LD hub links — so a
// trailing slash or a dead route ships silently. Before the guard
// existed it shipped: a DevSpeed share text pointing at
// https://sopkit.space/dev-speed/ (real page, wrong form vs its own
// canonical), a roast-tool copy text pointing at a route that exists
// nowhere, and a JSON-LD category-hub map keyed by bare names
// ("image", "pdf", ...) that never matched a registry slug like
// "image-tools", so nearly every tool page's BreadcrumbList pointed
// at a dead /<slug>-tools URL. The prebuild script
// scripts/validate-site-urls.ts enforces the same invariants on the
// committed source text; these tests pin it through that same
// function plus the specific repairs.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

describe("Hardcoded site URLs resolve and are slash-free", () => {
	it("the validator finds no violations, over a non-trivial set", () => {
		const result = findSiteUrlIssues(rootDir);
		// Guards against a vacuous pass: the tree carries literal site
		// URLs, a 16-entry JSON-LD hub map, and 20 registry categories.
		expect(result.checked).toBeGreaterThanOrEqual(10);
		expect(result.hubRoutes).toBeGreaterThanOrEqual(10);
		expect(result.categories).toBeGreaterThanOrEqual(10);
		expect(result.violations).toEqual([]);
	});

	it("the DevSpeed share text uses the canonical slash-free URL", () => {
		const source = readSource(
			"src/components/features/DevSpeedChallenge.tsx",
		);
		expect(source).toContain("https://sopkit.space/dev-speed");
		expect(source).not.toContain("https://sopkit.space/dev-speed/");
	});

	it("the roast copy text claims no dead route", () => {
		const source = readSource(
			"src/components/tools/generators/ProductivityRoastGeneratorTool.tsx",
		);
		// The component is unmounted and unregistered, so no URL it
		// names may be a route that does not exist; the text now names
		// no route at all rather than inventing one. (The bare
		// analytics event slug "productivity-roast-generator" remains
		// in trackToolExecution — that is an event name, not a URL.)
		expect(source).not.toContain(
			"sopkit.space/productivity-roast-generator",
		);
	});

	it("the JSON-LD hub map is keyed by registry slugs, not bare names", () => {
		const source = readSource(
			"src/components/shared/StructuredData.tsx",
		);
		expect(source).toContain('"image-tools": "/image-tools"');
		expect(source).toContain('"utility-tools": "/other-tools"');
		expect(source).toContain('"guides": "/tool-guides"');
		// The old bare-name keys never matched a slug and fell through
		// to dead /<slug>-tools URLs.
		expect(source).not.toContain('image: "/image-tools"');
		expect(source).not.toContain('utilities: "/other-tools"');
		expect(source).not.toContain("getCategoryHubUrl(categorySlug) ||");
	});

	it("HowTo step URLs are never given a trailing slash", () => {
		const source = readSource(
			"src/components/shared/StructuredData.tsx",
		);
		expect(source).not.toContain("`${step.url}/`");
	});
});
