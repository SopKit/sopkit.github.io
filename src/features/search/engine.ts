/**
 * @file src/features/search/engine.ts
 * @description Fast server/client search engine supporting exact match, synonyms, and categories.
 */

import { ToolDefinition } from "../tools/types";
import { getAllTools } from "../tools/registry";

export interface SearchResult {
  tool: ToolDefinition;
  score: number;
  matchType: "exact" | "prefix" | "tag" | "description";
}

export function searchTools(query: string, limit: number = 20): SearchResult[] {
  if (!query || query.trim().length === 0) return [];

  const allTools = getAllTools();
  const cleanQ = query.trim().toLowerCase();
  const queryTokens = cleanQ.split(/\s+/).filter((t) => t.length > 0);

  const results: SearchResult[] = [];

  for (const tool of allTools) {
    const nameLower = (tool.name || "").toLowerCase();
    const idLower = (tool.id || "").toLowerCase();
    const slugLower = (tool.slug || "").toLowerCase();
    const descLower = (tool.description || "").toLowerCase();
    const catLower = (tool.category || "").toLowerCase();

    // 1. Exact name/id match
    if (nameLower === cleanQ || idLower === cleanQ || slugLower === cleanQ) {
      results.push({ tool, score: 100, matchType: "exact" });
      continue;
    }

    // 2. Name prefix or substring
    if (nameLower.startsWith(cleanQ)) {
      results.push({ tool, score: 80, matchType: "prefix" });
      continue;
    }

    // 3. Token match in name or category
    let tokenScore = 0;
    for (const token of queryTokens) {
      if (nameLower.includes(token)) tokenScore += 25;
      if (catLower.includes(token)) tokenScore += 15;
      if (tool.tags?.some((t) => t.toLowerCase().includes(token))) tokenScore += 10;
      if (descLower.includes(token)) tokenScore += 5;
    }

    if (tokenScore > 0) {
      results.push({ tool, score: tokenScore, matchType: "description" });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
