// Measures how much of each tool page's prose is shared with other pages and
// writes src/data/content-uniqueness.json, which the site reads through
// src/data/content-curation.ts to decide whether a page's article, features,
// steps and FAQs are distinct enough to render and to mark up as FAQPage.
//
// Method: every document (one per MANUAL_TOOL_CONTENT id and one per
// seoOpportunities slug; an opportunity whose slug equals a tool id is merged
// into that tool's document because the page renders both) is lower-cased,
// split on whitespace and turned into a set of 6-word shingles. A shingle
// that appears in more than one document is "shared". A document's shared
// ratio is the fraction of its own shingles that are shared across the union.
// A document is curated when its shared ratio is below THRESHOLD and it has at
// least MIN_WORDS words, so short stubs never pass even when they are unique.
//
// Usage: bun run audit:content   (or: tsx scripts/audit-content-uniqueness.ts)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MANUAL_TOOL_CONTENT } from "../src/data/generated-manual-content";
import { seoOpportunities } from "../src/data/seo-opportunities";

const SHINGLE_SIZE = 6;
const THRESHOLD = 0.4;
const MIN_WORDS = 120;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(scriptDir, "..", "src", "data", "content-uniqueness.json");
const REGISTRY_PATH = path.join(scriptDir, "..", "src", "constants", "tools.json");

interface RegistryJson {
	categories?: Record<string, { tools?: { id: string }[] }>;
}

// Manual content can outlive a tool that was removed from the registry. Such
// entries are skipped (with a warning) so every curated id resolves to a page.
function loadRegistryIds(): Set<string> {
	const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")) as RegistryJson;
	const ids = Object.values(registry.categories ?? {}).flatMap((category) =>
		(category.tools ?? []).map((tool) => tool.id),
	);
	return new Set(ids);
}

interface DocStats {
	words: number;
	shared: number;
}

interface UniquenessReport {
	generated: string;
	threshold: number;
	minWords: number;
	curated: string[];
	stats: Record<string, DocStats>;
}

function tokenize(text: string): string[] {
	return text.toLowerCase().split(/\s+/).filter(Boolean);
}

function shinglesOf(words: string[]): Set<string> {
	const shingles = new Set<string>();
	for (let i = 0; i + SHINGLE_SIZE <= words.length; i++) {
		shingles.add(words.slice(i, i + SHINGLE_SIZE).join(" "));
	}
	return shingles;
}

function collectDocuments(registryIds: Set<string>): Map<string, string[]> {
	const docs = new Map<string, string[]>();
	const append = (id: string, parts: string[]) => {
		const existing = docs.get(id) ?? [];
		docs.set(id, [...existing, ...parts.filter(Boolean)]);
	};

	for (const [id, manual] of Object.entries(MANUAL_TOOL_CONTENT)) {
		if (!registryIds.has(id)) {
			console.warn(`Skipping manual content for "${id}": not in src/constants/tools.json`);
			continue;
		}
		append(id, [
			manual.whatItIs ?? "",
			...(manual.features ?? []),
			...((manual.howToUse?.steps ?? []).map((step) => `${step.name} ${step.text}`)),
			...((manual.faqs ?? []).map((faq) => `${faq.question} ${faq.answer}`)),
		]);
	}

	for (const opportunity of seoOpportunities) {
		append(opportunity.slug, [
			opportunity.intro,
			opportunity.intent,
			...opportunity.steps,
			...opportunity.useCases,
			...opportunity.commonProblems,
			...opportunity.faqs.map((faq) => `${faq.question} ${faq.answer}`),
		]);
	}

	return docs;
}

function computeStats(docs: Map<string, string[]>): Record<string, DocStats> {
	const ids = [...docs.keys()];
	const wordLists = ids.map((id) => tokenize(docs.get(id)!.join(" ")));
	const shingleSets = wordLists.map(shinglesOf);

	const occurrences = new Map<string, number>();
	for (const set of shingleSets) {
		for (const shingle of set) {
			occurrences.set(shingle, (occurrences.get(shingle) ?? 0) + 1);
		}
	}

	const stats: Record<string, DocStats> = {};
	ids.forEach((id, index) => {
		const set = shingleSets[index];
		let sharedCount = 0;
		for (const shingle of set) {
			if ((occurrences.get(shingle) ?? 0) > 1) sharedCount++;
		}
		stats[id] = {
			words: wordLists[index].length,
			// Round to three decimals so the JSON diff stays readable.
			shared: set.size ? Math.round((sharedCount / set.size) * 1000) / 1000 : 0,
		};
	});
	return stats;
}

function main(): void {
	const registryIds = loadRegistryIds();
	const docs = collectDocuments(registryIds);
	const stats = computeStats(docs);
	const curated = Object.entries(stats)
		.filter(([, s]) => s.shared < THRESHOLD && s.words >= MIN_WORDS)
		.map(([id]) => id)
		.sort();

	const report: UniquenessReport = {
		generated: new Date().toISOString(),
		threshold: THRESHOLD,
		minWords: MIN_WORDS,
		curated,
		stats,
	};

	fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, "\t")}\n`);

	const manualIds = new Set(Object.keys(MANUAL_TOOL_CONTENT).filter((id) => registryIds.has(id)));
	const opportunityIds = new Set(seoOpportunities.map((o) => o.slug));
	const curatedTools = curated.filter((id) => manualIds.has(id)).length;
	const curatedOpportunities = curated.filter((id) => opportunityIds.has(id)).length;

	console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)}`);
	console.log(`Documents: ${docs.size} (tools ${manualIds.size}, opportunities ${opportunityIds.size})`);
	console.log(`Curated: ${curated.length} total; ${curatedTools}/${manualIds.size} tools, ${curatedOpportunities}/${opportunityIds.size} opportunities`);
	console.log(`Rule: shared < ${THRESHOLD} and words >= ${MIN_WORDS}`);
}

main();
