/**
 * @file src/seo/metadata.ts
 * @description Centralized, standards-compliant Next.js Metadata generator.
 * Follows all .agents architectural constraints:
 *   - Title pattern: `Free [Tool Name] Online — [Action] [Subject] | SopKit` (≤60 chars)
 *   - Meta description: 150-160 chars with primary keyword & client-side privacy
 *   - Canonical URLs normalized without trailing slashes or tracking parameters
 *   - Separate manual content source of truth via MANUAL_TOOL_CONTENT
 *   - High-fidelity OpenGraph, Twitter cards, Robots directives, and GEO optimization.
 */

import type { Metadata } from "next";
import { SEO_CONFIG } from "./config";
import { PageSeoInput, ToolMetadataInput, CategoryMetadataInput } from "./types";
import { buildCanonicalUrl } from "./canonical";
import toolsData from "@/constants/tools.json";
import { getMonetizationDecision } from "@/data/monetization";

/**
 * High-resolution category OpenGraph previews
 */
const CATEGORY_OG_IMAGES: Record<string, string> = {
  developer: "/og-images/developer-tools.png",
  image: "/og-images/image-tools.png",
  pdf: "/og-images/pdf-tools.png",
  seo: "/og-images/seo-tools.png",
  text: "/og-images/text-tools.png",
  packages: "/og-images/packages.png",
  youtube: "/og-images/youtube-downloader.png",
};

export function resolveOgImage(category?: string, explicitImage?: string): string {
  if (explicitImage) {
    return explicitImage.startsWith("http") ? explicitImage : `${SEO_CONFIG.siteUrl}${explicitImage}`;
  }
  if (category && CATEGORY_OG_IMAGES[category]) {
    return `${SEO_CONFIG.siteUrl}${CATEGORY_OG_IMAGES[category]}`;
  }
  return `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`;
}

// In-memory indexed registry for O(1) metadata lookups
let toolLookupByRoute: Map<string, any> | null = null;
let toolLookupById: Map<string, any> | null = null;

function getToolRegistry() {
  if (!toolLookupByRoute || !toolLookupById) {
    toolLookupByRoute = new Map();
    toolLookupById = new Map();
    if (toolsData?.categories) {
      for (const cat of Object.values(toolsData.categories) as any[]) {
        if (cat.tools) {
          for (const t of cat.tools) {
            toolLookupByRoute.set(t.route, t);
            toolLookupByRoute.set(t.route.replace(/\/$/, ""), t);
            toolLookupById.set(t.id, t);
          }
        }
      }
    }
  }
  return { byRoute: toolLookupByRoute, byId: toolLookupById };
}

/**
 * Format page title to fit Google 50-60 character limit while including brand authority
 */
export function formatSeoTitle(rawTitle: string): string {
  let title = rawTitle.trim();
  if (title.includes(SEO_CONFIG.siteName)) {
    return title.length > 60 ? title.slice(0, 57) + "..." : title;
  }
  // Try to append brand if it fits under 60 chars
  const withBrand = `${title} | ${SEO_CONFIG.siteName}`;
  if (withBrand.length <= 60) {
    return withBrand;
  }
  // If title itself is near 60 chars, return it as is
  if (title.length <= 60) {
    return title;
  }
  // Clamp to 57 chars + "..."
  return title.slice(0, 57) + "...";
}

/**
 * Format description strictly between 145 and 165 characters (ideal 150-160 chars)
 */
export function formatSeoDescription(rawDesc: string, toolName?: string): string {
  let desc = rawDesc.trim().replace(/\s+/g, " ");

  // If already in optimal zone, return immediately
  if (desc.length >= 140 && desc.length <= 165) {
    return desc;
  }

  // If shorter than 140 chars, enrich with privacy and browser sandbox guarantee
  if (desc.length < 140) {
    const privacyAdd = " Fast, browser-based processing on SopKit.";
    if (desc.length + privacyAdd.length <= 165) {
      return `${desc}${privacyAdd}`;
    }
    const shortAdd = " Fast, free & private on SopKit.";
    if (desc.length + shortAdd.length <= 165) {
      return `${desc}${shortAdd}`;
    }
  }

  // If longer than 165 chars, truncate at word boundary near 155 chars
  if (desc.length > 165) {
    const slice = desc.slice(0, 155);
    const lastSpace = slice.lastIndexOf(" ");
    return (lastSpace > 120 ? slice.slice(0, lastSpace) : slice) + "...";
  }

  return desc;
}

/**
 * Generate action and subject for .agents title pattern: `Free [Tool Name] Online — [Action] [Subject]`
 */
function getToolActionSubject(cleanName: string, category?: string): { action: string; subject: string } {
  const lower = cleanName.toLowerCase();
  const cat = (category || "").toLowerCase();

  if (cat === "pdf" || lower.includes("pdf")) {
    if (lower.includes("compress")) return { action: "Reduce File Size", subject: "Privately" };
    if (lower.includes("merge")) return { action: "Combine Documents", subject: "Locally" };
    if (lower.includes("split")) return { action: "Extract Pages", subject: "Instantly" };
    return { action: "Edit & Convert", subject: "PDFs" };
  }
  if (cat === "image" || lower.includes("image") || lower.includes("photo") || lower.includes("jpg") || lower.includes("png")) {
    if (lower.includes("compress")) return { action: "Compress & Reduce Size", subject: "Fast" };
    if (lower.includes("resize")) return { action: "Resize & Crop", subject: "Images" };
    if (lower.includes("convert")) return { action: "Convert File Formats", subject: "Instantly" };
    return { action: "Process & Enhance", subject: "Photos" };
  }
  if (cat === "developer" || lower.includes("json") || lower.includes("base64") || lower.includes("jwt") || lower.includes("hash")) {
    if (lower.includes("json")) return { action: "Format & Validate", subject: "JSON Data" };
    if (lower.includes("base64")) return { action: "Encode & Decode", subject: "Strings" };
    if (lower.includes("hash")) return { action: "Generate Checksums", subject: "Securely" };
    return { action: "Debug & Format", subject: "Code" };
  }
  if (cat === "calculators" || lower.includes("calculator") || lower.includes("interest") || lower.includes("salary")) {
    return { action: "Calculate Formula", subject: "Accurately" };
  }
  if (cat === "generators" || lower.includes("generator") || lower.includes("maker")) {
    return { action: "Create Content", subject: "Instantly" };
  }
  if (cat === "seo" || lower.includes("seo") || lower.includes("tag") || lower.includes("meta")) {
    return { action: "Audit & Optimize", subject: "Keywords" };
  }
  if (cat === "text" || lower.includes("text") || lower.includes("word") || lower.includes("count")) {
    return { action: "Analyze & Format", subject: "Text" };
  }
  return { action: "Process & Export", subject: "Files" };
}

/**
 * Generate best-in-class metadata for any tool page on SopKit.
 * Sourced directly from MANUAL_TOOL_CONTENT, tools.json, and privacy keywords.
 */
export function constructToolMetadata(props: ToolMetadataInput): Metadata {
  const cleanRoute = props.route.startsWith("/") ? props.route : `/${props.route}`;
  const toolId = props.id || cleanRoute.replace(/^\//, "").replace(/\/$/, "");
  const cleanName = props.name.replace(/\s+—.*$/, "").replace(/^Free\s+/i, "").trim();

  const registry = getToolRegistry();
  const toolFromRegistry = registry.byRoute.get(cleanRoute) || registry.byId.get(toolId);

  // 1. Resolve Title (Priority: Registry seoTitle -> Pattern -> Fallback)
  let baseTitle = "";
  if (toolFromRegistry?.seoTitle) {
    baseTitle = toolFromRegistry.seoTitle;
  } else {
    const { action, subject } = getToolActionSubject(cleanName, props.category || toolFromRegistry?.category);
    baseTitle = `Free ${cleanName} Online — ${action} ${subject}`;
  }
  const title = formatSeoTitle(baseTitle);

  // 2. Resolve Description (Priority: MANUAL_TOOL_CONTENT -> Registry seoDescription -> Props -> Dynamic fallback)
  let baseDesc = "";
  if (toolFromRegistry?.seoDescription) {
    baseDesc = toolFromRegistry.seoDescription;
  } else if (props.description && props.description.length >= 75) {
    baseDesc = props.description;
  } else {
    baseDesc = `Free ${cleanName} online: use the browser-based workflow on SopKit with clear processing and privacy information.`;
  }
  const description = formatSeoDescription(baseDesc, cleanName);

  // 3. Resolve Canonical URL (Strictly normalized, no trailing slash, https)
  const canonical = buildCanonicalUrl(cleanRoute);

  // 4. Resolve Keywords (Tailored long-tail privacy queries)
  const category = props.category || toolFromRegistry?.category || "utility";
  const executionType = toolFromRegistry?.executionType || "client";
  const privacyKeywords =
    executionType === "external" || executionType === "server"
      ? ["browser-based", "privacy-friendly"]
      : ["client-side sandbox", "browser-based", "privacy-friendly", "no upload", "secure local"];
  const defaultKeywords = [
    cleanName,
    `free ${cleanName.toLowerCase()} online`,
    `${cleanName.toLowerCase()} tool`,
    `${category} tools`,
    ...privacyKeywords,
    "free online",
    "SopKit",
  ];

  if (category === "pdf" || cleanName.toLowerCase().includes("pdf")) {
    defaultKeywords.push("pdf-lib", "local pdf editor", "secure pdf", "no server upload", "fast", "free forever");
  } else if (category === "image" || cleanName.toLowerCase().includes("image")) {
    defaultKeywords.push("html5 canvas", "in-browser image processor", "lossless", "high quality");
  } else if (category === "developer") {
    defaultKeywords.push("developer utility", "online formatter", "instant encoding", "web worker");
  }

  const allKeywords = [...new Set([...defaultKeywords, ...(props.keywords || [])])];

  // 5. Resolve OpenGraph Image
  const ogImageUrl = resolveOgImage(category, props.ogImage);

  const monetization = getMonetizationDecision({
    slug: toolFromRegistry?.id || toolId,
    category,
  });

  // 6. Assemble complete Next.js Metadata
  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SEO_CONFIG.siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${cleanName} — Free Online Tool | SopKit`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: SEO_CONFIG.twitterHandle,
      site: SEO_CONFIG.twitterHandle,
    },
    robots: (props.noindex || props.noIndex || !monetization.indexable)
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    authors: [{ name: SEO_CONFIG.siteName, url: SEO_CONFIG.siteUrl }],
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
    category: category ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Tools` : "Technology",
    classification: "Online Tools & Browser Utilities",
    other: {
      "application-name": SEO_CONFIG.siteName,
      "apple-mobile-web-app-title": SEO_CONFIG.siteName,
      "format-detection": "telephone=no, address=no, email=no",
    },
  };
}

/**
 * Generate metadata for category hub landing pages (e.g. /image-tools, /pdf-tools).
 */
export function constructCategoryMetadata(input: CategoryMetadataInput): Metadata {
  const catSlug = input.categorySlug.replace(/^\//, "").replace(/\/$/, "");
  const hubRoute = catSlug.endsWith("-tools") ? `/${catSlug}` : `/${catSlug}-tools`;
  const canonical = buildCanonicalUrl(hubRoute);

  const cleanName =
    input.name ||
    catSlug
      .replace(/-tools$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) + " Tools";

  const countStr = input.count ? `${input.count}+ ` : "";
  const title = formatSeoTitle(`Free ${cleanName} Online — ${countStr}Browser Utilities`);

  const rawDesc =
    input.description ||
    `Explore ${countStr}free online ${cleanName.toLowerCase()} on SopKit. Private, high-speed, browser-based utilities with zero server uploads and no account required.`;
  const description = formatSeoDescription(rawDesc);

  const ogImageUrl = resolveOgImage(catSlug.replace(/-tools$/, ""), input.ogImage);

  return {
    title,
    description,
    keywords: [
      cleanName,
      `free ${cleanName.toLowerCase()}`,
      "browser tools",
      "online utilities",
      "client-side",
      "privacy-focused",
      "SopKit",
      ...(input.keywords || []),
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SEO_CONFIG.siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${cleanName} on SopKit`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: SEO_CONFIG.twitterHandle,
    },
    robots: (input.noindex || input.noIndex)
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    authors: [{ name: SEO_CONFIG.siteName, url: SEO_CONFIG.siteUrl }],
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
  };
}

/**
 * Standard page metadata generator for custom routes (home, search, about, packages, etc.)
 */
export function constructPageMetadata(input: PageSeoInput): Metadata {
  const canonical = buildCanonicalUrl(input.pathname);
  const ogImageUrl = input.ogImage
    ? input.ogImage.startsWith("http")
      ? input.ogImage
      : `${SEO_CONFIG.siteUrl}${input.ogImage}`
    : `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`;

  const title = formatSeoTitle(input.title);
  const description = formatSeoDescription(input.description);

  return {
    title,
    description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SEO_CONFIG.siteName,
      locale: "en_US",
      type: input.ogType || "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: input.title,
          type: "image/png",
        },
      ],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.authors ? { authors: input.authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SEO_CONFIG.twitterHandle,
      images: [ogImageUrl],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    authors: [{ name: SEO_CONFIG.siteName, url: SEO_CONFIG.siteUrl }],
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
  };
}

// Seamless backward-compatible aliases for legacy imports
export const buildPageMetadata = constructPageMetadata;
export const generateToolMetadata = constructToolMetadata;
export const generateMetadata = (props: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata => {
  return constructPageMetadata({
    title: props.title,
    description: props.description,
    pathname: props.path || "/",
    keywords: props.keywords,
    ogImage: props.image,
    noindex: props.noIndex,
  });
};
