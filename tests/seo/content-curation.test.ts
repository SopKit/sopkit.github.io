import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { getCuratedContentIds, isCuratedContent } from "@/data/content-curation";
import { MANUAL_TOOL_CONTENT } from "@/data/generated-manual-content";
import { seoOpportunities } from "@/data/seo-opportunities";
import { getAllTools } from "@/lib/tools";

const JSON_PATH = path.join(process.cwd(), "src", "data", "content-uniqueness.json");

describe("Content curation gate (src/data/content-uniqueness.json)", () => {
	it("ships the audit output with the expected shape", () => {
		expect(fs.existsSync(JSON_PATH)).toBe(true);
		const report = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
		expect(typeof report.generated).toBe("string");
		expect(Number.isNaN(Date.parse(report.generated))).toBe(false);
		expect(report.threshold).toBe(0.4);
		expect(Array.isArray(report.curated)).toBe(true);
		expect(typeof report.stats).toBe("object");
	});

	it("curates a non-empty set that stays well below the full catalogue", () => {
		const curated = getCuratedContentIds();
		const total = Object.keys(MANUAL_TOOL_CONTENT).length + seoOpportunities.length;
		expect(curated.length).toBeGreaterThan(0);
		expect(curated.length).toBeLessThan(total);
	});

	it("resolves every curated id to a registry tool or an SEO opportunity", () => {
		const toolIds = new Set(getAllTools().map((tool) => tool.id));
		const opportunityIds = new Set(seoOpportunities.map((opportunity) => opportunity.slug));
		const orphans = getCuratedContentIds().filter(
			(id) => !toolIds.has(id) && !opportunityIds.has(id),
		);
		expect(orphans).toEqual([]);
	});

	it("only curates ids that satisfy the audit rule recorded in the JSON", () => {
		const report = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
		const minWords = report.minWords ?? 120;
		for (const id of report.curated as string[]) {
			const stats = report.stats[id];
			expect(stats).toBeDefined();
			expect(stats.shared).toBeLessThan(report.threshold);
			expect(stats.words).toBeGreaterThanOrEqual(minWords);
		}
	});

	it("answers membership through isCuratedContent", () => {
		const [first] = getCuratedContentIds();
		expect(isCuratedContent(first)).toBe(true);
		expect(isCuratedContent("this-id-does-not-exist")).toBe(false);
	});
});
