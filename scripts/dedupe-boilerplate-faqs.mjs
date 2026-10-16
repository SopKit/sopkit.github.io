#!/usr/bin/env node
/**
 * Removes templated boilerplate FAQ entries that are duplicated across
 * hundreds of tool entries in the manual content map.
 *
 * The generator previously appended the same privacy question to ~520 tools,
 * with an answer produced by string interpolation. That violates the repo
 * anti-spam rules (no shared FAQ blocks, no runtime name templating) and
 * creates site-wide duplicate content.
 *
 * This script performs a line-level removal of single-line FAQ objects whose
 * question matches the known boilerplate questions. It is safe to re-run.
 *
 * Usage: node scripts/dedupe-boilerplate-faqs.mjs
 */

import fs from "node:fs";

const FILE = "src/data/generated-manual-content.ts";

/** Questions that were appended by the generator to hundreds of entries. */
const BOILERPLATE_QUESTIONS = [
	"How does SopKit protect my privacy when I use this tool?",
	"How does SopKit protect my privacy?",
];

const source = fs.readFileSync(FILE, "utf8");
const lines = source.split("\n");
const kept = [];
let removed = 0;
let multilineHits = 0;

for (const line of lines) {
	const trimmed = line.trim();
	const isFaqObject =
		trimmed.startsWith("{ question:") || trimmed.startsWith('"question"');
	const matchesBoilerplate = BOILERPLATE_QUESTIONS.some((q) =>
		line.includes(q),
	);

	if (matchesBoilerplate && isFaqObject) {
		// Single-line FAQ object -> drop the whole line.
		removed++;
		continue;
	}
	if (matchesBoilerplate && !isFaqObject) {
		// Hit outside a single-line FAQ object: needs manual review.
		multilineHits++;
	}
	kept.push(line);
}

if (removed > 0) {
	fs.writeFileSync(FILE, kept.join("\n"));
}

console.log(
	[`Removed ${removed} boilerplate FAQ line(s).`, `Manual-review hits: ${multilineHits}.`].join(
		"\n",
	),
);
