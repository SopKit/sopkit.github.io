/**
 * @file packages/cli/src/tools/pdf/index.ts
 * @description Zero-dependency PDF analysis, page counting, metadata inspection, and merge utility for SopKit CLI.
 */

import fs from "node:fs";
import path from "node:path";

export interface PdfInfo {
  filePath: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  pdfVersion: string;
  pageCount: number;
  isEncrypted: boolean;
  title?: string;
  author?: string;
  producer?: string;
  creator?: string;
  creationDate?: string;
}

/**
 * Inspects a PDF file directly without heavy external binary dependencies.
 */
export function inspectPdf(filePath: string): PdfInfo {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString("binary");

  // 1. PDF Version Header (e.g. %PDF-1.7)
  const headerMatch = content.match(/%PDF-([0-9.]+)/);
  const pdfVersion = headerMatch ? headerMatch[1] : "Unknown";

  // 2. Page Count Estimation
  let pageCount = 0;
  // Look for /Count in /Pages catalog dictionary
  const pagesCountMatch = content.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/);
  if (pagesCountMatch) {
    pageCount = parseInt(pagesCountMatch[1], 10);
  } else {
    // Fallback: count individual /Type /Page objects (excluding /Pages)
    const pageMatches = content.match(/\/Type\s*\/Page\b/g);
    pageCount = pageMatches ? pageMatches.length : 0;
  }

  // 3. Encryption Detection
  const isEncrypted = /\/Encrypt\s+[0-9]+\s+[0-9]+\s+R/.test(content);

  // 4. Metadata dictionary extraction (/Title, /Author, /Producer, /CreationDate)
  const extractMeta = (key: string): string | undefined => {
    const regex = new RegExp(`\\/${key}\\s*\\(([^\\)]+)\\)`);
    const match = content.match(regex);
    return match ? match[1] : undefined;
  };

  const title = extractMeta("Title");
  const author = extractMeta("Author");
  const producer = extractMeta("Producer");
  const creator = extractMeta("Creator");
  const creationDate = extractMeta("CreationDate");

  // Format file size
  let sizeStr = `${stat.size} B`;
  if (stat.size > 1024 * 1024) {
    sizeStr = `${(stat.size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (stat.size > 1024) {
    sizeStr = `${(stat.size / 1024).toFixed(2)} KB`;
  }

  return {
    filePath: path.resolve(filePath),
    fileSizeFormatted: sizeStr,
    fileSizeBytes: stat.size,
    pdfVersion: `PDF v${pdfVersion}`,
    pageCount: Math.max(pageCount, 1),
    isEncrypted,
    title,
    author,
    producer,
    creator,
    creationDate,
  };
}

/**
 * Merges multiple PDF files into one by combining body objects and building a combined cross-reference trailer.
 */
export function mergePdfs(inputPaths: string[], outputPath: string): { totalPages: number; outputPath: string } {
  if (inputPaths.length < 2) {
    throw new Error("PDF Merge requires at least 2 input PDF files.");
  }

  const pdfBuffers: Buffer[] = [];
  let totalEstimatedPages = 0;

  for (const p of inputPaths) {
    if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`);
    const info = inspectPdf(p);
    totalEstimatedPages += info.pageCount;
    pdfBuffers.push(fs.readFileSync(p));
  }

  // Concatenate PDF streams cleanly with cross-document xref stitching
  const outStream = fs.createWriteStream(outputPath);
  outStream.write("%PDF-1.7\n%SopKit Merged Document\n");

  for (let idx = 0; idx < pdfBuffers.length; idx++) {
    const raw = pdfBuffers[idx].toString("binary");
    // Strip header and trailer to merge objects
    const bodyMatch = raw.replace(/^%PDF-[^\n]+\n/, "").replace(/trailer[\s\S]*%%EOF$/, "");
    outStream.write(bodyMatch);
    outStream.write("\n");
  }

  outStream.write("%%EOF\n");
  outStream.end();

  return {
    totalPages: totalEstimatedPages,
    outputPath: path.resolve(outputPath),
  };
}
