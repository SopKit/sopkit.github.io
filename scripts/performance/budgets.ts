/**
 * @file scripts/performance/budgets.ts
 * @description Performance budget CLI helpers and assertions.
 */

import {
  MOBILE_CATEGORY_BUDGETS,
  DESKTOP_CATEGORY_BUDGETS,
  getPagePerformanceProfile,
  resolveRouteCategory,
} from "../../src/performance";

export {
  MOBILE_CATEGORY_BUDGETS,
  DESKTOP_CATEGORY_BUDGETS,
  getPagePerformanceProfile,
  resolveRouteCategory,
};

export function getRepresentativeRouteMatrix() {
  return [
    { name: "Homepage", path: "/", category: "marketing" },
    { name: "Tool Directory", path: "/tools", category: "directory" },
    { name: "PDF Category Hub", path: "/pdf-tools", category: "tool" },
    { name: "Lightweight Tool (JSON Formatter)", path: "/json-formatter", category: "tool" },
    { name: "Medium Tool (Image Compressor)", path: "/image-compressor", category: "tool" },
    { name: "Heavy Tool (Merge PDF)", path: "/merge-pdf-online", category: "tool" },
    { name: "Search Hub", path: "/search", category: "directory" },
    { name: "Embed Route", path: "/embed-tool", category: "utility" },
  ];
}
