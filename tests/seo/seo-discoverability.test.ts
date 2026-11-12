import { describe, expect, it } from "bun:test";
import { buildCanonicalUrl } from "@/seo/canonical";
import { RelatedToolsServer } from "@/components/tools/shared/RelatedToolsServer";
import { ToolSteps, ToolFeatures } from "@/components/tools/shared/ToolSharedComponents";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import React from "react";
import ReactDOMServer from "react-dom/server";

describe("SEO, Semantic HTML & Discoverability Platform Invariants", () => {
	// The site exports with trailingSlash: true, so the only URL form that
	// resolves without a 301 on GitHub Pages is https://sopkit.space/<slug>/.
	// Next.js renders <link rel="canonical"> and og:url in that form; the
	// helper must agree so sitemaps and JSON-LD do not point at redirects.
	it("normalizes canonical URLs to the trailing-slash form for pages and leaves files slashless", () => {
		expect(buildCanonicalUrl("/")).toBe("https://sopkit.space/");
		expect(buildCanonicalUrl("")).toBe("https://sopkit.space/");
		expect(buildCanonicalUrl("/image-compressor")).toBe("https://sopkit.space/image-compressor/");
		expect(buildCanonicalUrl("/image-compressor/")).toBe("https://sopkit.space/image-compressor/");
		expect(buildCanonicalUrl("https://sopkit.space/pdf-tools/")).toBe("https://sopkit.space/pdf-tools/");
		expect(buildCanonicalUrl("/image-compressor?utm_source=google")).toBe("https://sopkit.space/image-compressor/");
		expect(buildCanonicalUrl("/blog//page/2/")).toBe("https://sopkit.space/blog/page/2/");
		expect(buildCanonicalUrl("/sitemap.xml")).toBe("https://sopkit.space/sitemap.xml");
		expect(buildCanonicalUrl("/tool-markdown/json-formatter.md")).toBe("https://sopkit.space/tool-markdown/json-formatter.md");
	});

	it("verifies sitemap generates canonical URLs with a trailing slash for every page route", () => {
		const pages = sitemap();
		expect(pages.length).toBeGreaterThan(100);

		// Root page should be https://sopkit.space/
		const rootPage = pages.find((p) => p.url === "https://sopkit.space/");
		expect(rootPage).toBeDefined();

		for (const page of pages) {
			// Every page URL must carry the export's trailing slash
			expect(page.url.endsWith("/")).toBe(true);
			expect(page.url.includes("//", "https://".length)).toBe(false);
			// Search routes should never be in sitemap
			expect(page.url.includes("/search")).toBe(false);
		}
	});

	it("verifies robots metadata disallows /search (src/app/robots.ts is the only robots source)", () => {
		const robotsRules = robots();
		const rules = Array.isArray(robotsRules.rules) ? robotsRules.rules : [robotsRules.rules];
		const defaultRule = rules.find((r) => r.userAgent === "*" || (Array.isArray(r.userAgent) && r.userAgent.includes("*")));

		expect(defaultRule).toBeDefined();
		const disallowList = Array.isArray(defaultRule?.disallow) ? defaultRule.disallow : [defaultRule?.disallow];
		expect(disallowList).toContain("/search");
		// /embed/ pages are noindex; a disallow would hide that directive.
		expect(disallowList).not.toContain("/embed/");
	});

	it("renders RelatedToolsServer with semantic section and links without client hydration requirement", () => {
		const mockTools = [
			{ id: "current-tool", name: "Current Tool", route: "/current-tool", description: "Current", category: "image" },
			{ id: "tool-b", name: "Tool B", route: "/tool-b", description: "Tool B Desc", category: "image" },
			{ id: "tool-c", name: "Tool C", route: "/tool-c", description: "Tool C Desc", category: "image" },
		];

		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(RelatedToolsServer, {
				currentTool: "current-tool",
				tools: mockTools as any,
			})
		);

		expect(html).toContain('<section class="space-y-3 pt-6 border-t border-border/60" aria-label="Related tools">');
		expect(html).toContain('href="/tool-b"');
		expect(html).toContain('href="/tool-c"');
		// Should filter out the current tool
		expect(html).not.toContain('href="/current-tool"');
	});

	it("renders ToolSteps as semantic ordered list (<ol>) with list items (<li>)", () => {
		const steps = [
			{ name: "Upload", text: "Upload your document" },
			{ name: "Convert", text: "Press convert button" },
		];

		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(ToolSteps, {
				steps,
				toolName: "PDF Converter",
			})
		);

		expect(html).toContain("<ol");
		expect(html).toContain("<li");
		expect(html).toContain("Upload");
		expect(html).toContain("Convert");
	});

	it("renders ToolFeatures as semantic unordered list (<ul>) with list items (<li>)", () => {
		const features = ["Fast processing", "100% Client-side", "Zero uploads"];

		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(ToolFeatures, {
				features,
				toolName: "PDF Converter",
			})
		);

		expect(html).toContain("<ul");
		expect(html).toContain("<li");
		expect(html).toContain("Fast processing");
	});
});
