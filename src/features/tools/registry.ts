/**
 * @file src/features/tools/registry.ts
 * @description Server-side Tool Registry loader and querying engine.
 * Eliminates client-side shipping of the raw 355 KiB tools.json file.
 */

import fs from "fs";
import path from "path";
import { ToolDefinition, ToolCategorySummary, ToolBundleClass } from "./types";

interface RawToolEntry {
  id: string;
  name: string;
  description: string;
  route?: string;
  path?: string;
  popular?: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  keywords?: string[];
  icon?: string;
}

interface RawCategoryEntry {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  tools: RawToolEntry[];
}

interface RawToolsJson {
  metadata?: {
    totalTools: number;
    totalCategories: number;
  };
  categories: Record<string, RawCategoryEntry>;
}

// In-memory server cache
let cachedTools: ToolDefinition[] | null = null;
let cachedCategories: ToolCategorySummary[] | null = null;
let cachedToolsBySlug: Map<string, ToolDefinition> | null = null;
let cachedToolsById: Map<string, ToolDefinition> | null = null;

function inferBundleClass(id: string, category: string): ToolBundleClass {
  const heavyKeywords = ["pdf", "compress", "video", "audio", "ocr", "excel", "docx", "canvas"];
  const mediumKeywords = ["image", "generator", "qr", "chart", "converter"];

  const combined = `${id} ${category}`.toLowerCase();
  if (heavyKeywords.some((kw) => combined.includes(kw))) return "heavy";
  if (mediumKeywords.some((kw) => combined.includes(kw))) return "medium";
  return "light";
}

function loadRegistry() {
  if (cachedTools && cachedCategories && cachedToolsBySlug && cachedToolsById) {
    return;
  }

  const tools: ToolDefinition[] = [];
  const categories: ToolCategorySummary[] = [];
  const bySlug = new Map<string, ToolDefinition>();
  const byId = new Map<string, ToolDefinition>();

  try {
    const filePath = path.resolve(process.cwd(), "src/constants/tools.json");
    if (fs.existsSync(filePath)) {
      const data: RawToolsJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      for (const [catKey, catObj] of Object.entries(data.categories || {})) {
        const catSlug = catObj.slug || catKey;
        categories.push({
          id: catKey,
          slug: catSlug,
          name: catObj.name,
          description: catObj.description || `Free online ${catObj.name} tools.`,
          icon: catObj.icon,
          toolCount: catObj.tools?.length || 0,
        });

        for (const raw of catObj.tools || []) {
          const route = raw.route || raw.path || `/${raw.id}`;
          const cleanRoute = route.startsWith("/") ? route : `/${route}`;
          const slug = cleanRoute.replace(/^\//, "").replace(/\/$/, "");
          const bundleClass = inferBundleClass(raw.id, catObj.name);

          const toolDef: ToolDefinition = {
            id: raw.id,
            slug,
            name: raw.name,
            description: raw.description,
            category: catObj.name,
            categorySlug: catSlug,
            route: cleanRoute,
            icon: raw.icon,
            popular: Boolean(raw.popular),
            featured: Boolean(raw.featured),
            tags: raw.tags || [],
            seoTitle: raw.seoTitle,
            seoDescription: raw.seoDescription,
            keywords: raw.keywords || [],
            performance: {
              runtimeMode: "client",
              processing: "browser",
              bundleClass,
              lazyLoad: bundleClass !== "light",
              thirdPartyDependencies: [],
            },
          };

          tools.push(toolDef);
          bySlug.set(slug, toolDef);
          byId.set(raw.id, toolDef);
        }
      }
    }
  } catch (err) {
    console.error("Failed to initialize server-side tools registry:", err);
  }

  cachedTools = tools;
  cachedCategories = categories;
  cachedToolsBySlug = bySlug;
  cachedToolsById = byId;
}

/**
 * Get a single tool definition by slug (or route)
 */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  loadRegistry();
  const cleanSlug = slug.replace(/^\//, "").replace(/\/$/, "");
  return cachedToolsBySlug?.get(cleanSlug);
}

/**
 * Get a single tool definition by ID
 */
export function getToolById(id: string): ToolDefinition | undefined {
  loadRegistry();
  return cachedToolsById?.get(id);
}

/**
 * Get all loaded tools
 */
export function getAllTools(): ToolDefinition[] {
  loadRegistry();
  return cachedTools || [];
}

/**
 * Get tools belonging to a category
 */
export function getToolsByCategory(categorySlug: string): ToolDefinition[] {
  loadRegistry();
  const cleanCat = categorySlug.toLowerCase().replace(/^\//, "");
  return (cachedTools || []).filter(
    (t) => t.categorySlug.toLowerCase() === cleanCat || t.category.toLowerCase().replace(/\s+/g, "-") === cleanCat
  );
}

/**
 * Get all category summaries
 */
export function getAllCategories(): ToolCategorySummary[] {
  loadRegistry();
  return cachedCategories || [];
}
