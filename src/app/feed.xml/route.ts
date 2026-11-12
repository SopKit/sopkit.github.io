import { SITE_URL } from "@/constants/config";
import { getAllTools } from "@/lib/tools";
import { getMonetizationDecision } from "@/data/monetization";
import { buildCanonicalUrl } from "@/seo/canonical";
import toolLastmodData from "@/data/tool-lastmod.json";

export const dynamic = "force-static";

const FEED_ITEM_LIMIT = 100;

function escapeCdata(value: string): string {
	return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
	const baseUrl = SITE_URL;
	const currentYear = new Date().getFullYear();
	const toolLastmod = toolLastmodData.lastmod as Record<string, string>;

	// Only tools that the sitemap also lists: a noindex tool (monetization
	// decision non-indexable) must not be syndicated either. Items carry
	// the per-tool lastmod from src/data/tool-lastmod.json (the last commit
	// touching the tool's page), never the build time, and the newest
	// tools come first so readers see real updates.
	const feedTools = getAllTools()
		.filter((tool) => {
			const route = String(tool.route || "");
			if (!route.startsWith("/") || route.includes("?") || route.startsWith("/search")) return false;
			return getMonetizationDecision({ slug: tool.id, category: tool.category }).indexable;
		})
		.map((tool) => ({
			tool,
			lastmod: toolLastmod[tool.route] ? new Date(toolLastmod[tool.route]) : null,
		}))
		.filter((entry): entry is { tool: typeof entry.tool; lastmod: Date } => entry.lastmod !== null)
		.sort((a, b) => b.lastmod.getTime() - a.lastmod.getTime())
		.slice(0, FEED_ITEM_LIMIT);

	const lastBuildDate = (feedTools[0]?.lastmod ?? new Date()).toUTCString();

	const rssItems = feedTools
		.map(({ tool, lastmod }) => {
			const link = buildCanonicalUrl(tool.route);
			return `
    <item>
      <title><![CDATA[${escapeCdata(tool.name)} - Free Online Tool]]></title>
      <description><![CDATA[${escapeCdata(tool.description)}. Use our free ${escapeCdata(tool.name)} tool online. No registration required, fast and secure processing.]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${lastmod.toUTCString()}</pubDate>
      <category><![CDATA[${escapeCdata(String(tool.category))}]]></category>
    </item>
  `;
		})
		.join("");

	const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title><![CDATA[SopKit - Free Online Toolkit | Latest Tools & Updates]]></title>
        <description><![CDATA[Stay updated with the latest free online tools from SopKit. Professional tools for image processing, PDF manipulation, video conversion, and more. No registration required.]]></description>
        <link>${baseUrl}/</link>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <language>en-US</language>
        <generator>SopKit RSS Generator</generator>
        <copyright>Copyright © ${currentYear} SopKit. All rights reserved.</copyright>
        ${rssItems}
      </channel>
    </rss>`;

	return new Response(rssFeed, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
