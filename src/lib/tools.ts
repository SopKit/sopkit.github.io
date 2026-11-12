import toolsData from "@/constants/tools.json";

export { STATIC_ROUTES } from "@/constants/routes";

export const SUPPORTED_LANGUAGES = [
	"en", "es", "fr", "de", "hi", "it", "pt", "ja", "zh", "ko", "ru", "tr", "vi", "id"
];

export interface Tool {
	id: string;
	name: string;
	description: string;
	route: string;
	category: string;
	slug?: string;
	path?: string;
	popular?: boolean;
	seoTitle?: string;
	seoDescription?: string;
	categoryKey?: string;
	categoryName?: string;
	categorySlug?: string;
	executionType?: "client" | "external" | "hybrid" | "server";
	providerName?: string;
	dataTransmissionNotice?: string;
	isCredentialSensitive?: boolean;
	// Prose fields stay optional: curated prose comes from MANUAL_TOOL_CONTENT
	// (src/data/generated-manual-content.ts) at render time, gated by the
	// content-uniqueness audit. The registry itself carries none of it.
	features?: string[];
	howTo?: {
		name?: string;
		steps?: { name: string; text: string; url?: string }[];
	};
	faqs?: { question: string; answer: string }[];
	author?: any;
	reviews?: any[];
	article?: string;
	datePublished?: string;
}

export interface SearchToolRecord {
	id: string;
	name: string;
	route: string;
	category: string;
	description?: string;
	popular?: boolean;
	executionType?: "client" | "external" | "hybrid" | "server";
}

export type ToolItem = Tool;

export interface Category {
	name: string;
	slug: string;
	icon: string;
	description: string;
	tools: Tool[];
}

export const categories = toolsData.categories as unknown as Record<string, Category>;

let cachedAllTools: Tool[] | null = null;

export function getAllTools(): Tool[] {
	if (cachedAllTools) return cachedAllTools;
	cachedAllTools = Object.entries(categories).flatMap(([catKey, cat]) => {
		const catSlug = cat?.slug || catKey;
		const catName = cat?.name || catKey;
		return (cat?.tools || []).map((t) => ({
			...t,
			category: t.category || catSlug,
			categorySlug: t.categorySlug || catSlug,
			categoryName: t.categoryName || catName,
			categoryKey: t.categoryKey || catKey,
		}));
	});
	return cachedAllTools;
}

export function getSearchToolRecords(): SearchToolRecord[] {
	return Object.entries(categories).flatMap(([catKey, cat]) => {
		const catSlug = cat?.slug || catKey;
		return (cat?.tools || []).map((t) => ({
			id: t.id,
			name: t.name,
			route: t.route,
			category: t.category || catSlug,
			description: t.description,
			popular: t.popular,
			executionType: t.id === "ai-image-generator" ? "external" : "client",
		}));
	});
}

export function getToolByRoute(route: string): Tool | undefined {
	return getAllTools().find((t) => t.route === route);
}

export function getToolById(id: string): Tool | undefined {
	return getAllTools().find((t) => t.id === id);
}

export function getAllCategories(): Category[] {
	return Object.values(categories);
}

export function getAllToolsByCategory(categorySlug: string): Tool[] {
	const category = getCategoryBySlug(categorySlug);
	return category ? category.tools : [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
	// 1. Exact slug match — this is what tool-guides/[slug] passes
	// (generateStaticParams emits category.slug values), so it must win.
	const exact = getAllCategories().find((category) => category.slug === slug);
	if (exact) return exact;

	// 2. tools.json key match. Hub pages historically pass the registry key
	// (e.g. "utilities"), which differs from the slug ("utility-tools") for
	// some categories. Object.values() loses the key, so match on entries.
	const byKey = Object.entries(categories).find(([key]) => key === slug);
	if (byKey) return byKey[1] as Category;

	// 3. Slug with/without the "-tools" suffix normalised. Hub pages pass
	// bare names ("audio", "seo", "video", "youtube", "developer",
	// "extraction", "text") while the registry slug carries "-tools".
	// Both the keys and the normalised slugs are unique in the registry,
	// so this fallback cannot resolve to the wrong category; it only
	// rescues lookups that previously returned undefined and rendered an
	// empty hub grid. Unknown slugs still return undefined.
	const normalised = slug.replace(/-tools$/, "");
	return getAllCategories().find(
		(category) =>
			category.slug === `${normalised}-tools` ||
			category.slug.replace(/-tools$/, "") === normalised,
	);
}

/**
 * Returns the route for a tool by its ID.
 * If the ID is not found, returns "/" as a fallback.
 */
export function getRouteById(id: string): string {
	const tool = getToolById(id);
	return tool ? tool.route : "/";
}

const RELATED_INTENTS = ["converter", "downloader", "generator", "tester", "validator", "compressor", "calculator"];

function hasIntent(tool: Tool, intent: string): boolean {
	return tool.id.toLowerCase().includes(intent) || tool.name.toLowerCase().includes(intent);
}

/**
 * Related tools for a tool page. Same-category tools come first, rotated so
 * the list starts at the tool's own neighbours (by index within the category)
 * instead of always the first N tools of that category; the rotation is
 * deterministic, so static export output is stable. Popular tools from other
 * categories fill the remainder.
 */
export function getRelatedTools(tool: Tool, limit: number = 10): Tool[] {
	if (!tool) return [];

	const allTools = getAllTools();
	const sameCategory = allTools.filter((t) => t.category === tool.category);
	const selfIndex = Math.max(0, sameCategory.findIndex((t) => t.id === tool.id));
	const neighbours = [
		...sameCategory.slice(selfIndex + 1),
		...sameCategory.slice(0, selfIndex),
	].filter((t) => t.id !== tool.id);

	const toolIntent = RELATED_INTENTS.find((intent) => hasIntent(tool, intent));
	const byIntent = (list: Tool[]): Tool[] => {
		if (!toolIntent) return list;
		// Stable partition: same-intent neighbours first, order otherwise kept.
		return [...list.filter((t) => hasIntent(t, toolIntent)), ...list.filter((t) => !hasIntent(t, toolIntent))];
	};

	const popularOthers = allTools.filter((t) => t.category !== tool.category && t.popular && t.id !== tool.id);

	return [...byIntent(neighbours), ...byIntent(popularOthers)].slice(0, limit);
}
