import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools";
import { blogs } from "@/constants/blog-data";
import { SITE_CONFIG, SITE_URL } from "@/constants/config";
import { seoOpportunities } from "@/data/seo-opportunities";
import { intentData } from "@/lib/intent-data";
import { getMonetizationDecision } from "@/data/monetization";
import toolLastmodData from "@/data/tool-lastmod.json";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
	// lastModified must reflect the last known content change, never the build
	// date: stamping every build's date on unchanged pages misleads crawlers
	// about what actually changed. Tool pages use their own per-tool date
	// from src/data/tool-lastmod.json (the last commit touching that tool's
	// page file; see scripts/generate-tool-lastmod.ts for the method and
	// its limits — registry-only metadata edits do not move these dates).
	// Static pages and hubs conservatively use the last site-wide content
	// update (SITE_CONFIG.lastUpdatedDate); blog posts use their article
	// date. A tool missing from the map falls back to the site-wide date
	// rather than breaking the sitemap; the validator
	// (scripts/validate-tool-lastmod.ts, run in prebuild) forbids that
	// case from reaching a deploy.
	const siteUpdated = new Date(SITE_CONFIG.lastUpdatedDate);
	const toolLastmod = toolLastmodData.lastmod as Record<string, string>;

	// Use actual blog dates where available, siteUpdated for static pages
	// Static entries are the ONLY way a URL enters the sitemap without
	// passing the monetization indexable filter (they are prepended and
	// win the first-registration dedup below), so a static entry must
	// never name a page that renders noindex or redirects. Deliberately
	// EXCLUDED on those grounds (see scripts/validate-sitemap-indexable.ts,
	// which enforces this in prebuild):
	//   - /video-tools, /api-key-tester: hub pages whose generateToolMetadata
	//     call renders robots noindex (risky video / credential categories).
	//   - /api-key-testers, /pro, /hire: bare permanentRedirect pages
	//     (308, no indexable content; /pro additionally carries noindex).
	// The pages themselves stay live and internally linked; only their
	// sitemap listings are removed. /youtube-tools is excluded the same
	// way (literal noindex hub page).
	const staticPages: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, lastModified: siteUpdated, changeFrequency: "daily", priority: 1.0 },
		{ url: `${SITE_URL}/about`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/editorial-policy`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/contact`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/privacy`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/terms`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/dmca`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.6 },
		{ url: `${SITE_URL}/advertise`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/services`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.75 },
		{ url: `${SITE_URL}/tools`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.95 },
		{ url: `${SITE_URL}/packages`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.9 },
		{ url: `${SITE_URL}/startup-directories`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.85 },
		// Category hub pages (priority 0.8-0.9)
		{ url: `${SITE_URL}/image-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/exam-image-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.92 },
		{ url: `${SITE_URL}/extraction-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/pdf-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
		{ url: `${SITE_URL}/audio-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/text-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/seo-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.85 },
		{ url: `${SITE_URL}/developer-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
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
		{ url: `${SITE_URL}/blog`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.8 },
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
		{url: `${SITE_URL}/new-tools`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.8 },
		{ url: `${SITE_URL}/online-tools`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/embed-tools`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/best-free-ilovepdf-alternatives`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-adobe-acrobat-alternatives`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/best-free-canva-alternatives`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.65 },
		{ url: `${SITE_URL}/dev-speed`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.9 },
		{ url: `${SITE_URL}/architecture-canvas`, lastModified: siteUpdated, changeFrequency: "daily", priority: 0.9 },
		{ url: `${SITE_URL}/pricing`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/resources`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
		{ url: `${SITE_URL}/trust-center`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
	];

	try {
		const allTools = getAllTools();
		// Tool pages share the last site-wide content update (see note above);
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
			lastModified: toolLastmod[tool.route] ? new Date(toolLastmod[tool.route]) : siteUpdated,
			changeFrequency: "weekly" as const,
			priority: tool.popular ? 0.9 : 0.75,
			_indexable: getMonetizationDecision({ slug: tool.id, category: tool.category }).indexable,
		}))
		.filter((tool) => tool._indexable)
		.map(({ _indexable, ...tool }) => tool);

	// Blog URLs
	const blogTotalPages = Math.max(1, Math.ceil(blogs.length / 12));
	const blogArchivePages: MetadataRoute.Sitemap = Array.from(
		{ length: Math.max(0, blogTotalPages - 1) },
		(_, index) => ({
			url: `${SITE_URL}/blog/page/${index + 2}`,
			lastModified: siteUpdated,
			changeFrequency: "daily" as const,
			priority: 0.75,
		}),
	);

	const blogPages: MetadataRoute.Sitemap = [
		...blogArchivePages,
		...blogs.map((article) => ({
			url: `${SITE_URL}/blog/${article.slug}`,
			lastModified: new Date(article.date),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];

	const seoOpportunityPages: MetadataRoute.Sitemap = seoOpportunities.map((opportunity) => ({
		url: `${SITE_URL}${opportunity.route}`,
		lastModified: siteUpdated,
		changeFrequency: "weekly" as const,
		priority: opportunity.priority === 1 ? 0.9 : opportunity.priority === 2 ? 0.86 : 0.84,
	}));

	const intentPages: MetadataRoute.Sitemap = Object.keys(intentData)
		.filter((slug) => getMonetizationDecision({ slug }).indexable)
		.map((slug) => ({
			url: `${SITE_URL}/${slug}`,
			lastModified: siteUpdated,
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

		// Deduplicate and strictly normalize URLs to canonical form:
		// root has trailing slash (https://sopkit.space/), subpaths do not (https://sopkit.space/slug)
		const allPages = [
			...staticPages,
			...toolPages,
			...blogPages,
			...seoOpportunityPages,
			...intentPages,
		];
		const seen = new Set<string>();
		return allPages
			.map((page) => {
				let url = page.url.trim();
				try {
					const parsed = new URL(url);
					let pathname = parsed.pathname.replace(/\/+/g, "/");
					if (pathname.length > 1 && pathname.endsWith("/")) {
						pathname = pathname.slice(0, -1);
					}
					url = `${parsed.origin}${pathname}`;
				} catch {
					if (url.length > 1 && url.endsWith("/") && !url.endsWith("://")) {
						url = url.slice(0, -1);
					}
				}
				return {
					...page,
					url,
				};
			})
			.filter((page) => {
				if (seen.has(page.url)) return false;
				seen.add(page.url);
				return true;
			});
	} catch (error) {
		console.error("Sitemap generation error:", error);
		return staticPages.map((page) => {
			let url = page.url.trim();
			try {
				const parsed = new URL(url);
				let pathname = parsed.pathname.replace(/\/+/g, "/");
				if (pathname.length > 1 && pathname.endsWith("/")) {
					pathname = pathname.slice(0, -1);
				}
				url = `${parsed.origin}${pathname}`;
			} catch {
				// fallback
			}
			return {
				...page,
				url,
			};
		});
	}
}
