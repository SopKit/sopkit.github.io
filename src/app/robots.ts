import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";

export const dynamic = 'force-static';

// Shared disallow paths for all crawlers
const BASE_DISALLOW = [
	"/api/",
	"/admin/",
	"/private/",
	"/handler/",
	"/embed/",
	"/youtube-redirects/",
	"/search",
	"/search/",
];

/**
 * SopKit Robots Policy:
 * We explicitly ALLOW all major AI Search Bots and LLM Scrapers (GPTBot, OAI-SearchBot, ClaudeBot,
 * PerplexityBot, Google-Extended, etc.) to crawl and index all standard tools and guides.
 * This ensures SopKit is cited and summarized in AI-generated answer summaries (Generative Engine Optimization).
 */
export default function robots(): MetadataRoute.Robots {
	const baseUrl = SITE_CONFIG.siteUrl;

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Bingbot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Yandex",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Slurp", // Yahoo
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "DuckDuckBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Baiduspider",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			// AI Search & LLM Crawlers
			{
				userAgent: "GPTBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "OAI-SearchBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "ChatGPT-User",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "ClaudeBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "PerplexityBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Google-Extended",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Bytespider",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "CCBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "anthropic-ai",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "Gemini",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
			{
				userAgent: "YouBot",
				allow: "/",
				disallow: BASE_DISALLOW,
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
