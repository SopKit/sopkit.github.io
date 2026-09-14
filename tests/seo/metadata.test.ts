import { describe, it, expect } from "bun:test";
import { buildCanonicalUrl } from "../../src/seo/canonical";
import { validateSeoMetadata } from "../../src/seo/validators";

describe("SEO Platform & Canonical Resolution", () => {
  it("normalizes canonical URLs properly", () => {
    const raw = "http://sopkit.github.io/tools/image-compressor/?utm_source=twitter&ref=abc";
    const canonical = buildCanonicalUrl(raw);
    expect(canonical).toBe("https://sopkit.github.io/tools/image-compressor");
  });

  it("handles relative path canonicals", () => {
    const canonical = buildCanonicalUrl("/ai-image-generator/");
    expect(canonical).toBe("https://sopkit.github.io/ai-image-generator");
  });

  it("validates SEO metadata constraints", () => {
    const result = validateSeoMetadata({
      title: "AI Image Generator — Free Text to Image Online | SopKit",
      description: "Generate stunning AI images from text prompts instantly. 100% private, free forever in browser with zero file uploads or logins required.",
      canonical: "https://sopkit.github.io/ai-image-generator",
      h1Count: 1,
    });

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("flags missing or bad SEO metadata", () => {
    const result = validateSeoMetadata({
      title: "",
      description: "too short",
      canonical: "http://malicious.com",
      h1Count: 2,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Title"))).toBe(true);
    expect(result.errors.some((e) => e.includes("Canonical"))).toBe(true);
    expect(result.errors.some((e) => e.includes("H1"))).toBe(true);
  });
});
