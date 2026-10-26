import { getAllCategories, getAllTools, type Tool } from "@/lib/tools";
import { LAST_UPDATED, SITE_URL } from "@/constants/config";
import { buildCanonicalUrl } from "@/seo/canonical";

const allCategories = getAllCategories();
const allTools = getAllTools();
const TOOL_COUNT = allTools.length;
const CATEGORY_COUNT = allCategories.length;

const categoryLookup = Object.fromEntries(
	allCategories.map((category) => [
		category.slug,
		{ name: category.name, slug: category.slug },
	]),
);

const CATEGORY_HUB_ROUTES: Record<string, string> = {
	// Keyed by registry category SLUG (category.slug), because that is
	// what callers pass: categoryLookup is keyed by slug, and the tool
	// branch below resolves toolCategorySlug from it. The previous map
	// was keyed by bare names ("image", "pdf", ...), which never matched
	// a slug like "image-tools", so getCategoryHubUrl fell through to
	// `/${slug}-tools` and emitted dead JSON-LD category URLs such as
	// /image-tools-tools on nearly every tool page. Only "generators"
	// and "calculators" ever matched, because their slug equals the key.
	"image-tools": "/image-tools",
	"pdf-tools": "/pdf-tools",
	"video-tools": "/video-tools",
	"audio-tools": "/audio-tools",
	"seo-tools": "/seo-tools",
	"text-tools": "/text-tools",
	"developer-tools": "/developer-tools",
	// The utilities registry key is "utilities" but its slug is
	// "utility-tools", and its hub page is /other-tools.
	"utility-tools": "/other-tools",
	"generators": "/generators",
	"calculators": "/calculators",
	"youtube-tools": "/youtube-tools",
	"ai-tools": "/ai-tools",
	"other-tools": "/other-tools",
	"exam-tools": "/exam-tools",
	"extraction-tools": "/extraction-tools",
	// The guides registry key is "content" but its slug is "guides",
	// and its listing page is /tool-guides.
	"guides": "/tool-guides",
};

// Registry category slugs with no hub page at all. getCategoryHubUrl
// returns null for these instead of inventing a URL, and callers omit
// the URL (a name-only breadcrumb/collection item) rather than linking
// to a 404. company: 2 tools, no company hub page; health: 5 tools,
// no health hub page; privacy-tools: 23 tools, no privacy hub page
// (/privacy is the policy page, not a hub); blog: 0 tools.
const NO_HUB_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
	"company",
	"health",
	"privacy-tools",
	"blog",
]);

function getCategoryHubUrl(categorySlug: string): string | null {
	// Known hub-less categories return null explicitly; any other
	// unmapped slug also returns null (never a guessed URL), and the
	// validator fails on unmapped registry slugs that are not listed
	// in NO_HUB_CATEGORY_SLUGS, so an unknown slug cannot slip in.
	if (NO_HUB_CATEGORY_SLUGS.has(categorySlug)) return null;
	return CATEGORY_HUB_ROUTES[categorySlug] ?? null;
}

interface StructuredDataProps {
	tool?: Tool;
	includeFAQ?: boolean;
	isHome?: boolean;
	isArchive?: boolean;
}

export default function StructuredData({ 
	tool, 
	includeFAQ = true,
	isHome = false,
	isArchive = false,
}: StructuredDataProps) {
	if (tool) {
		const categoryDetails =
			categoryLookup[tool.category] || categoryLookup[tool.categorySlug || ""] || null;
		
		const toolUrl = buildCanonicalUrl(tool.route);
		
		const toolCategoryName =
			categoryDetails?.name || tool.categoryName || "Utilities";
		const toolCategorySlug = categoryDetails?.slug || tool.category || "utilities";
		
		const categoryHubRoute = getCategoryHubUrl(toolCategorySlug);
		const toolCategoryUrl = categoryHubRoute
			? buildCanonicalUrl(categoryHubRoute)
			: null;

		const toolStructuredData: Record<string, any> = {
			"@context": "https://schema.org",
			"@type": ["SoftwareApplication", "WebApplication"],
			name: tool.name,
			description: tool.description,
			applicationCategory: toolCategoryName,
			operatingSystem: "All",
			browserRequirements: "Requires any modern web browser with JavaScript enabled.",
			url: toolUrl,
			isAccessibleForFree: true,
			inLanguage: "en",
			screenshot: `${SITE_URL}/og-image.png`,
			dateModified: LAST_UPDATED,
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
			},
			creator: {
				"@type": "Organization",
				name: "SopKit",
				url: `${SITE_URL}/`,
				logo: `${SITE_URL}/favicon.ico`,
			},
			provider: {
				"@type": "Organization",
				name: "SopKit",
				url: `${SITE_URL}/`,
			},
			featureList: tool.features
				? tool.features.join(", ")
				: "Free online tool",
		};

		// Add AggregateRating only if tool has genuine, validated reviews (never default missing to 5)
		if (tool.reviews && tool.reviews.length > 0) {
			const validReviews = tool.reviews.filter(
				(r: any) => typeof r?.rating === "number" && r.rating >= 1 && r.rating <= 5
			);
			if (validReviews.length > 0) {
				const totalRating = validReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
				const avgRating = totalRating / validReviews.length;
				toolStructuredData.aggregateRating = {
					"@type": "AggregateRating",
					ratingValue: avgRating.toFixed(1),
					reviewCount: validReviews.length,
					bestRating: "5",
					worstRating: "1",
				};
			}
		}

		// Fallback to capability-aware default FAQs if tool has no FAQs defined
		const faqsToUse = tool.faqs && tool.faqs.length > 0
			? tool.faqs
			: [
					{
						question: `Is the ${tool.name} free to use?`,
						answer: `Yes, the ${tool.name} on SopKit is 100% free to use. There are no daily usage limits, and no registration or account creation is required.`
					},
					{
						question: `Does this ${tool.name} store or upload my files?`,
						answer: tool.executionType === "external"
							? `No files are stored on our servers. Processing requests for ${tool.name} are handled via transparent external APIs (${tool.providerName || "external provider"}). Only explicit generation prompts or inputs are submitted to produce your result.`
							: `No. All operations and file processing for the ${tool.name} are completed locally inside your web browser using JavaScript or WebAssembly. Your files are never uploaded to our servers, ensuring total privacy and security.`
					}
			  ];

		const faqData = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faqsToUse.map((faq) => ({
				"@type": "Question",
				name: faq.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: faq.answer,
				},
			})),
		};

		const howToData = tool.howTo
			? {
					"@context": "https://schema.org",
					"@type": "HowTo",
					name: tool.howTo.name || `How to use ${tool.name}`,
					step: tool.howTo.steps
					  ? tool.howTo.steps.map((step, index) => {
					      const stepUrl = step.url ? step.url.replace(/\/+$/, "") : undefined;
					      return {
							"@type": "HowToStep",
							position: index + 1,
							name: step.name,
							text: step.text,
							...(stepUrl ? { url: stepUrl } : {})
						  };
						})
					  : [],
				}
			: null;

		const articleData = tool.article
			? {
					"@context": "https://schema.org",
					"@type": "Article",
					headline: tool.name,
					description: tool.description,
					author: {
						"@type": "Organization",
						name: "SopKit",
						url: `${SITE_URL}/`,
					},
					publisher: {
						"@type": "Organization",
						name: "SopKit",
						logo: {
							"@type": "ImageObject",
							url: `${SITE_URL}/favicon.ico`,
						},
					},
					...(tool.datePublished ? { datePublished: tool.datePublished } : {}),
					dateModified: LAST_UPDATED,
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": toolUrl,
					},
				}
			: null;

		const breadcrumbStructuredData = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: `${SITE_URL}/`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: toolCategoryName,
					// No hub page for this category (see
					// NO_HUB_CATEGORY_SLUGS): name only, never a dead link.
					...(toolCategoryUrl ? { item: toolCategoryUrl } : {}),
				},
				{
					"@type": "ListItem",
					position: 3,
					name: tool.name,
					item: toolUrl,
				},
			],
		};

		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(toolStructuredData).replace(/</g, "\\u003c"),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(breadcrumbStructuredData).replace(/</g, "\\u003c"),
					}}
				/>
				{includeFAQ && faqData && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(faqData).replace(/</g, "\\u003c"),
						}}
					/>
				)}
				{howToData && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(howToData).replace(/</g, "\\u003c"),
						}}
					/>
				)}
				{articleData && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(articleData).replace(/</g, "\\u003c"),
						}}
					/>
				)}
			</>
		);
	}

	if (isHome) {
		const breadcrumbStructuredData = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: SITE_URL,
				},
			],
		};

		const faqStructuredData = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: "Are the tools on SopKit really free?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes. All tools on SopKit are free to use. We prioritize a browser-first execution model that runs locally, providing fast utilities without subscription barriers.",
					},
				},
				{
					"@type": "Question",
					name: "Do I need to create an account to use the tools?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "No. You can use any utility instantly without mandatory account creation or registration steps.",
					},
				},
				{
					"@type": "Question",
					name: "Are my files safe when using SopKit?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Our core tools (including Image and PDF tools) process data locally within your browser sandbox. Your files and private media are not uploaded to our servers. Tools that require external APIs explicitly disclose their external processing before submission.",
					},
				},
				{
					"@type": "Question",
					name: "What types of tools are available on SopKit?",
					acceptedAnswer: {
						"@type": "Answer",
						text: `SopKit delivers utilities across ${CATEGORY_COUNT} categories, including browser-based image processing, PDF manipulation, developer utilities, format converters, and text helpers.`,
					},
				},
			],
		};

		// Note: WebSite and Organization JSON-LD are already rendered globally in app/layout.tsx
		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(breadcrumbStructuredData).replace(/</g, "\\u003c"),
					}}
				/>
				{includeFAQ && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
						}}
					/>
				)}
			</>
		);
	}

	if (isArchive) {
		const toolsCollectionStructuredData = {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `Free Online Tools Collection - ${TOOL_COUNT}+ Professional Tools`,
			description: `Comprehensive collection of ${TOOL_COUNT}+ free online tools for image processing, PDF editing, video conversion, text manipulation, SEO, and developer utilities.`,
			url: SITE_URL,
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: CATEGORY_COUNT,
				itemListElement: allCategories.map((category, index) => {
					const hubRoute = getCategoryHubUrl(category.slug);
					return {
						"@type": "ListItem",
						position: index + 1,
						item: {
							"@type": "CollectionPage",
							name: category.name,
							// No hub page for this category (see
							// NO_HUB_CATEGORY_SLUGS): name only, never
							// a dead link.
							...(hubRoute
								? { url: buildCanonicalUrl(hubRoute) }
								: {}),
							description: category.description,
						},
					};
				}),
			},
		};

		// WebSite is rendered globally in app/layout.tsx
		return (
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(toolsCollectionStructuredData).replace(/</g, "\\u003c"),
				}}
			/>
		);
	}

	// Default fallback: WebSite and Organization are rendered in app/layout.tsx, avoid emitting duplicates
	return null;
}
