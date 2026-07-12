import toolsData from "@/constants/tools.json";

export const SITE_NAME = "SopKit";
export const SITE_URL = "https://sopkit.github.io";
export const CONTACT_EMAIL = "shaswatraj3@gmail.com";
export const COMPANY_OR_OWNER_NAME = "SopKit";
export const LAST_UPDATED = "2026-05-09";

const allTools = Object.values(toolsData.categories || {}).flatMap(
	(category: any) => category?.tools || [],
);

export const TOOL_COUNT = allTools.length;
export const TOOL_COUNT_STRING = `${Math.floor(TOOL_COUNT / 5) * 5}+`;

export const CATEGORY_COUNT = Object.keys(toolsData.categories || {}).length;
export const POPULAR_TOOL_COUNT = allTools.filter((tool: any) => tool?.popular).length;

export const SHOW_SCRIPTLY_ADS = false;
export const GITHUB_REPO_URL = "https://github.com/SopKit/sopkit.github.io";
export const ADSENSE_SLOT_IDS = {
	"after-hero": "9876543210",
	"before-tool": "9876543211",
	"after-tool": "9876543212",
	"in-content": "9876543213",
	"sidebar": "9876543214",
	"footer": "9876543215",
};
export const DEFAULT_META_TITLE = "SopKit - Free Online Toolkit (100% Client-Side)";
export const DEFAULT_META_DESC = "SopKit is a free, privacy-first online utility suite. Compress images, merge PDFs, download videos, and format developer logs locally in your browser sandbox.";
export const THEME_COLOR = "#10b981";
export const FEED_URL = `${SITE_URL}/feed.xml`;
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

export const SITE_CONFIG = {
	siteName: SITE_NAME,
	siteUrl: SITE_URL,
	toolCount: TOOL_COUNT,
	toolCountString: TOOL_COUNT_STRING,
	categoryCount: CATEGORY_COUNT,
	popularToolCount: POPULAR_TOOL_COUNT,
	popularToolCountString: `${POPULAR_TOOL_COUNT}`,
	seoVariantCount: 0,
	lastUpdatedDate: LAST_UPDATED,
	maxFileSize: "50MB",
	supportedFileLimits: "Up to 50MB per file",
	contactEmail: CONTACT_EMAIL,
	companyOrOwnerName: COMPANY_OR_OWNER_NAME,
	showScriptlyAds: SHOW_SCRIPTLY_ADS,
	githubRepoUrl: GITHUB_REPO_URL,
	defaultMetaTitle: DEFAULT_META_TITLE,
	defaultMetaDesc: DEFAULT_META_DESC,
	themeColor: THEME_COLOR,
	feedUrl: FEED_URL,
	sitemapUrl: SITEMAP_URL,
};
