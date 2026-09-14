import { describe, it, expect } from "bun:test";
import { getToolBySlug, getToolById, getAllTools, getAllCategories } from "../../src/features/tools/registry";
import { getRelatedTools } from "../../src/features/tools/relationships";

describe("Tool Registry Platform", () => {
  it("loads all tools from tools.json", () => {
    const tools = getAllTools();
    expect(tools.length).toBeGreaterThanOrEqual(600);
  });

  it("loads all categories", () => {
    const categories = getAllCategories();
    expect(categories.length).toBeGreaterThanOrEqual(15);
  });

  it("finds a tool by slug", () => {
    const tool = getToolBySlug("ai-image-generator");
    expect(tool).toBeDefined();
    expect(tool?.name).toBe("AI Image Generator");
    expect(tool?.category).toBe("Fun Generators");
  });

  it("finds a tool by id", () => {
    const tool = getToolById("ai-image-generator");
    expect(tool).toBeDefined();
    expect(tool?.id).toBe("ai-image-generator");
  });

  it("computes related tools without crashing", () => {
    const related = getRelatedTools("ai-image-generator", 5);
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(5);
    expect(related.some((t) => t.id === "ai-image-generator")).toBe(false);
  });
});
