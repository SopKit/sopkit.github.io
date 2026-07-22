#!/usr/bin/env node
/**
 * SopKit SEO content lint — validates tools.json for thin / duplicate content.
 *
 * Flags:
 *   - description shorter than MIN_DESC chars
 *   - exact duplicate descriptions across tools
 *   - tools with no FAQs (thin for rich-result eligibility)
 *   - tools missing seoTitle / seoDescription
 *
 * Usage: node scripts/seo-content-lint.mjs  (--json)
 */

import { readFileSync, writeFileSync } from "fs";

const MIN_DESC = 100;
const json = JSON.parse(readFileSync("src/constants/tools.json", "utf8"));
const toolFaqs = JSON.parse(readFileSync("src/data/tool-faqs.json", "utf8"));
const categories = json.categories || {};
const tools = Object.values(categories).flatMap((c) => c.tools || []);

const issues = [];
const descSeen = new Map();

for (const t of tools) {
	const route = t.route || "(no route)";
	if (!t.description || t.description.length < MIN_DESC) {
		issues.push({ route, type: "thin-description", detail: `description ${t.description?.length ?? 0} < ${MIN_DESC} chars` });
	}
	if (t.description) {
		const key = t.description.trim().toLowerCase();
		if (descSeen.has(key)) {
			issues.push({ route, type: "duplicate-description", detail: `same as ${descSeen.get(key)}` });
		} else {
			descSeen.set(key, route);
		}
	}
	const faqs = toolFaqs[t.id] || t.faqs || [];
	if (!faqs || faqs.length === 0) {
		issues.push({ route, type: "no-faqs", detail: "no FAQ schema/visible FAQs" });
	}
	if (!t.seoTitle) issues.push({ route, type: "missing-seoTitle", detail: "no seoTitle" });
	if (!t.seoDescription) issues.push({ route, type: "missing-seoDescription", detail: "no seoDescription" });
}

const byType = issues.reduce((acc, i) => ((acc[i.type] = (acc[i.type] || 0) + 1), acc), {});
const summary = {
	totalTools: tools.length,
	issueCount: issues.length,
	byType,
	timestamp: new Date().toISOString(),
};

if (process.argv.includes("--json")) {
	writeFileSync("seo-content-lint-report.json", JSON.stringify({ ...summary, issues }, null, 2));
	console.log(JSON.stringify(summary, null, 2));
} else {
	console.log(`\n🔍 SEO content lint — ${tools.length} tools, ${issues.length} issues`);
	console.log("-".repeat(40));
	for (const [type, count] of Object.entries(byType)) console.log(`  ${type}: ${count}`);
	console.log("-".repeat(40));
	if (issues.length === 0) console.log("  ✓ No content issues found");
	else {
		console.log("  Samples:");
		issues.slice(0, 20).forEach((i) => console.log(`   - [${i.type}] ${i.route}: ${i.detail}`));
	}
}

process.exit(issues.length > 0 ? 1 : 0);
