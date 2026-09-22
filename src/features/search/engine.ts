/**
 * @file src/features/search/engine.ts
 * @description Fast server/client search engine supporting exact match, intent synonyms, explanations, and category boosts.
 */

import { ToolDefinition } from "../tools/types";
import { getAllTools } from "../tools/registry";

export interface SearchResult {
  tool: ToolDefinition;
  score: number;
  matchType: "exact" | "prefix" | "intent" | "tag" | "description";
  explanation?: string;
}

interface IntentMapping {
  patterns: string[];
  targetSlugs: string[];
  explanation: string;
}

const TASK_INTENT_MAPPINGS: IntentMapping[] = [
  {
    patterns: [
      "make photo smaller",
      "shrink image",
      "reduce jpg",
      "compress photo",
      "smaller image",
      "compress png",
      "reduce file size",
      "lower image size",
      "compress image",
    ],
    targetSlugs: ["image-compressor", "compress-image-to-50kb", "bulk-image-compressor", "compress-image-to-20kb"],
    explanation: "Best match for reducing image file size",
  },
  {
    patterns: [
      "combine pdf",
      "join pdf",
      "merge documents",
      "put pdfs together",
      "stitch pdf",
      "merge pdf",
    ],
    targetSlugs: ["merge-pdf-online", "split-pdf"],
    explanation: "Best match for combining multiple PDF documents",
  },
  {
    patterns: [
      "format json",
      "prettify json",
      "validate json",
      "clean json",
      "beautify json",
      "json lint",
    ],
    targetSlugs: ["json-formatter", "json-validator", "json-to-csv"],
    explanation: "Best match for inspecting, validating, and beautifying JSON data",
  },
  {
    patterns: [
      "remove bg",
      "transparent bg",
      "transparent background",
      "cut out background",
      "erase background",
      "background remover",
    ],
    targetSlugs: ["background-remover", "image-resizer"],
    explanation: "Best match for isolating subjects and creating transparent backgrounds",
  },
  {
    patterns: [
      "calc gpa",
      "calculate gpa",
      "cgpa",
      "semester grades",
      "college grade",
      "sgpa",
    ],
    targetSlugs: ["cgpa-calculator", "gpa-calculator"],
    explanation: "Best match for calculating semester GPA and cumulative CGPA",
  },
  {
    patterns: [
      "generate qr",
      "make qr",
      "create qr",
      "qr generator",
      "barcode",
      "scan qr",
    ],
    targetSlugs: ["qr-code-generator", "barcode-generator"],
    explanation: "Best match for generating customizable QR codes",
  },
  {
    patterns: [
      "word count",
      "character count",
      "count words",
      "how many words",
      "reading time",
      "letter count",
    ],
    targetSlugs: ["word-counter", "character-counter"],
    explanation: "Best match for real-time word and character counting metrics",
  },
  {
    patterns: [
      "generate password",
      "strong password",
      "random password",
      "passcode",
      "secure password",
    ],
    targetSlugs: ["password-generator", "uuid-generator"],
    explanation: "Best match for generating cryptographically secure passwords",
  },
  {
    patterns: [
      "extract text",
      "ocr",
      "image to text",
      "scan text from image",
      "read photo text",
    ],
    targetSlugs: ["image-text-extractor", "extract-text-from-pdf"],
    explanation: "Best match for OCR optical character recognition",
  },
  {
    patterns: [
      "resize image",
      "crop photo",
      "change dimensions",
      "scale image",
      "passport photo",
    ],
    targetSlugs: ["image-resizer", "passport-photo-maker", "crop-image"],
    explanation: "Best match for image dimension scaling and cropping",
  },
  {
    patterns: [
      "base64",
      "encode base64",
      "decode base64",
      "convert to base64",
    ],
    targetSlugs: ["base64-encoder-decoder", "image-to-base64"],
    explanation: "Best match for Base64 encoding and decoding",
  },
  {
    patterns: [
      "diff text",
      "compare text",
      "text comparison",
      "code diff",
    ],
    targetSlugs: ["diff-checker"],
    explanation: "Best match for side-by-side text and code difference checking",
  },
  {
    patterns: [
      "markdown to html",
      "md to html",
      "convert markdown",
    ],
    targetSlugs: ["markdown-to-html", "html-to-markdown"],
    explanation: "Best match for Markdown syntax compilation",
  },
  {
    patterns: [
      "split pdf",
      "separate pdf",
      "extract pdf pages",
    ],
    targetSlugs: ["split-pdf", "merge-pdf-online"],
    explanation: "Best match for separating PDF pages into independent files",
  },
  {
    patterns: [
      "word to pdf",
      "doc to pdf",
      "docx to pdf",
      "convert document",
    ],
    targetSlugs: ["word-to-pdf", "pdf-to-word"],
    explanation: "Best match for document format conversion",
  },
];

export function searchTools(query: string, limit: number = 20): SearchResult[] {
  if (!query || query.trim().length === 0) return [];

  const allTools = getAllTools();
  const cleanQ = query.trim().toLowerCase();
  const queryTokens = cleanQ.split(/\s+/).filter((t) => t.length > 0);

  // Check intent mapping
  const matchedIntent = TASK_INTENT_MAPPINGS.find((intent) =>
    intent.patterns.some((pattern) => cleanQ.includes(pattern) || pattern.includes(cleanQ))
  );

  const results: SearchResult[] = [];
  const seenIds = new Set<string>();

  for (const tool of allTools) {
    const id = tool.id || "";
    const nameLower = (tool.name || "").toLowerCase();
    const idLower = id.toLowerCase();
    const slugLower = (tool.slug || "").toLowerCase();
    const descLower = (tool.description || "").toLowerCase();
    const catLower = (tool.category || "").toLowerCase();

    // 1. Exact name/id/slug match
    if (nameLower === cleanQ || idLower === cleanQ || slugLower === cleanQ) {
      results.push({
        tool,
        score: 100 + (tool.popular ? 5 : 0),
        matchType: "exact",
        explanation: "Exact title match",
      });
      seenIds.add(id);
      continue;
    }

    // 2. Name prefix or substring match
    if (nameLower.startsWith(cleanQ)) {
      results.push({
        tool,
        score: 80 + (tool.popular ? 5 : 0),
        matchType: "prefix",
        explanation: "Title starts with search term",
      });
      seenIds.add(id);
      continue;
    }

    // 3. Matched Intent boost
    if (matchedIntent) {
      const intentIndex = matchedIntent.targetSlugs.indexOf(slugLower);
      if (intentIndex !== -1 || matchedIntent.targetSlugs.indexOf(idLower) !== -1) {
        const priorityScore = 75 - (intentIndex >= 0 ? intentIndex * 5 : 0);
        results.push({
          tool,
          score: priorityScore + (tool.popular ? 5 : 0),
          matchType: "intent",
          explanation: matchedIntent.explanation,
        });
        seenIds.add(id);
        continue;
      }
    }

    // 4. Token match in name, category, tags, description
    let tokenScore = 0;
    for (const token of queryTokens) {
      if (nameLower.includes(token)) tokenScore += 25;
      if (catLower.includes(token)) tokenScore += 15;
      if (tool.tags?.some((t) => t.toLowerCase().includes(token))) tokenScore += 10;
      if (descLower.includes(token)) tokenScore += 5;
    }

    if (tokenScore > 0) {
      if (tool.popular) tokenScore += 5;
      results.push({
        tool,
        score: tokenScore,
        matchType: "description",
        explanation: catLower.includes(cleanQ) ? `Matches ${tool.category} category` : undefined,
      });
      seenIds.add(id);
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
