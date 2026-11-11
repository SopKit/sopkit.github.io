// Single entry point for the content-uniqueness audit output. Pages and
// structured-data builders ask this module whether a tool or opportunity has
// prose distinct enough to render, instead of importing the JSON themselves.
// Regenerate the JSON with `bun run audit:content`.

import contentUniqueness from "@/data/content-uniqueness.json";

interface ContentUniquenessReport {
	generated: string;
	threshold: number;
	minWords?: number;
	curated: string[];
	stats: Record<string, { words: number; shared: number }>;
}

const report = contentUniqueness as ContentUniquenessReport;
const curatedIds: ReadonlySet<string> = new Set(report.curated);

// True when the audit judged this id's prose unique enough to publish. The id
// is a registry tool id or an SEO opportunity slug (standalone opportunity
// pages use their slug as the synthetic tool id).
export function isCuratedContent(id: string): boolean {
	return curatedIds.has(id);
}

export function getCuratedContentIds(): readonly string[] {
	return report.curated;
}
