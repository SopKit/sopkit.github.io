import { describe, it, expect } from "bun:test";
import { searchTools } from "../../src/features/search/engine";

describe("Search Engine", () => {
  it("returns empty array for empty query", () => {
    expect(searchTools("")).toEqual([]);
    expect(searchTools("   ")).toEqual([]);
  });

  it("finds tools by exact match", () => {
    const results = searchTools("ai image generator");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].tool.name).toBe("AI Image Generator");
    expect(results[0].matchType).toBe("exact");
  });

  it("finds tools by keyword token", () => {
    const results = searchTools("compress");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.tool.name.toLowerCase().includes("compress"))).toBe(true);
  });

  it("verifies all getSearchToolRecords have non-empty string categories", async () => {
    const { getSearchToolRecords } = await import("../../src/lib/tools");
    const records = getSearchToolRecords();
    expect(records.length).toBeGreaterThan(500);
    for (const record of records) {
      expect(typeof record.category).toBe("string");
      expect(record.category.length).toBeGreaterThan(0);
      // Ensure .replace("-tools", "") never throws
      expect(() => record.category.replace("-tools", "")).not.toThrow();
    }
  });
});

