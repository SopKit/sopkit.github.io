import { getAllCategories, type Tool } from "@/lib/tools";
import { LAST_UPDATED, SITE_URL } from "@/constants/config";
import { buildCanonicalUrl } from "@/seo/canonical";
import { isCuratedContent } from "@/data/content-curation";

const allCategories = getAllCategories();
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
	// The privacy-tools registry key and slug are both "privacy-tools",
	// and its listing page is /privacy-tools.
	"privacy-tools": "/privacy-tools",
	// The health registry key and slug are both "health", and its
	// listing page is /health.
	"health": "/health",
	// The guides registry key is "content" but its slug is "guides",
	// and its listing page is /tool-guides.
	"guides": "/tool-guides",
};

// Registry category slugs with no hub page at all. getCategoryHubUrl
// returns null for these instead of inventing a URL, and callers omit
// the category from the breadcrumb structured data entirely rather
// than emitting a name-only ListItem (Google flags a missing `item`
// as a critical Search Console error) or linking to a 404. company:
// 2 entries, but they are the /privacy and /terms policy pages, not
// tools, so no company hub is sensible; blog: 0 tools. (/privacy is
// the policy page, not a hub, and the privacy-tools hub now lives at
// /privacy-tools; the health hub now lives at /health.)
const NO_HUB_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
	"company",
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
}

export default function StructuredData({ 
	tool, 
	includeFAQ = true,
	isHome = false,
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

		// Only pages whose prose passed the uniqueness audit may carry a
		// feature list or FAQ markup; everything else stays a plain
		// SoftwareApplication plus breadcrumbs.
		const hasCuratedContent = isCuratedContent(tool.id);
		const curatedFeatures = hasCuratedContent && tool.features?.length ? tool.features : null;
		const curatedFaqs = hasCuratedContent && tool.faqs?.length ? tool.faqs : null;

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
			...(curatedFeatures ? { featureList: curatedFeatures.join(", ") } : {}),
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

		// FAQPage markup is emitted only for curated FAQs. There is no templated
		// fallback, and no HowTo or Article markup: HowTo rich results were
		// retired by Google in 2023 and a tool page is not an Article.
		const faqData = curatedFaqs
			? {
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: curatedFaqs.map((faq) => ({
						"@type": "Question",
						name: faq.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: faq.answer,
						},
					})),
				}
			: null;

		// Google requires `item` on every BreadcrumbList ListItem — a
		// name-only element is a critical Search Console error
		// ("Missing field 'item'"). Categories with no hub page (see
		// NO_HUB_CATEGORY_SLUGS) are omitted from the structured data
		// entirely rather than emitted without a URL; the visible
		// breadcrumb is unaffected.
		const breadcrumbItems = [
			{ name: "Home", item: `${SITE_URL}/` },
			...(toolCategoryUrl
				? [{ name: toolCategoryName, item: toolCategoryUrl }]
				: []),
			{ name: tool.name, item: toolUrl },
		];

		const breadcrumbStructuredData = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbItems.map((crumb, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: crumb.name,
				item: crumb.item,
			})),
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
					item: `${SITE_URL}/`,
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

	// Default fallback: WebSite and Organization are rendered in app/layout.tsx, avoid emitting duplicates
	return null;
}
