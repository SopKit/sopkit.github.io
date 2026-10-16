#!/usr/bin/env node
/**
 * Applies seoDescription rewrites to src/constants/tools.json.
 *
 * Usage:
 *   node scripts/apply-seo-descriptions.mjs [--dry-run] [descriptions-dir]
 *
 * Reads every batch-*.json in the descriptions directory (default
 * ~/claude-seo/descriptions, override with DESCRIPTIONS_DIR or a positional
 * argument). Each file is shaped { "<tool-id>": "<meta description>" }.
 *
 * Every description must be 140-165 characters so the metadata formatter
 * (formatSeoDescription in src/seo/metadata.ts) passes it through untouched
 * instead of appending its shared boilerplate sentence.
 *
 * tools.json is round-trip safe: it is byte-identical to
 * JSON.stringify(data, null, 2) + "\n", verified before first use.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const MIN_LEN = 140;
const MAX_LEN = 165;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const positional = args.filter((a) => !a.startsWith("--"));
const dir =
	positional[0] ||
	process.env.DESCRIPTIONS_DIR ||
	path.join(os.homedir(), "claude-seo", "descriptions");
const toolsPath = path.join(process.cwd(), "src", "constants", "tools.json");

if (!fs.existsSync(dir)) {
	console.error(`✗ descriptions directory not found: ${dir}`);
	process.exit(1);
}

const batchFiles = fs
	.readdirSync(dir)
	.filter((f) => /^batch-\d+\.json$/.test(f))
	.sort((a, b) => {
		const na = Number(a.match(/\d+/)[0]);
		const nb = Number(b.match(/\d+/)[0]);
		return na - nb;
	});

if (batchFiles.length === 0) {
	console.error(`✗ no batch-*.json files found in ${dir}`);
	process.exit(1);
}

/** @type {Map<string, string>} */
const rewrites = new Map();
for (const f of batchFiles) {
	const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
	for (const [id, desc] of Object.entries(data)) {
		if (typeof desc !== "string" || desc.trim().length === 0) {
			console.error(`✗ ${f}: empty description for ${id}`);
			process.exit(1);
		}
		if (rewrites.has(id)) {
			console.error(`✗ duplicate id across batch files: ${id}`);
			process.exit(1);
		}
		rewrites.set(id, desc);
	}
	console.log(`  loaded ${Object.keys(data).length} descriptions from ${f}`);
}

// Length validation
const lengthViolations = [];
for (const [id, desc] of rewrites) {
	if (desc.length < MIN_LEN || desc.length > MAX_LEN) {
		lengthViolations.push(`${id}: ${desc.length} chars`);
	}
}
if (lengthViolations.length > 0) {
	console.error(`✗ ${lengthViolations.length} descriptions outside ${MIN_LEN}-${MAX_LEN} chars:`);
	for (const v of lengthViolations.slice(0, 20)) console.error(`    ${v}`);
	process.exit(1);
}

// Duplicate value detection (same description reused for several tools)
const byValue = new Map();
for (const [id, desc] of rewrites) {
	if (!byValue.has(desc)) byValue.set(desc, []);
	byValue.get(desc).push(id);
}
const dupes = [...byValue.entries()].filter(([, ids]) => ids.length > 1);
if (dupes.length > 0) {
	console.error(`✗ ${dupes.length} descriptions reused across multiple tools:`);
	for (const [, ids] of dupes.slice(0, 10)) console.error(`    ${ids.join(", ")}`);
	process.exit(1);
}

// Apply to tools.json
const raw = fs.readFileSync(toolsPath, "utf8");
const data = JSON.parse(raw);
const index = new Map();
for (const cat of Object.values(data.categories)) {
	for (const t of cat.tools || []) index.set(t.id, t);
}

let applied = 0;
const notFound = [];
for (const [id, desc] of rewrites) {
	const tool = index.get(id);
	if (!tool) {
		notFound.push(id);
		continue;
	}
	tool.seoDescription = desc;
	applied++;
}

if (notFound.length > 0) {
	console.error(`✗ ${notFound.length} ids not found in tools.json: ${notFound.join(", ")}`);
	process.exit(1);
}

const out = `${JSON.stringify(data, null, 2)}\n`;
if (dryRun) {
	const changed = raw !== out;
	console.log(
		`[dry-run] would update ${applied} descriptions | file changes: ${changed ? "yes" : "no"}`,
	);
} else {
	if (raw === out) {
		console.log(`No changes needed (${applied} descriptions already match).`);
	} else {
		fs.writeFileSync(toolsPath, out);
		console.log(`✓ Updated ${applied} descriptions in src/constants/tools.json`);
	}
}
