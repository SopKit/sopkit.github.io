import React from "react";
import type { Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";

const BASE_URL = "https://sopkit.github.io";

export interface JsonLdProps {
	tool?: Tool;
	categoryName?: string;
	categorySlug?: string;
	faqs?: { question: string; answer: string }[];
	isHome?: boolean;
}

export function JsonLd({
	tool,
	categoryName,
	categorySlug,
	faqs,
	isHome = false,
}: JsonLdProps) {
	if (isHome) {
		const websiteSchema = {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "SopKit",
			url: `${BASE_URL}/`,
			description: `${SITE_CONFIG.toolCountString} free online tools for image, PDF, video, audio, SEO, and developer workflows. 100% private, client-side execution.`,
			potentialAction: {
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${BASE_URL}/search/?q={search_term_string}`,
				},
				"query-input": "required name=search_term_string",
			},
		};

		const organizationSchema = {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: "SopKit",
			url: `${BASE_URL}/`,
			logo: `${BASE_URL}/favicon.ico`,
			sameAs: ["https://github.com/SopKit/sopkit.github.io"],
			description: `Privacy-first free online toolkit with ${SITE_CONFIG.toolCountString} browser-based tools.`,
		};

		const homeBreadcrumbs = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: `${BASE_URL}/`,
				},
			],
		};

		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbs) }}
				/>
			</>
		);
	}

	if (!tool) return null;

	const cleanRoute = tool.route.endsWith("/") ? tool.route : `${tool.route}/`;
	const canonicalUrl = `${BASE_URL}${cleanRoute}`;
	const catName = categoryName || tool.categoryName || tool.category || "Utilities";
	const catSlug = categorySlug || tool.categorySlug || tool.category || "utilities";
	const categoryHubUrl = `${BASE_URL}/${catSlug.endsWith("-tools") ? catSlug : `${catSlug}-tools`}/`;

	// 1. SoftwareApplication / WebApplication Schema
	const appSchema: Record<string, any> = {
		"@context": "https://schema.org",
		"@type": ["SoftwareApplication", "WebApplication"],
		name: tool.name,
		description: tool.description,
		applicationCategory: catName,
		operatingSystem: "All",
		browserRequirements: "Requires any modern web browser with JavaScript enabled.",
		url: canonicalUrl,
		isAccessibleForFree: true,
		inLanguage: "en",
		screenshot: `${BASE_URL}/og-image.jpg`,
		dateModified: SITE_CONFIG.lastUpdatedDate,
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
	};

	if (tool.features && tool.features.length > 0) {
		appSchema.featureList = tool.features.join(", ");
	}

	// 2. BreadcrumbList Schema (Home > Category > Tool)
	const breadcrumbSchema = {
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
				name: catName,
				item: categoryHubUrl,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: tool.name,
				item: canonicalUrl,
			},
		],
	};

	// 3. FAQPage Schema
	const faqsToUse = (faqs && faqs.length > 0)
		? faqs
		: (tool.faqs && tool.faqs.length > 0)
			? tool.faqs
			: [
					{
						question: `Is the ${tool.name} free to use?`,
						answer: `Yes, the ${tool.name} on SopKit is 100% free with no registration required and no usage limits.`,
					},
					{
						question: `Does ${tool.name} upload my files to a server?`,
						answer: `No. All operations run 100% client-side inside your browser sandbox using JavaScript and WebAssembly. Your files never leave your device.`,
					},
			  ];

	const faqSchema = {
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

	// 4. HowTo Schema if steps exist
	const howToSchema = tool.howTo?.steps && tool.howTo.steps.length > 0
		? {
				"@context": "https://schema.org",
				"@type": "HowTo",
				name: tool.howTo.name || `How to use ${tool.name}`,
				step: tool.howTo.steps.map((step, idx) => ({
					"@type": "HowToStep",
					position: idx + 1,
					name: step.name,
					text: step.text,
					...(step.url ? { url: step.url.endsWith("/") ? step.url : `${step.url}/` } : {}),
				})),
		  }
		: null;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			{howToSchema && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
				/>
			)}
		</>
	);
}

export default JsonLd;
