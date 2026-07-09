#!/usr/bin/env node
/**
 * SopKit SEO Audit — production crawler
 *
 * Fetches live pages from the deployed site and checks SEO requirements:
 *   - robots.txt + sitemap.xml are reachable and reference each other
 *   - every sitemap <loc> returns 200, has a self-referential canonical,
 *     a single H1, title + meta description, enough body text, and parseable JSON-LD
 *   - /search is noindex
 *
 * Usage:
 *   node scripts/seo-audit-local.mjs
 *   node scripts/seo-audit-local.mjs --all
 *   node scripts/seo-audit-local.mjs --limit=50 --json
 *   BASE_URL=https://sopkit.github.io node scripts/seo-audit-local.mjs
 */

import { writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = process.env.BASE_URL || "https://sopkit.github.io";
const verbose = process.argv.includes("--verbose");
const jsonOutput = process.argv.includes("--json");
const all = process.argv.includes("--all");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : 60;
const concurrency = 8;

const colors = {
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	reset: "\x1b[0m",
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;
const results = [];

function log(msg, color = colors.reset) {
	console.log(`${color}${msg}${colors.reset}`);
}
function pass(msg) {
	passedChecks++;
	if (verbose) log(`  ✓  ${msg}`, colors.green);
}
function fail(msg, url = "") {
	failedChecks++;
	results.push({ status: "FAIL", message: msg, url });
	log(`  ✗  ${msg}${url ? ` (${url})` : ""}`, colors.red);
}
function warn(msg, url = "") {
	warnings++;
	results.push({ status: "WARN", message: msg, url });
	log(`  ⚠  ${msg}`, colors.yellow);
}

async function fetchPage(url, redirects = true) {
	try {
		const res = await fetch(url, {
			redirect: redirects ? "follow" : "manual",
			headers: { "User-Agent": "SopKit-SEO-Audit/2.0" },
		});
		const html = await res.text();
		return { status: res.status, html, ok: res.ok, url: res.url };
	} catch (error) {
		return { status: 0, html: "", ok: false, error: error.message, url };
	}
}

function parseHtml(html) {
	const canonical =
		html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || "";
	const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
	const metaDesc =
		html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
	const h1Matches = html.match(/<h1[^>]*>/gi) || [];
	const bodyText = html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const ldScripts = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(
		(m) => m[1],
	);
	let jsonLdValid = true;
	let hasFaq = false;
	try {
		for (const s of ldScripts) {
			const parsed = JSON.parse(s.replace(/<!\[CDATA\[|\]\]>/g, ""));
			const objs = Array.isArray(parsed) ? parsed : [parsed];
			if (objs.some((o) => o?.["@type"] === "FAQPage")) hasFaq = true;
		}
	} catch {
		jsonLdValid = false;
	}
	return {
		canonical,
		title,
		metaDesc,
		h1Count: h1Matches.length,
		bodyLength: bodyText.length,
		hasTitle: title.length > 0,
		hasMetaDesc: metaDesc.length > 0,
		hasCanonical: canonical.length > 0,
		hasNoindex: /name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html),
		jsonLdValid,
		hasFaq,
	};
}

async function auditUrl(url) {
	totalChecks++;
	const res = await fetchPage(url);
	if (!res.ok) {
		fail(`returns ${res.status} instead of 200`, url);
		return;
	}
	const p = parseHtml(res.html);
	if (!p.hasTitle) fail("missing <title>", url);
	else pass(`has title (${p.title.length} chars)`);
	if (!p.hasMetaDesc) fail("missing meta description", url);
	else pass("has meta description");
	if (!p.hasCanonical) fail("missing canonical", url);
	else {
		const norm = (u) => u.replace(/\/+$/, "").toLowerCase();
		if (norm(p.canonical) === norm(url)) pass("canonical is self-referential");
		else if (p.canonical.includes("sopkit.github.io")) warn(`canonical ${p.canonical} != ${url}`, url);
		else fail(`canonical ${p.canonical} is off-domain`, url);
	}
	if (p.h1Count === 1) pass("exactly one H1");
	else fail(`has ${p.h1Count} H1s (expected 1)`, url);
	if (p.bodyLength > 1000) pass(`meaningful body (${p.bodyLength} chars)`);
	else fail(`body too thin (${p.bodyLength} chars)`, url);
	if (p.jsonLdValid) pass("JSON-LD parses");
	else warn("JSON-LD missing or invalid", url);
}

async function checkSitemap() {
	totalChecks += 2;
	const robots = await fetchPage(`${BASE_URL}/robots.txt`);
	if (robots.status === 200) {
		pass("robots.txt returns 200");
		if (robots.html.includes("sitemap")) pass("robots.txt references sitemap");
		else fail("robots.txt missing sitemap reference", "/robots.txt");
	} else {
		fail("robots.txt should return 200", "/robots.txt");
	}

	const sm = await fetchPage(`${BASE_URL}/sitemap.xml`);
	if (sm.status !== 200) {
		fail("sitemap.xml should return 200", "/sitemap.xml");
		return [];
	}
	pass("sitemap.xml returns 200");
	const urls = (sm.html.match(/<loc>([^<]+)<\/loc>/g) || []).map((l) =>
		l.replace(/<\/?loc>/g, "").trim(),
	);
	log(`  ℹ  sitemap contains ${urls.length} URLs`, colors.blue);
	if (urls.some((u) => u.includes("?"))) warn("sitemap contains query-string URLs");
	return urls;
}

async function pool(items, worker, size) {
	for (let i = 0; i < items.length; i += size) {
		const batch = items.slice(i, i + size);
		await Promise.all(batch.map(worker));
	}
}

async function main() {
	log("\n🛠️  SopKit SEO Audit\n");
	log("═".repeat(50), colors.blue);
	log(`  Target: ${BASE_URL}`);
	const start = Date.now();

	const sitemapUrls = await checkSitemap();

	const search = await fetchPage(`${BASE_URL}/search`);
	if (search.ok) {
		totalChecks++;
		const p = parseHtml(search.html);
		if (p.hasNoindex) pass("/search is noindex");
		else warn("/search should be noindex");
	} else {
		fail("/search returned non-200", "/search");
	}

	if (sitemapUrls.length) {
		const sample = all ? sitemapUrls : sitemapUrls.slice(0, limit);
		log(
			`\n  Auditing ${sample.length} sitemap URL(s)${all ? "" : ` (use --all for all ${sitemapUrls.length})`}...\n`,
			colors.blue,
		);
		await pool(sample, (u) => auditUrl(u), concurrency);
	}

	const duration = ((Date.now() - start) / 1000).toFixed(2);
	log("\n" + "═".repeat(50), colors.blue);
	log(`\n📊 Audit Summary (${duration}s)`);
	log("-".repeat(30));
	const summary = {
		total: totalChecks,
		passed: passedChecks,
		failed: failedChecks,
		warnings: warnings,
		sitemapUrls: sitemapUrls.length,
		timestamp: new Date().toISOString(),
		baseUrl: BASE_URL,
	};
	if (jsonOutput) console.log(JSON.stringify({ ...summary, results }, null, 2));
	else {
		log(`  Total checks: ${totalChecks}`);
		log(`  ${colors.green}Passed: ${passedChecks}${colors.reset}`);
		log(`  ${colors.red}Failed: ${failedChecks}${colors.reset}`);
		log(`  ${colors.yellow}Warnings: ${warnings}${colors.reset}`);
	}
	const reportPath = join(process.cwd(), "seo-audit-report.json");
	writeFileSync(reportPath, JSON.stringify({ ...summary, results }, null, 2));
	log(`\n  Report written to ${reportPath}`);

	if (failedChecks > 0) {
		log("\n✗ Audit completed with failures", colors.red);
		process.exit(1);
	}
	if (warnings > 0) {
		log("\n⚠ Audit completed with warnings", colors.yellow);
		process.exit(0);
	}
	log("\n✓ All checks passed!", colors.green);
	process.exit(0);
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
