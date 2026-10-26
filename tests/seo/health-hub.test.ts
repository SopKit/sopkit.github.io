import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { getAllToolsByCategory, getToolById } from "../../src/lib/tools";
import { HEALTH_HUB_GROUPS } from "../../src/data/health-hub-groups";

// Before this round the health category (5 calculators) had no hub
// page: StructuredData listed it as hub-less, so every health tool
// page rendered a name-only category breadcrumb, and there was no
// listing page at /health at all. Built in the same commit as the
// privacy-tools hub, following the same pattern. The group-coverage
// test fails closed (union length must equal the registry count).

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

describe("Health tools hub", () => {
	it("the registry category holds exactly 5 tools", () => {
		const tools = getAllToolsByCategory("health");
		expect(tools.length).toBe(5);
	});

	it("the hub groups cover every health tool exactly once", () => {
		const tools = getAllToolsByCategory("health");
		const grouped = HEALTH_HUB_GROUPS.flatMap((group) => group.toolIds);
		expect(grouped.length).toBe(5);
		expect(new Set(grouped).size).toBe(5);
		expect(new Set(grouped)).toEqual(new Set(tools.map((tool) => tool.id)));
	});

	it("every grouped id resolves to a tool with a route", () => {
		for (const group of HEALTH_HUB_GROUPS) {
			for (const id of group.toolIds) {
				const tool = getToolById(id);
				expect(tool).toBeDefined();
				expect(tool!.route.startsWith("/")).toBe(true);
			}
		}
	});

	it("the JSON-LD hub map points health at the real hub page", () => {
		const source = readSource(
			"src/components/shared/StructuredData.tsx",
		);
		expect(source).toContain('"health": "/health"');
		const noHub = source.match(
			/NO_HUB_CATEGORY_SLUGS[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/,
		);
		expect(noHub).not.toBeNull();
		expect(noHub![1]).not.toContain("health");
	});

	it("the hub page exists and its literal metadata is in band", () => {
		const pagePath = path.join(
			rootDir,
			"src/app/(health)/health/page.tsx",
		);
		expect(fs.existsSync(pagePath)).toBe(true);
		const source = readSource("src/app/(health)/health/page.tsx");
		const title = source.match(/^\ttitle: "([^"]+)"/m)?.[1];
		const description = source.match(
			/^\tdescription:\s*\n?\s*"([^"]+)"/m,
		)?.[1];
		expect(title).toBe("Free Health & Fitness Calculators | SopKit");
		expect(title!.length).toBeLessThanOrEqual(60);
		expect(description!.length).toBeGreaterThanOrEqual(100);
		expect(description!.length).toBeLessThanOrEqual(160);
		expect(source).toContain("robots: { index: true, follow: true }");
		// The hub gives estimates, not advice: it must not claim the
		// calculators are medical guidance.
		expect(source).toContain("not medical advice");
	});

	it("both sitemaps list the hub", () => {
		expect(readSource("src/app/sitemap.ts")).toContain("/health");
		expect(readSource("scripts/generate-sitemap.ts")).toContain(
			"'/health'",
		);
	});
});
