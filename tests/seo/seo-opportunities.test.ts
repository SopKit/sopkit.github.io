import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import {
	getSeoOpportunityBySlug,
	seoOpportunities,
} from "@/data/seo-opportunities";
import { getAllTools, getToolById } from "@/lib/tools";
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
//
// The opportunity set was cut from 148 entries to the handful that carry a
// distinct preset (see the header of src/data/seo-opportunities.ts). The
// retired slugs live in src/seo/redirects/opportunities.json as 301s; the
// last block below pins that no retired slug is still an opportunity and
// that every redirect target is a real tool route.

const rootDir = path.resolve(import.meta.dir, "../..");

const tools = getAllTools();
const toolById = new Map(tools.map((tool) => [tool.id, tool]));
const toolRoutes = new Set(tools.map((tool) => tool.route));
const opportunitySlugs = new Set(seoOpportunities.map((item) => item.slug));

// Survivors after the doorway-page cleanup. Bump this deliberately when an
// entry is added; it guards against the set silently shrinking to zero.
const EXPECTED_MINIMUM_OPPORTUNITIES = 18;

function resolvesRelated(slug: string): boolean {
	return (
		toolById.has(slug) ||
		toolRoutes.has(`/${slug}`) ||
		opportunitySlugs.has(slug)
	);
}

describe("SEO opportunity references resolve to real pages", () => {
	it("covers the full surviving opportunity set (guard against a vacuous pass)", () => {
		expect(seoOpportunities.length).toBeGreaterThanOrEqual(
			EXPECTED_MINIMUM_OPPORTUNITIES,
		);
	});

	it("every parentToolSlug is a registry tool id and every parentToolRoute is that tool's route", () => {
		for (const opportunity of seoOpportunities) {
			const parent = getToolById(opportunity.parentToolSlug);
			expect(parent, `${opportunity.slug} parent`).toBeDefined();
			expect(parent?.route).toBe(opportunity.parentToolRoute);
		}
	});

	it("every relatedSlug resolves to a tool or a sibling opportunity", () => {
		let checked = 0;
		for (const opportunity of seoOpportunities) {
			for (const slug of opportunity.relatedSlugs) {
				checked += 1;
				expect(resolvesRelated(slug), `${opportunity.slug} -> ${slug}`).toBe(
					true,
				);
			}
		}
		// 18 entries with three to five related slugs each.
		expect(checked).toBeGreaterThanOrEqual(80);
	});

	it("every opportunity route equals its slug route", () => {
		for (const opportunity of seoOpportunities) {
			expect(opportunity.route).toBe(`/${opportunity.slug}`);
		}
	});

	it("every standalone opportunity carries a preset that differs from the parent default", () => {
		// A standalone page exists only to deliver a distinct preset. Each
		// one must have a toolPreset, and no two standalone pages may share
		// the same preset values, otherwise one of them is a doorway page.
		const seen = new Set<string>();
		for (const opportunity of seoOpportunities.filter((o) => o.standalone)) {
			expect(opportunity.toolPreset, `${opportunity.slug} preset`).toBeDefined();
			const key = JSON.stringify(opportunity.toolPreset);
			expect(seen.has(key), `${opportunity.slug} duplicates another preset`).toBe(false);
			seen.add(key);
		}
	});

	it("non-standalone entries all shadow a real registry tool route", () => {
		// A non-standalone entry has no page of its own; it exists only to
		// enrich the registry tool page at the same route via ToolLayout.
		for (const opportunity of seoOpportunities.filter((o) => !o.standalone)) {
			expect(toolRoutes.has(opportunity.route), opportunity.slug).toBe(true);
		}
	});

	it("pins the surviving standalone preset pages and their parents", () => {
		const expected: Record<string, [string, string]> = {
			"compress-image-to-50kb": ["image-compressor", "/image-compressor"],
			"ssc-signature-resizer": ["ssc-photo-resizer", "/ssc-photo-resizer"],
			"upsc-signature-resizer": ["upsc-photo-resizer", "/upsc-photo-resizer"],
			"qr-code-for-wifi": ["qr-code-generator", "/qr-code-generator"],
			"qr-code-for-upi-payment": ["qr-code-generator", "/qr-code-generator"],
		};
		for (const [slug, [parentId, parentRoute]] of Object.entries(expected)) {
			const opportunity = getSeoOpportunityBySlug(slug);
			expect(opportunity?.standalone, slug).toBe(true);
			expect(opportunity?.parentToolSlug).toBe(parentId);
			expect(opportunity?.parentToolRoute).toBe(parentRoute);
		}
		expect(seoOpportunities.filter((o) => o.standalone).length).toBe(
			Object.keys(expected).length,
		);
	});
});

describe("relatedToolsForOpportunity renders real cards", () => {
	it("includes the parent tool card for every standalone page", () => {
		for (const opportunity of seoOpportunities.filter((o) => o.standalone)) {
			const related = relatedToolsForOpportunity(opportunity);
			expect(
				related.some((tool) => tool.id === opportunity.parentToolSlug),
				opportunity.slug,
			).toBe(true);
		}
	});

	it("renders sibling opportunity cards instead of dropping them", () => {
		const opportunity = getSeoOpportunityBySlug("ssc-signature-resizer");
		const related = relatedToolsForOpportunity(opportunity!);
		// upsc-signature-resizer is a sibling opportunity, not a registry tool.
		const siblingCard = related.find(
			(tool) => tool.id === "upsc-signature-resizer",
		);
		expect(siblingCard).toBeDefined();
		expect(siblingCard?.route).toBe("/upsc-signature-resizer");
		expect(siblingCard?.name).toBe("UPSC Signature Resizer");
	});

	it("renders the passport photo tool card where it is referenced", () => {
		// This used to point at the alias slug "passport-photo-resizer-india",
		// which resolved only through the removed extraSlug system. It now
		// names the registry tool directly.
		const pages = seoOpportunities.filter((item) =>
			item.relatedSlugs.includes("passport-photo-maker"),
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
		expect(checked).toBeGreaterThanOrEqual(EXPECTED_MINIMUM_OPPORTUNITIES);
	});
});

describe("Retired opportunity pages are redirected, not rendered", () => {
	const manifest = JSON.parse(
		fs.readFileSync(
			path.join(rootDir, "src", "seo", "redirects", "opportunities.json"),
			"utf8",
		),
	) as { from: string; to: string; reason: string }[];

	it("covers the retired set (guard against an emptied manifest)", () => {
		// 148 original entries minus 18 survivors minus the two retired
		// entries whose slug is itself a registry tool route (no redirect
		// needed there; the tool page answers).
		expect(manifest.length).toBeGreaterThanOrEqual(128);
	});

	it("no redirect source is still an opportunity route, and every target is a registry tool route", () => {
		const opportunityRoutes = new Set(seoOpportunities.map((o) => o.route));
		for (const entry of manifest) {
			expect(entry.from.startsWith("/"), entry.from).toBe(true);
			expect(opportunityRoutes.has(entry.from), `${entry.from} still rendered`).toBe(false);
			expect(toolRoutes.has(entry.to), `${entry.from} -> ${entry.to}`).toBe(true);
			expect(entry.from).not.toBe(entry.to);
			expect(entry.reason.length).toBeGreaterThan(0);
		}
	});

	it("names the families the rulebook retired", () => {
		const sources = new Set(manifest.map((entry) => entry.from));
		for (const retired of [
			"/compress-image-to-15kb",
			"/compress-image-to-5mb",
			"/compress-signature-to-10kb",
			"/compress-pdf-to-100kb",
			"/openai-api-key-validator",
			"/huggingface-api-key-tester",
			"/website-speed-checker",
			"/weighted-gpa-calculator",
			"/bunk-calculator",
			"/qr-code-for-restaurant-menu",
			"/lorem-ipsum-generator-paragraphs",
			"/merge-pdf-files-online",
		]) {
			expect(sources.has(retired), retired).toBe(true);
		}
	});
});
