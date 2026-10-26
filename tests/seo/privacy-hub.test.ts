import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { getAllToolsByCategory, getToolById } from "../../src/lib/tools";
import { PRIVACY_HUB_GROUPS } from "../../src/data/privacy-hub-groups";

// Before this round the privacy-tools category (23 tools) had no hub
// page: StructuredData listed it as hub-less, so every privacy tool
// page rendered a name-only category breadcrumb, and there was no
// listing page at /privacy-tools at all. The hub page, the JSON-LD
// map entry and the sitemap listings below pin that repair; the
// group-coverage test fails closed (union length must equal the
// registry count, not merely be a subset) so a dropped tool fails.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

describe("Privacy tools hub", () => {
	it("the registry category holds exactly 23 tools", () => {
		const tools = getAllToolsByCategory("privacy-tools");
		expect(tools.length).toBe(23);
	});

	it("the hub groups cover every privacy tool exactly once", () => {
		const tools = getAllToolsByCategory("privacy-tools");
		const grouped = PRIVACY_HUB_GROUPS.flatMap((group) => group.toolIds);
		expect(grouped.length).toBe(23);
		expect(new Set(grouped).size).toBe(23);
		expect(new Set(grouped)).toEqual(new Set(tools.map((tool) => tool.id)));
	});

	it("every grouped id resolves to a tool with a route", () => {
		for (const group of PRIVACY_HUB_GROUPS) {
			for (const id of group.toolIds) {
				const tool = getToolById(id);
				expect(tool).toBeDefined();
				expect(tool!.route.startsWith("/")).toBe(true);
			}
		}
	});

	it("the JSON-LD hub map points privacy-tools at the real hub page", () => {
		const source = readSource(
			"src/components/shared/StructuredData.tsx",
		);
		expect(source).toContain('"privacy-tools": "/privacy-tools"');
		// The hub-less set must no longer claim this category, or the
		// map entry above would never be reached.
		const noHub = source.match(
			/NO_HUB_CATEGORY_SLUGS[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/,
		);
		expect(noHub).not.toBeNull();
		expect(noHub![1]).not.toContain("privacy-tools");
	});

	it("the hub page exists and its literal metadata is in band", () => {
		const pagePath = path.join(
			rootDir,
			"src/app/(privacy-tools)/privacy-tools/page.tsx",
		);
		expect(fs.existsSync(pagePath)).toBe(true);
		const source = readSource(
			"src/app/(privacy-tools)/privacy-tools/page.tsx",
		);
		const title = source.match(/^\ttitle: "([^"]+)"/m)?.[1];
		const description = source.match(
			/^\tdescription:\s*\n?\s*"([^"]+)"/m,
		)?.[1];
		expect(title).toBe("Free Privacy & Security Tools | SopKit");
		expect(title!.length).toBeLessThanOrEqual(60);
		expect(description!.length).toBeGreaterThanOrEqual(100);
		expect(description!.length).toBeLessThanOrEqual(160);
		expect(source).toContain("robots: { index: true, follow: true }");
		// The hub lists tools only; it must not claim blanket
		// client-side processing for tools that look up public data.
		expect(source).not.toContain("100% client-side");
	});

	it("both sitemaps list the hub", () => {
		expect(readSource("src/app/sitemap.ts")).toContain("/privacy-tools");
		expect(readSource("scripts/generate-sitemap.ts")).toContain(
			"'/privacy-tools'",
		);
	});
});
