import { describe, it, expect } from "bun:test";
import {
  buildWebSiteSchema,
  buildSoftwareAppSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "../../src/seo/structured-data";

describe("Schema.org JSON-LD Builders", () => {
  it("builds valid WebSite & Organization schema", () => {
    const schema = buildWebSiteSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(Array.isArray(schema["@graph"])).toBe(true);
    expect(schema["@graph"][0]["@type"]).toBe("WebSite");
  });

  it("builds valid SoftwareApplication schema", () => {
    const schema = buildSoftwareAppSchema({
      name: "PDF Compressor",
      description: "Compress PDF files online securely in browser.",
      url: "https://sopkit.space/pdf-compressor",
      applicationCategory: "UtilityApplication",
    });

    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.name).toBe("PDF Compressor");
    expect(schema.offers?.price).toBe("0");
  });

  it("builds valid BreadcrumbList schema", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Home", item: "https://sopkit.space" },
      { name: "Tools", item: "https://sopkit.space/tools" },
      { name: "PDF Compressor", item: "https://sopkit.space/pdf-compressor" },
    ]);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement.length).toBe(3);
    expect(schema.itemListElement[0].position).toBe(1);
  });

  it("builds FAQ schema when items are present", () => {
    const schema = buildFaqSchema([
      { question: "Is it free?", answer: "Yes, 100% free forever." },
    ]);

    expect(schema).not.toBeNull();
    expect(schema?.["@type"]).toBe("FAQPage");
    expect(schema?.mainEntity.length).toBe(1);
  });
});
