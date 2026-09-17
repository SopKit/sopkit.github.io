import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools";
import { blogs } from "@/constants/blog-data";
import { SITE_CONFIG, SITE_URL } from "@/constants/config";
import { seoOpportunities } from "@/data/seo-opportunities";
import { intentData } from "@/lib/intent-data";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
	const allTools = getAllTools();
	const siteUpdated = new Date(SITE_CONFIG.lastUpdatedDate);
	const now = new Date();

	// Use actual blog dates where available, siteUpdated for static pages
	const staticPages: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
		{ url: `${SITE_URL}/about`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/contact`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/privacy`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/terms`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/dmca`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.6 },
		{ url: `${SITE_URL}/advertise`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/services`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.75 },
		{ url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
		{ url: `${SITE_URL}/packages`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
		{ url: `${SITE_URL}/startup-directories`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
		// Category hub pages (priority 0.8-0.9)
		{ url: `${SITE_URL}/image-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/exam-image-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.92 },
		{ url: `${SITE_URL}/pdf-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/video-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/audio-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/text-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/seo-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.85 },
		{ url: `${SITE_URL}/developer-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/api-key-tester`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/ai-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/qr-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.88 },
		{ url: `${SITE_URL}/small-business-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.86 },
		{ url: `${SITE_URL}/other-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.75 },
		{ url: `${SITE_URL}/generators`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/calculators`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.75 },
		{ url: `${SITE_URL}/student-calculators`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/student-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.84 },
		{ url: `${SITE_URL}/exam-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/business-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/social-media-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/finance-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/calculator-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.85 },
		{ url: `${SITE_URL}/converter-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.85 },
		{ url: `${SITE_URL}/ai-writing-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/local-business-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		// Blog
		{ url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
		// Content hub / SEO landing pages
		{ url: `${SITE_URL}/tool-guides`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.7 },
		{ url: `${SITE_URL}/ai-tools-alternatives-free`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-alternative-to-chatgpt`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-converters-in-2026`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-tools-for-students`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/how-to-format-json-properly`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/seo-tools-free-online`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/tools-for-developers`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{url: `${SITE_URL}/top-10-free-online-tools-for-seo`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{url: `${SITE_URL}/top-10-json-tools-online`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{url: `${SITE_URL}/new-tools`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
		{ url: `${SITE_URL}/online-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/embed-tools`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/best-free-ilovepdf-alternatives`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-adobe-acrobat-alternatives`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-canva-alternatives`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
	];

	// Use site deployment date for tool pages (staggered by popularity)
	const toolPages: MetadataRoute.Sitemap = allTools
		.filter((tool) => {
			const route = String(tool.route || "");
			if (!route.startsWith("/")) return false;
			if (route.includes("?")) return false;
			if (route.startsWith("/search")) return false;
			return true;
		})
		.map((tool) => ({
			url: `${SITE_URL}${tool.route}`,
			lastModified: tool.popular ? now : siteUpdated,
			changeFrequency: "weekly" as const,
			priority: tool.popular ? 0.9 : 0.75,
		}));

	// Blog URLs
	const blogPages: MetadataRoute.Sitemap = [
		...blogs.map((article) => ({
			url: `${SITE_URL}/blog/${article.slug}`,
			lastModified: new Date(article.date),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];

	const seoOpportunityPages: MetadataRoute.Sitemap = seoOpportunities.map((opportunity) => ({
		url: `${SITE_URL}${opportunity.route}`,
		lastModified: now,
		changeFrequency: "weekly" as const,
		priority: opportunity.priority === 1 ? 0.9 : opportunity.priority === 2 ? 0.86 : 0.84,
	}));

	const intentPages: MetadataRoute.Sitemap = Object.keys(intentData).map((slug) => ({
		url: `${SITE_URL}/${slug}`,
		lastModified: now,
		changeFrequency: "weekly" as const,
		priority: 0.85,
	}));

	// Keyword-permutation slugs (tool-extraslugs.json, ~9.2k URLs) are
	// deliberately EXCLUDED from the sitemap:
	//   - They are templated variants of parent tool pages (thin/duplicate
	//     content at scale) and dilute crawl budget away from the ~800 pages
	//     with unique value.
	//   - The pages themselves remain reachable (200) via direct URL or
	//     /archive, so existing equity is not lost.
	//   - Re-include individual winners later based on GSC impression data.
	// NOTE: extraSlugs permutation pages are intentionally not emitted here —
	// see comment above.

	try {
		// Deduplicate by URL to avoid duplicate sitemap entries.
		// NOTE: URLs are emitted WITH a trailing slash to stay consistent with the
		// canonical URLs declared in page metadata (the dominant form across the site).
		const allPages = [
			...staticPages,
			...toolPages,
			...blogPages,
			...seoOpportunityPages,
			...intentPages,
		];
		const seen = new Set<string>();
		return allPages
			.filter((page) => {
				if (seen.has(page.url)) return false;
				seen.add(page.url);
				return true;
			})
			.map((page) => {
				let url = page.url;
				if (!url.endsWith("/")) {
					url += "/";
				}
				return {
					...page,
					url,
				};
			});
	} catch (error) {
		console.error("Sitemap generation error:", error);
		return staticPages.map((page) => {
			let url = page.url;
			if (!url.endsWith("/")) {
				url += "/";
			}
			return {
				...page,
				url,
			};
		});
	}
}
