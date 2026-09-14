/**
 * @file src/features/tools/types.ts
 * @description Standardized ToolDefinition and runtime contracts for SopKit tools platform.
 */

export type ToolRuntimeMode = "client" | "server" | "hybrid";
export type ToolProcessingTarget = "browser" | "worker" | "edge" | "server";
export type ToolBundleClass = "light" | "medium" | "heavy";

export interface ToolPerformanceSpec {
  runtimeMode: ToolRuntimeMode;
  processing: ToolProcessingTarget;
  bundleClass: ToolBundleClass;
  lazyLoad: boolean;
  thirdPartyDependencies: string[];
  maxPayloadMb?: number;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  route: string;
  icon?: string;
  popular?: boolean;
  featured?: boolean;
  tags?: string[];
  performance: ToolPerformanceSpec;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface ToolCategorySummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  toolCount: number;
}
