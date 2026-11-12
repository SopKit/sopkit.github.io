/**
 * @file src/seo/canonical.ts
 * @description Strict canonical URL normalization for SopKit.
 * Strips tracking parameters, normalizes trailing slashes, and enforces HTTPS.
 *
 * Trailing-slash policy: the site is exported with `trailingSlash: true`
 * (GitHub Pages serves every page as `<path>/index.html`), so the only
 * form that resolves without a 301 is `https://sopkit.space/<slug>/`.
 * Next.js already rewrites the rendered `<link rel="canonical">` and
 * `og:url` into that form; this helper emits the same form so sitemaps,
 * JSON-LD, feeds, and share links agree with the rendered tags. File-like
 * paths (a last segment with an extension such as `.xml`, `.txt`, `.md`)
 * are left slashless because they are real files, not page directories.
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

const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{1,8}$/i;

/**
 * True when the last path segment carries a file extension (`/sitemap.xml`,
 * `/tool-markdown/foo.md`), which the static export serves as a plain file.
 */
export function isFileLikePath(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop() ?? "";
  return FILE_EXTENSION_PATTERN.test(lastSegment);
}

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

    // Normalize path: collapse double slashes, then apply the trailing-slash
    // policy (page directories end with "/", files do not).
    const collapsed = url.pathname.replace(/\/+/g, "/");
    const stripped = collapsed.length > 1 && collapsed.endsWith("/")
      ? collapsed.slice(0, -1)
      : collapsed;
    const pathname = stripped === "/" || isFileLikePath(stripped)
      ? stripped
      : `${stripped}/`;

    url.pathname = pathname;
    return url.origin + url.pathname + (url.search ? url.search : "");
  } catch {
    return `${SEO_CONFIG.siteUrl}/`;
  }
}
