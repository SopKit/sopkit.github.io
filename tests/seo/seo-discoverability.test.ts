import { describe, expect, it } from "bun:test";
import { buildCanonicalUrl } from "@/seo/canonical";
import { VisuallyHiddenSeoContext } from "@/components/seo/VisuallyHiddenSeoContext";
import { RelatedToolsServer } from "@/components/tools/shared/RelatedToolsServer";
import { ToolSteps, ToolFeatures } from "@/components/tools/shared/ToolSharedComponents";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import React from "react";
import ReactDOMServer from "react-dom/server";

describe("SEO, Semantic HTML & Discoverability Platform Invariants", () => {
	it("normalizes canonical URLs with zero trailing slashes for subpaths and exact trailing slash for root", () => {
		expect(buildCanonicalUrl("/")).toBe("https://sopkit.space/");
		expect(buildCanonicalUrl("")).toBe("https://sopkit.space/");
		expect(buildCanonicalUrl("/image-compressor")).toBe("https://sopkit.space/image-compressor");
		expect(buildCanonicalUrl("/image-compressor/")).toBe("https://sopkit.space/image-compressor");
		expect(buildCanonicalUrl("https://sopkit.space/pdf-tools/")).toBe("https://sopkit.space/pdf-tools");
		expect(buildCanonicalUrl("/image-compressor?utm_source=google")).toBe("https://sopkit.space/image-compressor");
	});

	it("verifies sitemap generates canonical URLs without trailing slashes for subpath routes", () => {
		const pages = sitemap();
		expect(pages.length).toBeGreaterThan(100);

		// Root page should be https://sopkit.space/
		const rootPage = pages.find((p) => p.url === "https://sopkit.space/");
		expect(rootPage).toBeDefined();

		// Subpath pages should NOT end with a trailing slash
		for (const page of pages) {
			if (page.url !== "https://sopkit.space/") {
				expect(page.url.endsWith("/")).toBe(false);
			}
			// Search routes should never be in sitemap
			expect(page.url.includes("/search")).toBe(false);
		}
	});

	it("verifies robots metadata disallows /search to align with public/robots.txt", () => {
		const robotsRules = robots();
		const rules = Array.isArray(robotsRules.rules) ? robotsRules.rules : [robotsRules.rules];
		const defaultRule = rules.find((r) => r.userAgent === "*" || (Array.isArray(r.userAgent) && r.userAgent.includes("*")));

		expect(defaultRule).toBeDefined();
		const disallowList = Array.isArray(defaultRule?.disallow) ? defaultRule.disallow : [defaultRule?.disallow];
		expect(disallowList).toContain("/search");
	});

	it("renders VisuallyHiddenSeoContext with sr-only semantic landmarks and truthful privacy notices", () => {
		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(VisuallyHiddenSeoContext, {
				toolName: "Image Compressor",
				description: "Compress images locally in your browser.",
				category: "image",
				executionType: "client",
				features: ["Preserve metadata", "Instant download"],
				supportedFormats: ["JPG", "PNG", "WebP"],
				steps: [{ name: "Select image", text: "Choose a file from disk." }],
			})
		);

		expect(html).toContain('class="sr-only"');
		expect(html).toContain("<h2>About Image Compressor</h2>");
		expect(html).toContain("Local Browser Execution");
		expect(html).toContain("JPG, PNG, WebP");
		expect(html).not.toContain("display:none");
		expect(html).not.toContain("visibility:hidden");
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
