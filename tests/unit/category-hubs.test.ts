import { describe, it, expect } from "bun:test";
import {
	getCategoryBySlug,
	getAllToolsByCategory,
	getToolById,
} from "../../src/lib/tools";
import { YOUTUBE_HUB_GROUPS } from "../../src/data/youtube-hub-groups";
import { getMonetizationDecision } from "../../src/data/monetization";

/**
 * Regression tests for the 2026-10-26 hub fix: getCategoryBySlug used to
 * match only the exact registry slug, so hub pages passing the registry
 * key or a bare name (e.g. "audio", "seo", "video") got [] and rendered
 * an empty tool grid. The YouTube hub page did not exist at all.
 */
describe("Category hub lookup", () => {
	it("resolves exact slugs, registry keys and bare names to the same category", () => {
		const cases: [string, string, string][] = [
			["audio-tools", "audio", "Audio Tools"],
			["seo-tools", "seo", "SEO Tools"],
			["video-tools", "video", "Video Tools"],
			["youtube-tools", "youtube", "YouTube Tools"],
			["developer-tools", "developer", "Developer Tools"],
			["extraction-tools", "extraction", "Extraction Tools"],
			["text-tools", "text", "Text Tools"],
			["utility-tools", "utilities", "Utility Tools"],
		];
		for (const [slug, key, name] of cases) {
			const bySlug = getCategoryBySlug(slug);
			const byKey = getCategoryBySlug(key);
			expect(bySlug).toBeDefined();
			expect(byKey).toBeDefined();
			expect(bySlug?.slug).toBe(slug);
			expect(byKey?.slug).toBe(slug);
			expect(bySlug?.name).toBe(name);
			expect(byKey?.name).toBe(name);
		}
	});

	it("returns undefined for unknown slugs", () => {
		expect(getCategoryBySlug("not-a-category")).toBeUndefined();
		expect(getCategoryBySlug("")).toBeUndefined();
	});

	it("returns every hub page's tools (no empty hub grids)", () => {
		const expected: Record<string, number> = {
			"ai-tools": 12,
			audio: 12,
			calculators: 48,
			developer: 114,
			extraction: 11,
			generators: 36,
			seo: 21,
			text: 38,
			utilities: 93,
			video: 82,
			youtube: 31,
		};
		for (const [arg, count] of Object.entries(expected)) {
			const tools = getAllToolsByCategory(arg);
			expect(tools.length).toBe(count);
			for (const tool of tools) {
				expect(tool.route.startsWith("/")).toBe(true);
			}
		}
	});

	it("keeps tool-guides exact slugs resolving", () => {
		for (const slug of ["audio-tools", "youtube-tools", "seo-tools", "video-tools"]) {
			expect(getCategoryBySlug(slug)?.slug).toBe(slug);
		}
	});

	it("video hub's indexable filter still leaves a non-empty grid", () => {
		// Mirrors src/app/(video)/video-tools/page.tsx: raw hub tools carry
		// no category field, so the decision is slug-based only.
		const tools = getAllToolsByCategory("video");
		const indexable = tools.filter((tool) =>
			getMonetizationDecision({ slug: tool.id, category: (tool as any).category || "" })
				.indexable,
		);
		expect(indexable.length).toBeGreaterThan(0);
		expect(indexable.length).toBeLessThan(tools.length);
	});
});

describe("YouTube hub groups", () => {
	it("covers every youtube tool exactly once, and every id resolves", () => {
		const youtubeIds = getAllToolsByCategory("youtube").map((tool) => tool.id);
		const grouped = YOUTUBE_HUB_GROUPS.flatMap((group) => group.toolIds);
		expect(grouped.length).toBe(youtubeIds.length);
		expect(new Set(grouped).size).toBe(grouped.length);
		expect([...grouped].sort()).toEqual([...youtubeIds].sort());
		for (const id of grouped) {
			const tool = getToolById(id);
			expect(tool).toBeDefined();
			expect(tool?.route.startsWith("/")).toBe(true);
		}
	});

	it("has the four documented groups", () => {
		expect(YOUTUBE_HUB_GROUPS.map((group) => group.heading)).toEqual([
			"Download & save",
			"Channel research",
			"Titles, tags & descriptions",
			"Links & embeds",
		]);
	});
});
