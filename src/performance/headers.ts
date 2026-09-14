/**
 * @file src/performance/headers.ts
 * @description HTTP Caching & Edge Optimization headers for SopKit.
 * Directly resolves the ~444 KiB savings potential flagged in baseline PageSpeed audit.
 */

export interface CacheStrategy {
  cacheControl: string;
  cdnCacheControl?: string;
  surrogateControl?: string;
}

export const CACHE_STRATEGIES = {
  /**
   * Immutable assets: Hashed JS/CSS bundles, fonts, static SVGs.
   * Cached for 1 year both in browser and CDN.
   */
  IMMUTABLE_STATIC: {
    cacheControl: "public, max-age=31536000, immutable",
    cdnCacheControl: "public, max-age=31536000",
  },

  /**
   * Optimized images and media assets.
   * Cached for 30 days, revalidated if content changes.
   */
  OPTIMIZED_MEDIA: {
    cacheControl: "public, max-age=2592000, stale-while-revalidate=86400",
    cdnCacheControl: "public, max-age=31536000",
  },

  /**
   * Public Static Pages (HTML / SSG / ISR).
   * Fast edge delivery with stale-while-revalidate for instantaneous loads.
   */
  PUBLIC_PAGE_ISR: {
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    cdnCacheControl: "public, max-age=86400, stale-while-revalidate=604800",
  },

  /**
   * Tool Metadata and Public Manifests (e.g. sitemap, robots, search index).
   * 1-day edge cache with 7-day stale allowance.
   */
  PUBLIC_METADATA: {
    cacheControl: "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    cdnCacheControl: "public, max-age=604800",
  },

  /**
   * Dynamic APIs or Real-time validation endpoints.
   * Short cache or no-store.
   */
  DYNAMIC_API: {
    cacheControl: "public, max-age=60, s-maxage=300, stale-while-revalidate=60",
  },

  /**
   * Private or user-specific data (strictly zero cache).
   */
  PRIVATE_NO_STORE: {
    cacheControl: "private, no-cache, no-store, must-revalidate",
  },
} as const satisfies Record<string, CacheStrategy>;

/**
 * Returns response header dictionary for a given asset type
 */
export function getCacheHeaders(strategy: keyof typeof CACHE_STRATEGIES): Record<string, string> {
  const chosen = CACHE_STRATEGIES[strategy];
  const headers: Record<string, string> = {
    "Cache-Control": chosen.cacheControl,
  };
  if ("cdnCacheControl" in chosen && chosen.cdnCacheControl) {
    headers["CDN-Cache-Control"] = chosen.cdnCacheControl;
    headers["Cloudflare-CDN-Cache-Control"] = chosen.cdnCacheControl;
  }
  return headers;
}
