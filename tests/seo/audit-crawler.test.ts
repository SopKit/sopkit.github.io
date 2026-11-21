import { describe, expect, it } from "bun:test";
import { metadataProblems, parseHtml } from "../../scripts/seo-audit-local.mjs";

const url = "https://sopkit.space/example/";
const html = `<title>Example | SopKit</title>
<meta content="An example description" name="description">
<link href="${url}" rel="canonical">
<meta content="index, follow" name="robots">
<meta content="Example | SopKit" property="og:title">
<meta content="An example description" property="og:description">
<meta content="${url}" property="og:url">
<meta content="https://sopkit.space/og-image.jpg" property="og:image">
<meta content="summary_large_image" name="twitter:card">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>
<h1>Example</h1>`;

describe("SEO crawler regression coverage", () => {
  it("accepts complete metadata with attributes in either order", () => {
    expect(metadataProblems(parseHtml(html), url)).toEqual([]);
    expect(parseHtml(html).h1Count).toBe(1);
  });

  it("rejects missing JSON-LD instead of passing an empty script list", () => {
    expect(metadataProblems(parseHtml(html.replace(/<script[\s\S]*?<\/script>/, "")), url)).toContain("JSON-LD missing or invalid");
  });

  it("rejects invalid JSON-LD", () => {
    expect(parseHtml(html.replace('"WebPage"', "invalid" )).jsonLdValid).toBe(false);
  });

  it("rejects inherited social URLs and missing images", () => {
    const page = parseHtml(html.replace(`content="${url}" property="og:url"`, 'content="https://sopkit.space/" property="og:url"').replace(/<meta[^>]+property="og:image">/, ""));
    expect(metadataProblems(page, url)).toContain("og:url must exactly match the sitemap URL");
    expect(metadataProblems(page, url)).toContain("missing absolute HTTPS og:image");
  });

  it("rejects duplicate or slashless canonicals", () => {
    expect(metadataProblems(parseHtml(html + `<link rel="canonical" href="${url}">`), url)).toContain("canonical must exactly match the sitemap URL");
    expect(metadataProblems(parseHtml(html.replace(`href="${url}"`, 'href="https://sopkit.space/example"')), url)).toContain("canonical must exactly match the sitemap URL");
  });

  it("rejects noindex and none directives for sitemap pages", () => {
    for (const name of ["robots", "googlebot"]) {
      for (const content of ["noindex, follow", "NONE"]) {
        expect(metadataProblems(parseHtml(html + `<meta content="${content}" name="${name}">`), url)).toContain("sitemap URL is noindex");
      }
    }
  });
});
