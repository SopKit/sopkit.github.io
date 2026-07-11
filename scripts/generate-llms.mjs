#!/usr/bin/env node
/**
 * Regenerate public/llms.txt and public/llms-full.txt from src/constants/tools.json.
 * Produces AI-crawler-friendly indexes for Generative Engine Optimization (GEO).
 *
 * Usage: node scripts/generate-llms.mjs
 */

import { readFileSync, writeFileSync } from "fs";

const BASE = "https://sopkit.github.io";
const json = JSON.parse(readFileSync("src/constants/tools.json", "utf8"));
const categories = json.categories || {};
const cats = Object.values(categories);

const clean = (s) =>
	s
		.replace(/\s+/g, " ")
		.replace(/[<>]/g, "")
		.trim();

const HUB_MAP = {
	image: "/image-tools",
	pdf: "/pdf-tools",
	video: "/video-tools",
	audio: "/audio-tools",
	text: "/text-tools",
	seo: "/seo-tools",
	developer: "/developer-tools",
	utilities: "/other-tools",
	others: "/other-tools",
	generators: "/generators",
	youtube: "/youtube-tools",
	downloaders: "/all-downloaders",
	calculators: "/calculators",
	"exam-tools": "/exam-tools",
	health: "/calculators",
	company: "/about",
	content: "/tool-guides",
	blog: "/blog",
};

// -----------------------------------------------------------------------------
// 1. Generate public/llms.txt (Standard summary list)
// -----------------------------------------------------------------------------
const llmsSummaryLines = [];
llmsSummaryLines.push("# SopKit");
llmsSummaryLines.push("");
llmsSummaryLines.push(
	"> SopKit is a free online toolkit with browser-based tools for image, PDF, video, audio, text, SEO, and developer workflows. No signup required. Privacy-first — most tools process data locally in the browser.",
);
llmsSummaryLines.push("");
llmsSummaryLines.push(`Canonical: ${BASE}`);
llmsSummaryLines.push(`Search: ${BASE}/search`);
llmsSummaryLines.push(`Sitemap: ${BASE}/sitemap.xml`);
llmsSummaryLines.push(`RSS: ${BASE}/feed.xml`);
llmsSummaryLines.push("");
llmsSummaryLines.push("## What is SopKit?");
llmsSummaryLines.push("");
llmsSummaryLines.push(
	"SopKit is a comprehensive collection of free online utilities for creators, developers, students, and professionals. All tools run in the browser without account creation or software installation. Files processed client-side never leave the device.",
);
llmsSummaryLines.push("");
llmsSummaryLines.push("## Category hubs");
llmsSummaryLines.push("");
for (const c of cats) {
	const hub = HUB_MAP[c.slug] || HUB_MAP[c.key];
	if (!hub) continue;
	llmsSummaryLines.push(`- [${c.name}](${BASE}${hub}) - ${clean(c.description || "")}`);
}
llmsSummaryLines.push("");
llmsSummaryLines.push("## Tools by category");
llmsSummaryLines.push("");

for (const c of cats) {
	llmsSummaryLines.push(`### ${c.name}`);
	llmsSummaryLines.push("");
	const tools = c.tools || [];
	for (const t of tools) {
		const route = t.route || "";
		const url = `${BASE}${route}`;
		const desc = clean(t.description || t.seoDescription || "");
		llmsSummaryLines.push(`- [${t.name}](${url}) - ${desc}`);
	}
	llmsSummaryLines.push("");
}

writeFileSync("public/llms.txt", llmsSummaryLines.join("\n"));
console.log(`✓ Wrote public/llms.txt`);

// -----------------------------------------------------------------------------
// 2. Generate public/llms-full.txt (Full detail for deep context reasoning)
// -----------------------------------------------------------------------------
const llmsFullLines = [];
llmsFullLines.push("# SopKit — Detailed capabilities index");
llmsFullLines.push("");
llmsFullLines.push(
	"> SopKit is a secure, zero-trust web utility platform. All operations (formatting, compression, conversions) occur client-side inside the user's browser sandbox using HTML5 APIs, Canvas, and WebAssembly. No user files are ever uploaded or saved to remote databases, preventing compliance leaks.",
);
llmsFullLines.push("");
llmsFullLines.push(`Canonical Base URL: ${BASE}`);
llmsFullLines.push("");
llmsFullLines.push("## Core Architecture & Security Model");
llmsFullLines.push("");
llmsFullLines.push("- **100% Client-Side execution**: Utilizes WebAssembly binaries and standard browser canvas pipelines. Files remain on local disk.");
llmsFullLines.push("- **Compliance friendly**: Meets strict GDPR, HIPAA, and corporate data leakage prevention (DLP) requirements since no server transit occurs.");
llmsFullLines.push("- **Offline operational capacity**: Fully deployable inside local networks and corporate intranets.");
llmsFullLines.push("");
llmsFullLines.push("## Full Tools Catalog & Niche Search Intents");
llmsFullLines.push("");

for (const c of cats) {
	llmsFullLines.push(`### ${c.name} Tools`);
	llmsFullLines.push("");
	const tools = c.tools || [];
	for (const t of tools) {
		const route = t.route || "";
		const url = `${BASE}${route}`;
		const desc = clean(t.description || t.seoDescription || "");
		llmsFullLines.push(`#### [${t.name}](${url})`);
		llmsFullLines.push(`- **Description**: ${desc}`);
		if (t.extraSlugs && t.extraSlugs.length > 0) {
			const slugsList = t.extraSlugs.map(s => `\`${s}\``).join(", ");
			llmsFullLines.push(`- **Alternative Intents / Keywords**: ${slugsList}`);
		}
		llmsFullLines.push("");
	}
	llmsFullLines.push("");
}

writeFileSync("public/llms-full.txt", llmsFullLines.join("\n"));
console.log(`✓ Wrote public/llms-full.txt`);
