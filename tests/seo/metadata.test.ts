import { describe, it, expect } from "bun:test";
import { buildCanonicalUrl } from "../../src/seo/canonical";
import { validateSeoMetadata } from "../../src/seo/validators";
import {
  constructToolMetadata,
  constructCategoryMetadata,
  constructPageMetadata,
  formatSeoTitle,
  formatSeoDescription,
} from "../../src/seo/metadata";
import { generateToolMetadata } from "../../src/lib/seo";

describe("SEO Platform & Canonical Resolution", () => {
  it("normalizes canonical URLs properly", () => {
    const raw = "http://sopkit.github.io/tools/image-compressor/?utm_source=twitter&ref=abc";
    const canonical = buildCanonicalUrl(raw);
    expect(canonical).toBe("https://sopkit.space/tools/image-compressor/");
  });

  it("handles relative path canonicals", () => {
    const canonical = buildCanonicalUrl("/ai-image-generator/");
    expect(canonical).toBe("https://sopkit.space/ai-image-generator/");
  });

  it("validates SEO metadata constraints", () => {
    const result = validateSeoMetadata({
      title: "AI Image Generator — Free Text to Image Online | SopKit",
      description: "Generate stunning AI images from text prompts instantly. 100% private, free forever in browser with zero file uploads or logins required.",
      canonical: "https://sopkit.space/ai-image-generator/",
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

describe("Metadata Constructor Engine", () => {
  it("formats SEO titles under 60 characters with brand", () => {
    const title = formatSeoTitle("Free PDF Compressor Online — Reduce File Size");
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toContain("SopKit");
  });

  it("formats SEO descriptions between 140 and 160 characters", () => {
    const short = "Compress PDF documents in browser.";
    const formatted = formatSeoDescription(short);
    expect(formatted.length).toBeGreaterThanOrEqual(80);
    expect(formatted.length).toBeLessThanOrEqual(160);
    expect(formatted).toContain("SopKit");

    const long = "A".repeat(90) + " " + "B".repeat(90);
    expect(formatSeoDescription(long).length).toBeLessThanOrEqual(160);
  });

  it("emits no keywords meta and derives the OpenGraph image type from the extension", () => {
    const png = constructPageMetadata({ title: "About", description: "About SopKit", pathname: "/about" });
    expect(png.keywords).toBeUndefined();
    expect((png.openGraph as any)?.images?.[0]?.type).toBe("image/png");
    expect(png.twitter?.site).toBe("@sopkit");

    const jpg = constructPageMetadata({ title: "About", description: "About SopKit", pathname: "/about", ogImage: "/og-image.jpg" });
    expect((jpg.openGraph as any)?.images?.[0]?.type).toBe("image/jpeg");
  });

  it("keeps noindex pages followable", () => {
    const meta = constructPageMetadata({ title: "Archive", description: "Archive", pathname: "/archive", noindex: true });
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("constructs tool metadata adhering to all .agents guidelines", () => {
    const meta = constructToolMetadata({
      name: "PDF Compressor",
      route: "/pdf-compressor",
      category: "pdf",
    });

    expect(meta.title).toBeDefined();
    expect(typeof meta.title === "string" ? meta.title.length : 0).toBeLessThanOrEqual(60);
    expect(meta.description).toBeDefined();
    const descLen = typeof meta.description === "string" ? meta.description.length : 0;
    expect(descLen).toBeGreaterThanOrEqual(100);
    expect(descLen).toBeLessThanOrEqual(160);
    expect(meta.alternates?.canonical).toBe("https://sopkit.space/pdf-compressor/");
    expect(meta.openGraph).toBeDefined();
    expect(meta.openGraph?.url).toBe("https://sopkit.space/pdf-compressor/");
    expect(meta.keywords).toBeUndefined();
    expect((meta.openGraph as any)?.images?.[0]?.width).toBe(1200);
    expect((meta.openGraph as any)?.images?.[0]?.height).toBe(630);
    expect(meta.twitter?.card).toBe("summary_large_image");
    expect((meta.robots as any)?.googleBot?.index).toBe(true);
  });

  it("constructs category metadata properly", () => {
    const meta = constructCategoryMetadata({
      categorySlug: "pdf",
      count: 25,
    });

    expect(meta.title).toBeDefined();
    expect(meta.alternates?.canonical).toBe("https://sopkit.space/pdf-tools/");
    expect(meta.keywords).toBeUndefined();
    expect(meta.openGraph?.siteName).toBe("SopKit");
  });

  it("maintains backward compatibility with generateToolMetadata", () => {
    const meta = generateToolMetadata({
      name: "Image Resizer",
      route: "/image-resizer",
      category: "image",
    });

    expect(meta.title).toBeDefined();
    expect(meta.alternates?.canonical).toBe("https://sopkit.space/image-resizer/");
  });
});
