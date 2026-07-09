#!/usr/bin/env node
/**
 * Regenerate public/llms.txt from src/constants/tools.json.
 * Produces an AI-crawler-friendly index: site header + every tool grouped by
 * category with a one-line description and canonical link.
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

// Verified canonical hub routes (kept in sync with src/lib/seo.ts CATEGORY_HUB_URLS
// and the staticPages list in src/app/sitemap.ts).
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

const lines = [];
lines.push("# SopKit");
lines.push("");
lines.push(
	"> SopKit is a free online toolkit with browser-based tools for image, PDF, video, audio, text, SEO, and developer workflows. No signup required. Privacy-first — most tools process data locally in the browser.",
);
lines.push("");
lines.push(`Canonical: ${BASE}`);
lines.push(`Search: ${BASE}/search`);
lines.push(`Sitemap: ${BASE}/sitemap.xml`);
lines.push(`RSS: ${BASE}/feed.xml`);
lines.push("");
lines.push("## What is SopKit?");
lines.push("");
lines.push(
	"SopKit is a comprehensive collection of free online utilities for creators, developers, students, and professionals. All tools run in the browser without account creation or software installation. Files processed client-side never leave the device.",
);
lines.push("");
lines.push("## Category hubs");
lines.push("");
for (const c of cats) {
	const hub = HUB_MAP[c.slug] || HUB_MAP[c.key];
	if (!hub) continue;
	lines.push(`- [${c.name}](${BASE}${hub}) - ${clean(c.description || "")}`);
}
lines.push("");
lines.push("## Tools by category");
lines.push("");

for (const c of cats) {
	lines.push(`### ${c.name}`);
	lines.push("");
	const tools = c.tools || [];
	for (const t of tools) {
		const route = t.route || "";
		const url = `${BASE}${route}`;
		const desc = clean(t.description || t.seoDescription || "");
		lines.push(`- [${t.name}](${url}) - ${desc}`);
	}
	lines.push("");
}

const out = lines.join("\n");
writeFileSync("public/llms.txt", out);
console.log(`✓ Wrote public/llms.txt (${cats.reduce((n, c) => n + (c.tools?.length || 0), 0)} tools across ${cats.length} categories)`);
