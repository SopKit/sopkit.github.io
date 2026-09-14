/**
 * @file sopkit-backend/src/cache/edge-cache.ts
 * @description Cache helper for Cloudflare Workers / Edge runtime.
 */

export class EdgeCache {
  public static getCacheHeaders(ttlSeconds: number = 3600): Record<string, string> {
    return {
      "Cache-Control": `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}, stale-while-revalidate=86400`,
      "CDN-Cache-Control": `public, max-age=${ttlSeconds * 2}`,
    };
  }
}
