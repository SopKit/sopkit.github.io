/**
 * @file src/features/tools/relationships.ts
 * @description Centralized related tools and entity link resolution engine.
 */

import { ToolDefinition } from "./types";
import { getAllTools, getToolById } from "./registry";

/**
 * Computes related tools based on category, shared tags, and name similarity
 */
export function getRelatedTools(toolId: string, limit: number = 8): ToolDefinition[] {
  const currentTool = getToolById(toolId);
  if (!currentTool) return [];

  const allTools = getAllTools();
  const currentTags = new Set((currentTool.tags || []).map((t) => t.toLowerCase()));
  const currentWords = new Set(
    currentTool.name.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  );

  const scored = allTools
    .filter((t) => t.id !== currentTool.id)
    .map((tool) => {
      let score = 0;

      // Same category gets high baseline
      if (tool.categorySlug === currentTool.categorySlug) {
        score += 10;
      }

      // Shared tags
      for (const tag of tool.tags || []) {
        if (currentTags.has(tag.toLowerCase())) {
          score += 4;
        }
      }

      // Shared keyword overlap in name
      const toolWords = tool.name.toLowerCase().split(/\s+/);
      for (const word of toolWords) {
        if (currentWords.has(word)) {
          score += 3;
        }
      }

      // Boost popular items slightly for discoverability
      if (tool.popular) {
        score += 1;
      }

      return { tool, score };
    });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.tool);
}
