import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import {
	getSeoOpportunityBySlug,
	seoOpportunities,
} from "@/data/seo-opportunities";
import {
	getAllTools,
	getToolByExtraSlug,
	getToolById,
} from "@/lib/tools";
import { relatedToolsForOpportunity } from "@/lib/seo-opportunity-related";

// The intent page builds its "Parent tool" article line from
// getToolById(parentToolSlug) and its related cards from
// parentToolRoute/relatedSlugs through a filter, so a bad reference fails
// silently — a fallback sentence or a missing card. These tests pin the
// invariants through the exact production resolution path, plus the real
// relatedToolsForOpportunity, so a copy-pasted parent or a dead related
// slug can never again silently remove a card. The prebuild script
// scripts/validate-seo-opportunities.ts enforces the same invariants on
// the committed source text.

const tools = getAllTools();
const toolById = new Map(tools.map((tool) => [tool.id, tool]));
const toolRoutes = new Set(tools.map((tool) => tool.route));
const opportunitySlugs = new Set(seoOpportunities.map((item) => item.slug));

function resolvesRelated(slug: string): boolean {
	return (
		toolById.has(slug) ||
		toolRoutes.has(`/${slug}`) ||
		getToolByExtraSlug(slug) !== undefined ||
		opportunitySlugs.has(slug)
	);
}

describe("SEO opportunity references resolve to real pages", () => {
	it("covers a non-trivial opportunity set (guard against a vacuous pass)", () => {
		expect(seoOpportunities.length).toBeGreaterThan(100);
	});

	it("every parentToolSlug is a registry tool id and every parentToolRoute is that tool's route", () => {
		for (const opportunity of seoOpportunities) {
			const parent = getToolById(opportunity.parentToolSlug);
			expect(parent, `${opportunity.slug} parent`).toBeDefined();
			expect(parent?.route).toBe(opportunity.parentToolRoute);
		}
	});

	it("every relatedSlug resolves to a tool, an extraSlug, or a sibling opportunity", () => {
		let checked = 0;
		for (const opportunity of seoOpportunities) {
			for (const slug of opportunity.relatedSlugs) {
				checked += 1;
				expect(resolvesRelated(slug), `${opportunity.slug} -> ${slug}`).toBe(
					true,
				);
			}
		}
		expect(checked).toBeGreaterThan(400);
	});

	it("every opportunity route equals its slug route", () => {
		for (const opportunity of seoOpportunities) {
			expect(opportunity.route).toBe(`/${opportunity.slug}`);
		}
	});

	it("pins the repaired lorem-ipsum parents", () => {
		for (const slug of [
			"lorem-ipsum-generator-paragraphs",
			"dummy-text-generator-online",
		]) {
			const opportunity = getSeoOpportunityBySlug(slug);
			expect(opportunity?.parentToolSlug).toBe("lorem-ipsum-generator");
			expect(opportunity?.parentToolRoute).toBe("/lorem-ipsum");
			expect(getToolById("lorem-ipsum-generator")?.name).toBe(
				"Lorem Ipsum Generator",
			);
		}
	});

	it("pins the repaired api-key parents (no more copy-pasted OpenAI parent)", () => {
		const expected: Record<string, [string, string]> = {
			"openai-api-key-validator": [
				"openai-api-key-tester",
				"/api-key-tester/openai",
			],
			"claude-api-key-validator": [
				"anthropic-api-key-tester",
				"/api-key-tester/anthropic",
			],
			"gemini-api-key-validator": [
				"google-gemini-api-key-tester",
				"/api-key-tester/google-gemini",
			],
			"cohere-api-key-tester": [
				"cohere-api-key-tester",
				"/api-key-tester/cohere",
			],
			"stability-ai-api-key-tester": ["api-key-tester", "/api-key-tester"],
			"huggingface-api-key-tester": ["api-key-tester", "/api-key-tester"],
			"mailgun-api-key-tester": [
				"mailgun-api-key-tester",
				"/api-key-tester/mailgun",
			],
			"postmark-api-key-tester": [
				"postmark-api-key-tester",
				"/api-key-tester/postmark",
			],
		};
		for (const [slug, [parentId, parentRoute]] of Object.entries(expected)) {
			const opportunity = getSeoOpportunityBySlug(slug);
			expect(opportunity?.parentToolSlug).toBe(parentId);
			expect(opportunity?.parentToolRoute).toBe(parentRoute);
		}
		// Stability AI and Hugging Face have no provider tool in the
		// registry, so the generic suite is the honest parent — not an
		// invented provider tool and not a renamed OpenAI tool.
		expect(getToolById("stability-ai-api-key-tester")).toBeUndefined();
		expect(getToolById("huggingface-api-key-tester")).toBeUndefined();
	});
});

describe("relatedToolsForOpportunity renders real cards", () => {
	it("includes the parent tool card for the repaired entries", () => {
		for (const slug of [
			"lorem-ipsum-generator-paragraphs",
			"claude-api-key-validator",
			"cohere-api-key-tester",
			"mailgun-api-key-tester",
		]) {
			const opportunity = getSeoOpportunityBySlug(slug);
			expect(opportunity).toBeDefined();
			const related = relatedToolsForOpportunity(opportunity!);
			expect(
				related.some((tool) => tool.id === opportunity!.parentToolSlug),
			).toBe(true);
		}
	});

	it("renders sibling opportunity cards for validator pages instead of dropping them", () => {
		const opportunity = getSeoOpportunityBySlug("claude-api-key-validator");
		const related = relatedToolsForOpportunity(opportunity!);
		// claude/gemini tester slugs are sibling opportunities, not tools.
		expect(related.some((tool) => tool.id === "claude-api-key-tester")).toBe(
			true,
		);
		expect(related.some((tool) => tool.id === "gemini-api-key-tester")).toBe(
			true,
		);
		const claudeCard = related.find(
			(tool) => tool.id === "claude-api-key-tester",
		);
		expect(claudeCard?.route).toBe("/claude-api-key-tester");
		expect(claudeCard?.name).toBe("Claude API Key Tester");
	});

	it("renders the extraSlug tool card for passport-photo-resizer-india", () => {
		const pages = seoOpportunities.filter((item) =>
			item.relatedSlugs.includes("passport-photo-resizer-india"),
		);
		expect(pages.length).toBeGreaterThan(0);
		for (const opportunity of pages) {
			const related = relatedToolsForOpportunity(opportunity);
			expect(
				related.some((tool) => tool.id === "passport-photo-maker"),
			).toBe(true);
		}
	});

	it("never duplicates a card and never exceeds the 12-card cap", () => {
		for (const opportunity of seoOpportunities) {
			const related = relatedToolsForOpportunity(opportunity);
			expect(related.length).toBeLessThanOrEqual(12);
			const ids = related.map((tool) => tool.id);
			expect(new Set(ids).size).toBe(ids.length);
			const routes = related.map((tool) => tool.route);
			expect(new Set(routes).size).toBe(routes.length);
		}
	});
});

const rootDir = path.resolve(import.meta.dir, "../..");

describe("SEO opportunity categoryHub breadcrumb URLs resolve", () => {
	it("every categoryHub resolves to a page, a tool route, or a sibling opportunity", () => {
		// Page routes from src/app, route groups stripped, dynamic
		// segments excluded (they are not static pages).
		const pageRoutes = new Set<string>();
		const walk = (
			dir: string,
			segments: string[],
			inDynamic: boolean,
		): void => {
			for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
				if (!entry.isDirectory()) continue;
				if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
					walk(path.join(dir, entry.name), segments, inDynamic);
				} else if (
					entry.name.startsWith("[") &&
					entry.name.endsWith("]")
				) {
					walk(path.join(dir, entry.name), segments, true);
				} else {
					walk(
						path.join(dir, entry.name),
						[...segments, entry.name],
						inDynamic,
					);
				}
			}
			if (
				!inDynamic &&
				fs.existsSync(path.join(dir, "page.tsx"))
			) {
				pageRoutes.add(`/${segments.join("/")}`);
			}
		};
		walk(path.join(rootDir, "src", "app"), [], false);
		let checked = 0;
		for (const opportunity of seoOpportunities) {
			checked += 1;
			const resolves =
				pageRoutes.has(opportunity.categoryHub) ||
				toolRoutes.has(opportunity.categoryHub) ||
				opportunitySlugs.has(opportunity.categoryHub.slice(1));
			expect(
				resolves,
				`${opportunity.slug} -> ${opportunity.categoryHub}`,
			).toBe(true);
		}
		expect(checked).toBeGreaterThan(100);
	});
});
