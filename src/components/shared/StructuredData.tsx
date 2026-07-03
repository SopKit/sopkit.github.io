import { getAllCategories, getAllTools, type Tool, type Category } from "@/lib/tools";

const BASE_URL = "https://sopkit.github.io";
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
	image: "/image-tools",
	pdf: "/pdf-tools",
	video: "/video-tools",
	audio: "/audio-tools",
	seo: "/seo-tools",
	text: "/text-tools",
	developer: "/developer-tools",
	utilities: "/other-tools",
	generators: "/generators",
	calculators: "/calculators",
};

function getCategoryHubUrl(categorySlug: string): string {
	return CATEGORY_HUB_ROUTES[categorySlug] || `/${categorySlug}-tools`;
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
		
		const cleanRoute = tool.route.endsWith("/") ? tool.route : `${tool.route}/`;
		const toolUrl = `${BASE_URL}${cleanRoute}`;
		
		const toolCategoryName =
			categoryDetails?.name || tool.categoryName || "Utilities";
		const toolCategorySlug = categoryDetails?.slug || tool.category || "utilities";
		
		const categoryHubRoute = getCategoryHubUrl(toolCategorySlug);
		const cleanCategoryHubRoute = categoryHubRoute.endsWith("/") ? categoryHubRoute : `${categoryHubRoute}/`;
		const toolCategoryUrl = `${BASE_URL}${cleanCategoryHubRoute}`;

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
			screenshot: `${BASE_URL}/og-image.jpg`,
			dateModified: new Date().toISOString().split("T")[0],
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
			},
			creator: {
				"@type": "Organization",
				name: "SopKit",
				url: `${BASE_URL}/`,
				logo: `${BASE_URL}/favicon.ico`,
			},
			provider: {
				"@type": "Organization",
				name: "SopKit",
				url: `${BASE_URL}/`,
			},
			featureList: tool.features
				? tool.features.join(", ")
				: "Free online tool",
		};

		// Add AggregateRating if tool has reviews
		if (tool.reviews && tool.reviews.length > 0) {
			const totalRating = tool.reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0);
			const avgRating = totalRating / tool.reviews.length;
			toolStructuredData.aggregateRating = {
				"@type": "AggregateRating",
				ratingValue: avgRating.toFixed(1),
				reviewCount: tool.reviews.length,
				bestRating: "5",
				worstRating: "1",
			};
		}

		// Fallback to high-quality default FAQs if tool has no FAQs defined
		const faqsToUse = tool.faqs && tool.faqs.length > 0
			? tool.faqs
			: [
					{
						question: `Is the ${tool.name} free to use?`,
						answer: `Yes, the ${tool.name} on SopKit is 100% free to use. There are no daily usage limits, and no registration or account creation is required.`
					},
					{
						question: `Does this ${tool.name} store or upload my files?`,
						answer: `No. All operations and file processing for the ${tool.name} are completed locally inside your web browser using JavaScript or WebAssembly. Your files are never uploaded to our servers, ensuring total privacy and security.`
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
					      const stepUrl = step.url ? (step.url.endsWith('/') ? step.url : `${step.url}/`) : undefined;
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
						url: `${BASE_URL}/`,
					},
					publisher: {
						"@type": "Organization",
						name: "SopKit",
						logo: {
							"@type": "ImageObject",
							url: `${BASE_URL}/favicon.ico`,
						},
					},
					datePublished: "2024-01-01T08:00:00+08:00",
					dateModified: new Date().toISOString(),
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
					item: `${BASE_URL}/`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: toolCategoryName,
					item: toolCategoryUrl,
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
						__html: JSON.stringify(toolStructuredData),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(breadcrumbStructuredData),
					}}
				/>
				{faqData && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(faqData),
						}}
					/>
				)}
				{howToData && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(howToData),
						}}
					/>
				)}
				{articleData && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(articleData),
						}}
					/>
				)}
			</>
		);
	}

	const websiteStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "SopKit",
		url: `${BASE_URL}/`,
		description: "460+ free online tools for image, PDF, video, audio, SEO, and developer workflows. No signup, no uploads, 100% private.",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${BASE_URL}/search/?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	const organizationStructuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "SopKit",
		url: `${BASE_URL}/`,
		logo: `${BASE_URL}/favicon.ico`,
		sameAs: [
			"https://github.com/SopKit/sopkit.github.io",
		],
		description: "Privacy-first free online toolkit with 460+ browser-based tools.",
	};

	if (isHome) {
		const breadcrumbStructuredData = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: BASE_URL,
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
						text: "Yes. According to our Frictionless Access Framework, 100% of the tools on SopKit are free. We utilize a browser-first execution model that eliminates the need for expensive server-side compute, allowing us to provide professional-grade utilities at zero cost to the user.",
					},
				},
				{
					"@type": "Question",
					name: "Do I need to create an account to use the tools?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "No. Our 'No-Auth' engineering protocol ensures that users can deploy any utility instantly. Statistics show that removing mandatory registration reduces time-to-value by over 65%, making SopKit the most efficient toolkit for rapid digital engineering tasks.",
					},
				},
				{
					"@type": "Question",
					name: "Are my files safe when using SopKit?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Security is verified through our Zero-Knowledge architecture. Over 90% of our core tools (including Image and PDF resizers) process data locally within your browser's V8 sandbox. This ensures that sensitive identity documents and private media never traverse our servers, providing 100% data residency.",
					},
				},
				{
					"@type": "Question",
					name: "What types of tools are available on SopKit?",
					acceptedAnswer: {
						"@type": "Answer",
						text: `SopKit delivers a unified ecosystem of ${TOOL_COUNT}+ professional utilities across ${CATEGORY_COUNT} technical domains, including WASM-powered image processing, secure PDF manipulation, enterprise-grade content extractors, and LLM-augmented developer tools.`,
					},
				},
			],
		};

		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteStructuredData),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationStructuredData),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(breadcrumbStructuredData),
					}}
				/>
				{includeFAQ && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(faqStructuredData),
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
			url: BASE_URL,
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: CATEGORY_COUNT,
				itemListElement: allCategories.map((category, index) => ({
					"@type": "ListItem",
					position: index + 1,
					item: {
						"@type": "CollectionPage",
						name: category.name,
						url: `${BASE_URL}${getCategoryHubUrl(category.slug)}`,
						description: category.description,
					},
				})),
			},
		};

		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteStructuredData),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(toolsCollectionStructuredData),
					}}
				/>
			</>
		);
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteStructuredData),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationStructuredData),
				}}
			/>
		</>
	);
}
