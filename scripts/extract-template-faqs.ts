/**
 * @file scripts/extract-template-faqs.ts
 * @description Lists every tool that still carries the four name-interpolated
 * template FAQs, so a rewrite wave can replace them with unique Q&As.
 *
 * Output: ~/claude-seo/faqs/templates.json (override with OUT_DIR), shaped:
 *   { "<tool-id>": {
 *       "category": "...",
 *       "existing": [{ "question", "answer" }, ...],   // the template Q&As found
 *       "dupQuestions": ["..."]                        // exact-duplicate questions
 *   }, ... }                                            // shared with other tools
 *
 * Usage: npx tsx scripts/extract-template-faqs.ts
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MANUAL_TOOL_CONTENT } from "../src/data/generated-manual-content";

const OUT_DIR = process.env.OUT_DIR || path.join(os.homedir(), "claude-seo", "faqs");

const TEMPLATE_FAQ_PATTERNS = [
	/^What exactly does .+ do\?$/,
	/^Is .+ really free\? Are there any hidden charges\?$/,
	/^Do I need to create an account or sign up to use .+\?$/,
	/^Can I use .+ on mobile devices or tablets\?$/,
];

async function main() {
	// Category lookup from the registry (best effort; ids present in one source
	// but not the other still get extracted).
	const categoryById = new Map<string, string>();
	try {
		const toolsJson = JSON.parse(
			fs.readFileSync(
				path.join(process.cwd(), "src/constants/tools.json"),
				"utf8",
			),
		);
		for (const [cat, value] of Object.entries(toolsJson.categories)) {
			for (const t of (value as { tools?: { id: string }[] }).tools || []) {
				categoryById.set(t.id, cat);
			}
		}
	} catch {
		console.warn("(could not read tools.json for category names; continuing)");
	}

	// Map question -> ids that contain it (for exact-duplicate detection).
	const questionOwners = new Map<string, string[]>();
	for (const [id, entry] of Object.entries(MANUAL_TOOL_CONTENT)) {
		for (const f of entry.faqs) {
			const owners = questionOwners.get(f.question) || [];
			owners.push(id);
			questionOwners.set(f.question, owners);
		}
	}

	const result: Record<
		string,
		{ category: string; existing: { question: string; answer: string }[]; dupQuestions: string[] }
	> = {};
	const familyCounts = new Array(TEMPLATE_FAQ_PATTERNS.length).fill(0);

	for (const [id, entry] of Object.entries(MANUAL_TOOL_CONTENT)) {
		const existing = entry.faqs.filter((f) =>
			TEMPLATE_FAQ_PATTERNS.some((p) => p.test(f.question)),
		);
		entry.faqs.forEach((f) => {
			TEMPLATE_FAQ_PATTERNS.forEach((p, i) => {
				if (p.test(f.question)) familyCounts[i]++;
			});
		});
		const dupQuestions = entry.faqs
			.map((f) => f.question)
			.filter((q) => (questionOwners.get(q)?.length || 0) > 1);
		if (existing.length === 0 && dupQuestions.length === 0) continue;
		result[id] = {
			category: categoryById.get(id) || "unknown",
			existing,
			dupQuestions,
		};
	}

	fs.mkdirSync(OUT_DIR, { recursive: true });
	const outFile = path.join(OUT_DIR, "templates.json");
	fs.writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);

	const ids = Object.keys(result);
	console.log(`✓ Wrote ${outFile}`);
	console.log(`  tools with template/duplicate FAQs: ${ids.length}`);
	console.log(
		`  family counts: ${familyCounts.map((c, i) => `#${i + 1}=${c}`).join(", ")}`,
	);

	// Category breakdown
	const byCat = new Map<string, number>();
	for (const id of ids) {
		const c = result[id].category;
		byCat.set(c, (byCat.get(c) || 0) + 1);
	}
	console.log(
		`  by category: ${[...byCat.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([c, n]) => `${c}=${n}`)
			.join(", ")}`,
	);

	// Exact duplicate questions that are NOT template families
	const exactDupes = [...questionOwners.entries()].filter(
		([q, owners]) =>
			owners.length > 1 && !TEMPLATE_FAQ_PATTERNS.some((p) => p.test(q)),
	);
	console.log(`  exact-duplicate questions outside families: ${exactDupes.length}`);
	for (const [q, owners] of exactDupes.slice(0, 15)) {
		console.log(`    "${q.slice(0, 70)}" × ${owners.length} (${owners.slice(0, 3).join(", ")})`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
