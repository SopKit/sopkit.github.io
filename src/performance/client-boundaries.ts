/**
 * @file src/performance/client-boundaries.ts
 * @description Architecture guidelines and boundary enforcement for Server vs Client components.
 */

/**
 * Heavy libraries that MUST NEVER be imported in root layout or general page wrappers.
 * They must only be dynamically imported inside leaf client components upon user interaction.
 */
export const HEAVY_LIBRARIES_ALLOWLIST = [
  "pdf-lib",
  "pdfjs-dist",
  "docx",
  "xlsx",
  "html2canvas",
  "jspdf",
  "canvas-confetti",
  "monaco-editor",
  "tesseract.js",
  "ffmpeg.wasm",
] as const;

/**
 * Verifies if an interactive tool should defer its execution runtime
 */
export function shouldDeferToolRuntime(toolSlug: string): boolean {
  // Heavy PDF, image processing, OCR, or conversion tools MUST defer runtime loading until user interaction
  const heavyPrefixes = ["pdf-", "image-convert", "video-", "audio-", "doc-", "ocr-"];
  return heavyPrefixes.some((prefix) => toolSlug.includes(prefix));
}
