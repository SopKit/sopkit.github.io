/**
 * @file src/features/tools/archetypes.ts
 * @description Centralized Tool Archetype system and Data Processing Governance.
 * Dictates workspace viewport widths, interaction models, and factual privacy disclosures.
 */

export type ToolArchetype =
  | "image-workspace"
  | "document-workspace"
  | "code-utility"
  | "calculator"
  | "generator"
  | "text-utility"
  | "seo-dashboard"
  | "batch-converter"
  | "default";

export type DataProcessingModel = "LOCAL" | "REMOTE" | "MIXED" | "NO_FILE_UPLOAD";

export interface DataProcessingInfo {
  type: DataProcessingModel;
  label: string;
  badgeText: string;
  description: string;
}

/**
 * Resolves the ideal interaction archetype based on tool characteristics.
 */
export function resolveToolArchetype(tool: {
  id?: string;
  category?: string;
  route?: string;
}): ToolArchetype {
  const id = (tool.id || "").toLowerCase();
  const category = (tool.category || "").toLowerCase();
  const route = (tool.route || "").toLowerCase();

  // 1. Image Workspace
  if (
    category.includes("image") ||
    id.includes("compress") ||
    id.includes("resiz") ||
    id.includes("crop") ||
    id.includes("photo") ||
    id.includes("enhancer") ||
    id.includes("passport") ||
    id.includes("background-remover")
  ) {
    if (id.includes("convert") && (id.includes("batch") || id.includes("to-"))) {
      return "batch-converter";
    }
    return "image-workspace";
  }

  // 2. Document & PDF Workspace
  if (
    category.includes("pdf") ||
    id.includes("pdf") ||
    id.includes("docx") ||
    id.includes("merge") ||
    id.includes("split-pdf")
  ) {
    return "document-workspace";
  }

  // 3. Code & Developer Input-Output Utility
  if (
    category.includes("developer") ||
    category.includes("code") ||
    id.includes("json") ||
    id.includes("xml") ||
    id.includes("jwt") ||
    id.includes("base64") ||
    id.includes("regex") ||
    id.includes("diff") ||
    id.includes("format") ||
    id.includes("minif") ||
    id.includes("obfuscat") ||
    id.includes("beautif") ||
    id.includes("sql") ||
    id.includes("hash")
  ) {
    return "code-utility";
  }

  // 4. Calculators
  if (
    category.includes("calculator") ||
    category.includes("finance") ||
    category.includes("money") ||
    id.includes("calc") ||
    id.includes("emi") ||
    id.includes("sip") ||
    id.includes("loan") ||
    id.includes("salary") ||
    id.includes("interest") ||
    id.includes("gpa") ||
    id.includes("bmi") ||
    id.includes("age")
  ) {
    return "calculator";
  }

  // 5. Generators
  if (
    category.includes("generator") ||
    id.includes("qr") ||
    id.includes("password") ||
    id.includes("uuid") ||
    id.includes("barcode") ||
    id.includes("lorem") ||
    id.includes("signature") ||
    id.includes("mock") ||
    id.includes("slug")
  ) {
    return "generator";
  }

  // 6. Text Utilities
  if (
    category.includes("text") ||
    id.includes("word-count") ||
    id.includes("case-converter") ||
    id.includes("markdown") ||
    id.includes("text-clean") ||
    id.includes("string")
  ) {
    return "text-utility";
  }

  // 7. SEO & Audit Dashboards
  if (
    category.includes("seo") ||
    id.includes("header") ||
    id.includes("redirect") ||
    id.includes("broken-link") ||
    id.includes("sitemap") ||
    id.includes("meta-tag") ||
    id.includes("speed") ||
    id.includes("whois") ||
    id.includes("dns")
  ) {
    return "seo-dashboard";
  }

  // 8. Batch Converters
  if (id.includes("batch") || id.includes("bulk") || (id.includes("to-") && category.includes("convert"))) {
    return "batch-converter";
  }

  return "default";
}

/**
 * Maps archetype to appropriate responsive workspace maximum width.
 */
export function getArchetypeWorkspaceClass(archetype: ToolArchetype): string {
  switch (archetype) {
    case "image-workspace":
      return "max-w-6xl";
    case "document-workspace":
      return "max-w-6xl";
    case "code-utility":
      return "max-w-6xl";
    case "calculator":
      return "max-w-4xl";
    case "generator":
      return "max-w-4xl";
    case "text-utility":
      return "max-w-5xl";
    case "seo-dashboard":
      return "max-w-6xl";
    case "batch-converter":
      return "max-w-5xl";
    case "default":
    default:
      return "max-w-4xl";
  }
}

/**
 * Factual data-processing model resolution based on genuine tool behavior.
 */
export function resolveDataProcessing(tool: {
  id?: string;
  category?: string;
  executionType?: string;
}): DataProcessingInfo {
  const id = (tool.id || "").toLowerCase();
  const category = (tool.category || "").toLowerCase();
  const execType = (tool.executionType || "").toLowerCase();

  // External / Remote API tools
  if (
    execType === "external" ||
    execType === "server" ||
    category.includes("ai") ||
    category.includes("youtube") ||
    category.includes("downloader") ||
    id.includes("youtube") ||
    id.includes("transcrib") ||
    id.includes("speech-to-text") ||
    id.includes("ai-art")
  ) {
    return {
      type: "REMOTE",
      label: "Cloud API Processing",
      badgeText: "Secure Cloud API",
      description: "Requires secure external API processing. No user media or output is retained on servers.",
    };
  }

  // SEO, DNS, HTTP inspection tools (network metadata, zero file uploads)
  if (
    category.includes("seo") ||
    id.includes("whois") ||
    id.includes("dns") ||
    id.includes("http-header") ||
    id.includes("redirect-checker") ||
    id.includes("ssl")
  ) {
    return {
      type: "NO_FILE_UPLOAD",
      label: "No File Upload",
      badgeText: "Network Metadata Only",
      description: "Queries public network endpoints and inspects headers. Zero files uploaded.",
    };
  }

  // Hybrid tools
  if (execType === "hybrid" || id.includes("hybrid")) {
    return {
      type: "MIXED",
      label: "Hybrid Execution",
      badgeText: "Client + Cloud",
      description: "Performs local client-side pre-processing with optional cloud computation.",
    };
  }

  // Pure Client-Side Local Execution (Default for 90%+ of SopKit tools)
  return {
    type: "LOCAL",
    label: "Local Browser Sandbox",
    badgeText: "100% Client-Side",
    description: "Executes entirely in your local browser memory via WebAssembly/Web Workers. Files never leave your device.",
  };
}
