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
});
