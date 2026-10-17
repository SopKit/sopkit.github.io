/**
 * @file scripts/apply-content-rewrites.ts
 * @description Surgically replaces entries in src/data/generated-manual-content.ts
 * with rewritten content produced as JSON files by content rewrite batches.
 *
 * Default mode (features + privacy FAQ):
 *   Input: JSON files under a rewrites directory (default ~/claude-seo/rewrites),
 *   each shaped:
 *     { "<tool-id>": { "features": string[], "privacyFaq": { "question", "answer" } } }
 *   For every id:
 *     - features are replaced with the rewritten list
 *     - the templated privacy FAQ (if present) is replaced with the unique one,
 *       otherwise the unique FAQ is appended
 *     - every other field (whatItIs, howToUse, other faqs, seoDescription) is preserved
 *
 * FAQ mode (--faq; template family replacement):
 *   Input: JSON files under a directory (default ~/claude-seo/faqs), each shaped:
 *     { "<tool-id>": { "faqs": [{ "question", "answer" }, ...], "removeQuestions"?: string[] } }
 *   For every id:
 *     - the four name-interpolated template questions (and any question listed in
 *       removeQuestions) are removed
 *     - the rewritten faqs are inserted where the first template question sat,
 *       so the unique privacy FAQ and any hand-written FAQs keep their order
 *     - features and all other fields are preserved
 *
 * The entry block boundaries are located with a string-aware brace scanner so
 * only replaced entries change in the generated content file.
 *
 * Usage:
 *   npx tsx scripts/apply-content-rewrites.ts [--dry-run]
 *   npx tsx scripts/apply-content-rewrites.ts --faq [--dry-run]
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MANUAL_TOOL_CONTENT } from "../src/data/generated-manual-content";

const FILE = path.join(process.cwd(), "src/data/generated-manual-content.ts");
const FAQ_MODE = process.argv.includes("--faq");
const WHATITIS_MODE = process.argv.includes("--whatitis");
const DRY_RUN = process.argv.includes("--dry-run");
const REWRITES_DIR = FAQ_MODE
	? process.env.FAQ_REWRITES_DIR || path.join(os.homedir(), "claude-seo", "faqs")
	: WHATITIS_MODE
		? process.env.WHATITIS_REWRITES_DIR || path.join(os.homedir(), "claude-seo", "whatitis")
		: process.env.REWRITES_DIR || path.join(os.homedir(), "claude-seo", "rewrites");

const BOILERPLATE_QUESTIONS = [
	"How does SopKit protect my privacy when I use this tool?",
	"How does SopKit protect my privacy?",
];

/** Name-interpolated FAQ templates that ship on ~520 tools. */
export const TEMPLATE_FAQ_PATTERNS = [
	/^What exactly does .+ do\?$/,
	/^Is .+ really free\? Are there any hidden charges\?$/,
	/^Do I need to create an account or sign up to use .+\?$/,
	/^Can I use .+ on mobile devices or tablets\?$/,
];

interface Rewrite {
	features: string[];
	privacyFaq: { question: string; answer: string };
}

interface FaqRewrite {
	faqs: { question: string; answer: string }[];
	removeQuestions?: string[];
}

interface ManualEntry {
	whatItIs: string;
	features: string[];
	howToUse: { name: string; steps: { name: string; text: string }[] };
	faqs: { question: string; answer: string }[];
	seoDescription: string;
}

/** Find the index of the `}` that closes the object opened at `startBrace`. */
function findEntryEnd(src: string, startBrace: number): number {
	let i = startBrace;
	let depth = 0;
	while (i < src.length) {
		const c = src[i];
		if (c === '"' || c === "'" || c === "`") {
			const quote = c;
			i++;
			while (i < src.length) {
				const d = src[i];
				if (d === "\\") {
					i += 2;
					continue;
				}
				if (d === quote) break;
				i++;
			}
			i++;
			continue;
		}
		if (c === "{") depth++;
		else if (c === "}") {
			depth--;
			if (depth === 0) return i;
		}
		i++;
	}
	throw new Error("Unterminated entry block while scanning.");
}

function loadRewrites<T>(): Map<string, T> {
	const updates = new Map<string, T>();
	if (!fs.existsSync(REWRITES_DIR)) {
		throw new Error(`Rewrites directory not found: ${REWRITES_DIR}`);
	}
	const files = fs
		.readdirSync(REWRITES_DIR)
		.filter((f) => f.endsWith(".json"))
		.filter((f) => (FAQ_MODE || WHATITIS_MODE ? /^batch-\d+\.json$/.test(f) : true))
		.sort();
	for (const file of files) {
		const data = JSON.parse(
			fs.readFileSync(path.join(REWRITES_DIR, file), "utf8"),
		) as Record<string, T>;
		for (const [id, value] of Object.entries(data)) {
			updates.set(id, value);
		}
		console.log(`  loaded ${Object.keys(data).length} rewrites from ${file}`);
	}
	return updates;
}

/** Replace the `<id>` entry block in `source` with a serialized `newValue`. */
function spliceEntry(
	source: string,
	id: string,
	newValue: ManualEntry,
): string | null {
	const anchor = `\n  "${id}": {`;
	const at = source.indexOf(anchor);
	if (at === -1) return null;
	const start = at + 1;
	const braceIdx = at + anchor.length - 1;
	const endBrace = findEntryEnd(source, braceIdx);

	const body = JSON.stringify(newValue, null, 2)
		.split("\n")
		.map((line, idx) => (idx === 0 ? line : `  ${line}`))
		.join("\n");
	const block = `  "${id}": ${body},\n`;

	let end = endBrace + 1;
	if (source[end] === ",") end++;
	if (source[end] === "\r") end++;
	if (source[end] === "\n") end++;

	return source.slice(0, start) + block + source.slice(end);
}

function applyContentRewrites(): void {
	console.log("🔧 Applying content rewrites to generated-manual-content.ts\n");
	const rewrites = loadRewrites<Rewrite>();
	console.log(`Total rewrites loaded: ${rewrites.size}\n`);

	let source = fs.readFileSync(FILE, "utf8");
	let applied = 0;
	const skipped: string[] = [];

	for (const [id, rewrite] of rewrites) {
		const old = MANUAL_TOOL_CONTENT[id] as ManualEntry | undefined;
		if (!old) {
			skipped.push(`${id} (unknown id)`);
			continue;
		}
		if (!Array.isArray(rewrite.features) || rewrite.features.length < 5) {
			skipped.push(`${id} (invalid features)`);
			continue;
		}
		if (!rewrite.privacyFaq?.question || !rewrite.privacyFaq?.answer) {
			skipped.push(`${id} (invalid privacy faq)`);
			continue;
		}

		// Build the replacement value, preserving everything else.
		const hadBoilerplate = old.faqs.some((q) =>
			BOILERPLATE_QUESTIONS.includes(q.question),
		);
		let faqs = old.faqs.map((q) =>
			BOILERPLATE_QUESTIONS.includes(q.question) ? rewrite.privacyFaq : q,
		);
		if (!hadBoilerplate && !faqs.some((q) => q.question === rewrite.privacyFaq.question)) {
			faqs = [...faqs, rewrite.privacyFaq];
		}
		const newValue: ManualEntry = {
			...old,
			features: rewrite.features,
			faqs,
		};

		const next = spliceEntry(source, id, newValue);
		if (next === null) {
			skipped.push(`${id} (anchor not found)`);
			continue;
		}
		source = next;
		applied++;
	}

	if (!DRY_RUN) {
		fs.writeFileSync(FILE, source);
	}
	console.log(
		`${DRY_RUN ? "[dry-run] Would apply" : "Applied"} ${applied} rewrites.`,
	);
	if (skipped.length) {
		console.log(`Skipped ${skipped.length}: ${skipped.join(", ")}`);
	}
}

function applyFaqRewrites(): void {
	console.log("🔧 Applying FAQ family rewrites to generated-manual-content.ts\n");
	const rewrites = loadRewrites<FaqRewrite>();
	console.log(`Total FAQ rewrites loaded: ${rewrites.size}\n`);

	const isTemplate = (question: string, extra: string[] | undefined): boolean =>
		TEMPLATE_FAQ_PATTERNS.some((p) => p.test(question)) ||
		(extra?.includes(question) ?? false);

	let source = fs.readFileSync(FILE, "utf8");
	let applied = 0;
	const skipped: string[] = [];

	for (const [id, rewrite] of rewrites) {
		const old = MANUAL_TOOL_CONTENT[id] as ManualEntry | undefined;
		if (!old) {
			skipped.push(`${id} (unknown id)`);
			continue;
		}
		if (
			!Array.isArray(rewrite.faqs) ||
			rewrite.faqs.length < 2 ||
			rewrite.faqs.some((f) => !f?.question || !f?.answer)
		) {
			skipped.push(`${id} (invalid faqs)`);
			continue;
		}
		if (
			rewrite.faqs.some((f) =>
				TEMPLATE_FAQ_PATTERNS.some((p) => p.test(f.question)),
			)
		) {
			skipped.push(`${id} (new faq still matches template pattern)`);
			continue;
		}

		// Idempotence guard: if every new question is already present, this
		// entry was applied in an earlier run — never insert duplicates.
		const alreadyApplied = rewrite.faqs.every((f) =>
			old.faqs.some((q) => q.question === f.question),
		);
		if (alreadyApplied) {
			skipped.push(`${id} (already applied)`);
			continue;
		}

		const firstTemplateIdx = old.faqs.findIndex((q) =>
			isTemplate(q.question, rewrite.removeQuestions),
		);
		if (firstTemplateIdx === -1 && rewrite.faqs.length === 0) {
			skipped.push(`${id} (no template faq found)`);
			continue;
		}
		const remaining = old.faqs.filter(
			(q) => !isTemplate(q.question, rewrite.removeQuestions),
		);
		const insertAt =
			firstTemplateIdx === -1
				? remaining.length
				: Math.min(firstTemplateIdx, remaining.length);
		const faqs = [
			...remaining.slice(0, insertAt),
			...rewrite.faqs,
			...remaining.slice(insertAt),
		];

		const newValue: ManualEntry = { ...old, faqs };

		const next = spliceEntry(source, id, newValue);
		if (next === null) {
			skipped.push(`${id} (anchor not found)`);
			continue;
		}
		source = next;
		applied++;
	}

	if (!DRY_RUN) {
		fs.writeFileSync(FILE, source);
	}
	console.log(
		`${DRY_RUN ? "[dry-run] Would apply" : "Applied"} ${applied} FAQ rewrites.`,
	);
	if (skipped.length) {
		console.log(`Skipped ${skipped.length}: ${skipped.join(", ")}`);
	}
}

function applyWhatItisRewrites(): void {
	console.log("🔧 Applying whatItIs article rewrites to generated-manual-content.ts\n");
	const rewrites = loadRewrites<string | { whatItIs: string }>();
	console.log(`Total whatItIs rewrites loaded: ${rewrites.size}\n`);

	let source = fs.readFileSync(FILE, "utf8");
	let applied = 0;
	const skipped: string[] = [];

	for (const [id, raw] of rewrites) {
		const old = MANUAL_TOOL_CONTENT[id] as ManualEntry | undefined;
		if (!old) {
			skipped.push(`${id} (unknown id)`);
			continue;
		}
		const value = typeof raw === "string" ? raw : raw?.whatItIs;
		if (typeof value !== "string" || value.trim().length < 400) {
			skipped.push(`${id} (invalid article)`);
			continue;
		}
		if ((old.whatItIs || "").trim() === value.trim()) {
			skipped.push(`${id} (already applied)`);
			continue;
		}
		const next = spliceEntry(source, id, { ...old, whatItIs: value });
		if (next === null) {
			skipped.push(`${id} (anchor not found)`);
			continue;
		}
		source = next;
		applied++;
	}

	if (!DRY_RUN) {
		fs.writeFileSync(FILE, source);
	}
	console.log(
		`${DRY_RUN ? "[dry-run] Would apply" : "Applied"} ${applied} whatItIs rewrites.`,
	);
	if (skipped.length) {
		console.log(`Skipped ${skipped.length}: ${skipped.join(", ")}`);
	}
}

if (FAQ_MODE) applyFaqRewrites();
else if (WHATITIS_MODE) applyWhatItisRewrites();
else applyContentRewrites();
