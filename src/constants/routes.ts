/**
 * Static route paths for SopKit.
 * Keeps client bundles lightweight by preventing imports of tools.json.
 */
export const STATIC_ROUTES = {
	HOME: "/",
	SEARCH: "/search",
	CONTACT: "/contact",
	PRIVACY: "/privacy",
	TERMS: "/terms",
	ABOUT: "/about",
	DMCA: "/dmca",
	TOOLS: "/tools",
	BLOG: "/blog",
	TOOL_GUIDES: "/tool-guides",
	NEW_TOOLS: "/new-tools",
	PRO: "/pro",
	PACKAGES: "/packages",
	IMAGE_TOOLS: "/image-tools",
	PDF_TOOLS: "/pdf-tools",
	DEVELOPER_TOOLS: "/developer-tools",
	CALCULATORS: "/calculators",
	SEO_TOOLS: "/seo-tools",
	TEXT_TOOLS: "/text-tools",
	TOOL_ID: "/tool-id",
} as const;

export type StaticRoute = typeof STATIC_ROUTES[keyof typeof STATIC_ROUTES];
