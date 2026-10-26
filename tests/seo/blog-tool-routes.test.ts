import { describe, it, expect } from "bun:test";
import { blogs } from "@/constants/blog-data";
import { getToolByRoute } from "@/lib/tools";

// The blog article page resolves each featured/section route through
// getToolByRoute and drops anything that does not resolve, with no warning.
// These tests pin the invariant through the exact production resolution
// path, so a hub route, a directory route or an invented route can never
// again silently remove a tool card from an article. The prebuild script
// scripts/validate-blog-tool-routes.ts enforces the same invariant on the
// committed source text.

describe("Blog article tool routes resolve to real tools", () => {
  it("every featuredToolRoutes and toolRoutes entry resolves via getToolByRoute", () => {
    const unresolved: string[] = [];
    let checked = 0;

    for (const article of blogs) {
      const entries: Array<{ field: string; route: string }> = [];
      for (const route of article.featuredToolRoutes || []) {
        entries.push({ field: "featuredToolRoutes", route });
      }
      for (const section of article.sections || []) {
        for (const route of section.toolRoutes || []) {
          entries.push({ field: "toolRoutes", route });
        }
      }
      for (const { field, route } of entries) {
        checked += 1;
        if (!getToolByRoute(route)) {
          unresolved.push(`${article.slug} (${field}): ${route}`);
        }
      }
    }

    expect(checked).toBeGreaterThan(0);
    expect(unresolved).toEqual([]);
  });

  it("the seven previously broken articles now point at their intended tools", () => {
    const bySlug = new Map(blogs.map((article) => [article.slug, article]));

    const expected: Array<[string, string]> = [
      // Engineering unit conversions: no generic unit-converter tool
      // exists; Length Converter is the flagship metric/imperial converter.
      ["standardizing-engineering-workflows-precision-unit-converters", "/length-converter"],
      // FY 2026-27 tax regimes, not a generic (non-existent) tax tool.
      ["new-vs-old-tax-regime-fy-2026-27", "/income-tax-calculator"],
      // CBSE 9.5x / VTU / Mumbai formulas: the India variant.
      ["cgpa-to-percentage-official-formula", "/cgpa-to-percentage-calculator-india"],
      ["attendance-shortage-calculator-guide", "/attendance-shortage-calculator"],
      ["what-is-robots-txt-guide", "/robots-txt-sitemap-generator"],
      // The SEO Toolkit measures Core Web Vitals (LCP/FID/CLS).
      ["core-web-vitals-explained-simply", "/seotoolkit"],
      // Legacy Kruti Dev fonts to Unicode.
      ["devanagari-unicode-converter-guide", "/kruti-dev-to-unicode"],
    ];

    for (const [slug, route] of expected) {
      const article = bySlug.get(slug);
      expect(article).toBeDefined();
      expect(article?.featuredToolRoutes).toContain(route);
      expect(getToolByRoute(route)?.route).toBe(route);
    }
  });

  it("the whole-directory article carries no tool route (no single tool represents it)", () => {
    const article = blogs.find(
      (candidate) => candidate.slug === "560-free-tools-sopkit-directory",
    );
    expect(article).toBeDefined();
    expect(article?.featuredToolRoutes || []).toEqual([]);
    const sectionRoutes = (article?.sections || []).flatMap(
      (section) => section.toolRoutes || [],
    );
    expect(sectionRoutes).toEqual([]);
  });
});
