/**
 * @file src/seo/canonical.ts
 * @description Strict canonical URL normalization for SopKit.
 * Strips tracking parameters, handles trailing slashes, and enforces HTTPS.
 */

import { SEO_CONFIG } from "./config";

const DISALLOWED_QUERY_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "_ga",
  "ref",
];

/**
 * Resolves a canonical URL from any input URL or pathname
 */
export function buildCanonicalUrl(pathOrUrl: string): string {
  try {
    let url: URL;
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      url = new URL(pathOrUrl);
    } else {
      const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
      url = new URL(cleanPath, SEO_CONFIG.siteUrl);
    }

    // Strip tracking parameters
    for (const param of DISALLOWED_QUERY_PARAMS) {
      url.searchParams.delete(param);
    }

    // Normalize hostname
    url.protocol = "https:";
    url.host = new URL(SEO_CONFIG.siteUrl).host;

    // Normalize path (ensure leading slash, strip redundant double slashes)
    let pathname = url.pathname.replace(/\/+/g, "/");
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    url.pathname = pathname;
    return url.origin + url.pathname + (url.search ? url.search : "");
  } catch {
    return `${SEO_CONFIG.siteUrl}/`;
  }
}
