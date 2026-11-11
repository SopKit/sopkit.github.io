import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import { blogs } from "@/constants/blog-data";
import { getToolByRoute } from "@/lib/tools";

// The blog article page resolves each featured/section route through
// getToolByRoute and drops anything that does not resolve, with no warning.
// These tests pin the invariant through the exact production resolution
// path, so a hub route, a directory route or an invented route can never
// again silently remove a tool card from an article. The prebuild script
// scripts/validate-blog-tool-routes.ts enforces the same invariant on the
// committed source text.

interface BlogRedirect {
  from: string;
  to: string;
  reason: string;
}

const blogRedirects: BlogRedirect[] = JSON.parse(
  fs.readFileSync(new URL("../../src/seo/redirects/blog.json", import.meta.url), "utf8"),
);

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

  it("the previously broken article that survived the thin-post retirement still points at its intended tool", () => {
    // Seven articles were pinned here originally. Six of them were thin
    // posts (under 180 words) and were retired with redirects recorded in
    // src/seo/redirects/blog.json, so only this one remains to pin.
    const bySlug = new Map(blogs.map((article) => [article.slug, article]));

    const expected: Array<[string, string]> = [
      // Engineering unit conversions: no generic unit-converter tool
      // exists; Length Converter is the flagship metric/imperial converter.
      ["standardizing-engineering-workflows-precision-unit-converters", "/length-converter"],
    ];

    for (const [slug, route] of expected) {
      const article = bySlug.get(slug);
      expect(article).toBeDefined();
      expect(article?.featuredToolRoutes).toContain(route);
      expect(getToolByRoute(route)?.route).toBe(route);
    }
  });
});

describe("Retired thin blog posts", () => {
  it("stay out of the blog list and redirect to a real tool route or the blog index", () => {
    const liveSlugs = new Set(blogs.map((article) => article.slug));
    const stillPublished: string[] = [];
    const badTargets: string[] = [];

    expect(blogRedirects.length).toBeGreaterThan(0);

    for (const redirect of blogRedirects) {
      const slug = redirect.from.replace(/^\/blog\//, "");
      if (liveSlugs.has(slug)) {
        stillPublished.push(slug);
      }
      const targetIsBlogIndex = redirect.to === "/blog";
      if (!targetIsBlogIndex && !getToolByRoute(redirect.to)) {
        badTargets.push(`${redirect.from} -> ${redirect.to}`);
      }
    }

    expect(stillPublished).toEqual([]);
    expect(badTargets).toEqual([]);
  });
});
