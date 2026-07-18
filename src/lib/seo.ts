import type { Metadata } from "next";
import { getAllTools, getAllCategories } from "./tools";

/**
 * Centralized SEO utility for SopKit
 */

const BASE_URL = "https://sopkit.github.io";

/**
 * Normalize a URL to end with a single trailing slash. The site's canonical
 * URLs use trailing slashes (matching sitemap.ts), so every emitted URL should
 * be consistent to avoid duplicate-URL signals.
 */
function withSlash(url: string): string {
	return url.endsWith("/") ? url : `${url}/`;
}

interface MetadataProps {
	title: string;
	description: string;
	path?: string;
	image?: string;
	noIndex?: boolean;
	keywords?: string[];
}

/**
 * Global viral keyword injection: append trending AI keywords for every
 * generated metadata payload so that search signals across every page
 * reinforce the most-searched trending topics on the site.
 */
const TRENDING_VIRAL_KEYWORDS = [
	"kimi k3",
	"use kimi k3 for free",
	"kimi k3 free online",
	"kimi k3 moonshot ai",
	"how to use kimi k3",
	"kimi k3 free online playground",
	"kimi k3 vs chatgpt",
	"kimi k3 api price",
	"kimi k3 capabilities",
	"kimi k3 model weights",
	"kimi k3 download",
];

/**
 * Generate standard metadata for a page
 */
export function generateMetadata({
	title,
	description,
	path = "",
	image = "/og-image.jpg",
	noIndex = false,
	keywords = [],
}: MetadataProps & { keywords?: string[] }): Metadata {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	const canonicalUrl = withSlash(`${BASE_URL}${cleanPath}`);
	const mergedKeywords = [...new Set([...keywords, ...TRENDING_VIRAL_KEYWORDS])];

	return {
		title,
		description,
		keywords: mergedKeywords,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			siteName: "SopKit",
			locale: "en_US",
			type: "website",
			images: [
				{
					url: image.startsWith("http") ? image : `${BASE_URL}${image}`,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
			creator: "@sopkit",
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}

interface ToolMetadataProps {
	name: string;
	description?: string;
	route: string;
	category?: string;
	keywords?: string[];
}

/**
 * Generate privacy-first metadata for a tool page.
 *
 * Brand positioning (low-hanging fruit SEO strategy):
 *   - Compete against server-side tools (Smallpdf, iLovePDF, CloudConvert)
 *     that upload user data to their servers
 *   - Emphasize: client-side processing, no AI training, no data selling,
 *     100% browser sandbox, instant local execution
 *
 * Title pattern: "[Tool Name] — 100% Client-Side in Your Browser | No Upload, No AI Training | SopKit"
 * Description: Privacy-first, always mentions client-side + no upload + no AI training.
 */
export function generateToolMetadata({
	name,
	description,
	route,
	category,
	keywords = [],
}: ToolMetadataProps): Metadata {
	const cleanName = name.replace(/\s+—.*$/, "").replace(/^Free\s+/i, "").trim();
	const baseKeywords = [
		"private", "client-side", "no upload", "no AI training",
		"browser sandbox", "secure", cleanName.toLowerCase(),
		...(category ? [category] : []),
		"SopKit",
	];
	const allKeywords = [...new Set([...baseKeywords, ...keywords, ...TRENDING_VIRAL_KEYWORDS])].join(", ");

	const title = `${cleanName} — 100% Client-Side in Your Browser | No Upload, No AI Training | SopKit`;

	const desc = description && description.length > 80
		? description
		: `${cleanName} runs 100% client-side in your browser sandbox. Unlike server-side tools, your data never leaves your device — no uploads, no AI training, no data selling, no server storage. Fast, free, private, and secure.`;

	return generateMetadata({
		title,
		description: desc,
		path: route,
		image: "/og-image.jpg",
		keywords: [...new Set([...keywords, ...TRENDING_VIRAL_KEYWORDS])],
	});
}

interface SchemaProps {
	name: string;
	description: string;
	path: string;
	category?: string;
}

/**
 * Generate WebApplication JSON-LD
 */
export function generateWebAppSchema({
	name,
	description,
	path,
	category = "UtilitiesApplication",
}: SchemaProps) {
	return {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name,
		description,
		url: withSlash(`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`),
		applicationCategory: category,
		operatingSystem: "Any",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		author: {
			"@type": "Organization",
			name: "SopKit",
			url: BASE_URL,
		},
	};
}

interface FAQ {
	question: string;
	answer: string;
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQSchema(faqs: FAQ[]) {
	if (!faqs || faqs.length === 0) return null;

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

interface HowToStep {
	title: string;
	description: string;
	image?: string;
}

/**
 * Generate HowTo JSON-LD
 */
export function generateHowToSchema(steps: HowToStep[], toolName: string, toolUrl: string) {
	if (!steps || steps.length === 0) return null;

	return {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: `How to Use ${toolName}`,
		description: `Step-by-step guide on how to use ${toolName} online for free.`,
		step: steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.title,
			text: step.description,
			...(step.image && { image: step.image }),
		})),
		totalTime: "PT5M",
		tool: {
			"@type": "HowToTool",
			name: toolName,
		},
		supply: {
			"@type": "HowToSupply",
			name: "Web Browser",
		},
	};
}

interface BreadcrumbItem {
	name: string;
	path: string;
}

/**
 * Generate Breadcrumb JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
	if (!items || items.length === 0) return null;

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: withSlash(`${BASE_URL}${item.path}`),
		})),
	};
}

/**
 * Generate SoftwareApplication JSON-LD for tools
 * NOTE: Do NOT add aggregateRating unless there are real, verified reviews visible on the page.
 * Adding fake ratings violates Google's guidelines and undermines user trust.
 */
export function generateToolSchema({
	name,
	description,
	path,
	category = "UtilitiesApplication",
}: SchemaProps) {
	return {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name,
		description,
		url: withSlash(`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`),
		applicationCategory: category,
		operatingSystem: "Any",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		// aggregateRating removed - only include if there are real, verified page-specific reviews
	};
}

/**
 * Category-hub URL map: route-group key → canonical hub URL
 */
const CATEGORY_HUB_URLS: Record<string, string> = {
	image: `${BASE_URL}/image-tools`,
	pdf: `${BASE_URL}/pdf-tools`,
	video: `${BASE_URL}/video-tools`,
	audio: `${BASE_URL}/audio-tools`,
	text: `${BASE_URL}/text-tools`,
	seo: `${BASE_URL}/seo-tools`,
	developer: `${BASE_URL}/developer-tools`,
	utilities: `${BASE_URL}/other-tools`,
	generators: `${BASE_URL}/generators`,
	youtube: `${BASE_URL}/youtube-tools`,
	downloaders: `${BASE_URL}/all-downloaders`,
	calculators: `${BASE_URL}/calculators`,
	"exam-tools": `${BASE_URL}/exam-tools`,
};

/**
 * Generate a dynamic CollectionPage JSON-LD schema for a category.
 * Includes all tools in the category as ItemList entries.
 */
export function generateCollectionPageSchema(
	groupKey: string,
	overrides?: { name?: string; description?: string },
) {
	const tools = getAllTools();
	const categories = getAllCategories();
	const category = categories.find(
		(c) =>
			c.slug === groupKey ||
			c.slug === `${groupKey}-tools` ||
			// Handle irregular mappings like 'utilities' → 'utility-tools'
			c.slug === groupKey.replace(/ies$/, "y") + "-tools",
	);

	const categoryName =
		overrides?.name ||
		category?.name ||
		groupKey.charAt(0).toUpperCase() + groupKey.slice(1).replace(/-/g, " ") +
			" Tools";

	const categoryDescription =
		overrides?.description ||
		category?.description ||
		`Free online ${categoryName.toLowerCase()} for everyday tasks.`;

	const hubUrl = CATEGORY_HUB_URLS[groupKey] || `${BASE_URL}/${groupKey}`;

	const categoryTools = tools.filter(
		(t) =>
			t.category === groupKey ||
			t.category === `${groupKey}-tools` ||
			t.category === category?.slug,
	);

	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: categoryName,
		description: categoryDescription,
		url: withSlash(hubUrl),
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: categoryTools.length,
			itemListElement: categoryTools.slice(0, 50).map((tool, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: withSlash(`${BASE_URL}${tool.route}`),
				name: tool.name,
			})),
		},
	};
}
