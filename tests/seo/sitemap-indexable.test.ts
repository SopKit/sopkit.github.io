import { describe, it, expect } from "bun:test";
import sitemap from "@/app/sitemap";
import { getAllTools } from "@/lib/tools";
import { getMonetizationDecision } from "@/data/monetization";

// A sitemap must list only URLs a crawler can index. Static entries in
// src/app/sitemap.ts bypass the monetization indexable filter (they are
// prepended and win the first-registration dedup), which is how two
// noindex hubs (/video-tools, /api-key-tester) and three redirect pages
// (/api-key-testers, /pro, /hire) ended up listed at 755 URLs. These
// tests pin the invariant through the real route-sitemap output, so a
// static entry can never again smuggle a noindex or redirect URL into
// the sitemap. The prebuild script
// scripts/validate-sitemap-indexable.ts enforces the same invariant on
// the committed public sitemap and on both static lists.

const ROUTE_SITEMAP_URLS = new Set(
  sitemap().map((entry) => entry.url.replace("https://sopkit.space", "") || "/"),
);

describe("Route sitemap lists only indexable URLs", () => {
  it("contains no route whose monetization decision is non-indexable", () => {
    const listed: string[] = [];
    for (const tool of getAllTools()) {
      const decision = getMonetizationDecision({
        slug: tool.id,
        category: tool.category,
      });
      if (!decision.indexable && ROUTE_SITEMAP_URLS.has(tool.route)) {
        listed.push(`${tool.route} (id=${tool.id})`);
      }
    }
    expect(listed).toEqual([]);
  });

  it("excludes the five previously listed noindex/redirect routes", () => {
    const excluded = [
      "/video-tools",
      "/api-key-tester",
      "/api-key-testers",
      "/pro",
      "/hire",
    ];
    for (const route of excluded) {
      expect(ROUTE_SITEMAP_URLS.has(route)).toBe(false);
    }
    // Precedent: the literal-noindex YouTube hub was already excluded.
    expect(ROUTE_SITEMAP_URLS.has("/youtube-tools")).toBe(false);
  });

  it("has no duplicate URLs and still lists the bulk of the site", () => {
    const urls = sitemap().map(
      (entry) => entry.url.replace("https://sopkit.space", "") || "/",
    );
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.length).toBeGreaterThan(700);
  });
});
