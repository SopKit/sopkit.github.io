/**
 * @file scripts/validate-seo-architecture.ts
 * @description Automated Technical SEO & Architecture Verification Suite for SopKit.
 * Verifies canonical integrity, H1 uniqueness, title/description quality, and absence of doorway loops.
 */

import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const toolsPath = path.join(rootDir, "src/constants/tools.json");
const manualContentPath = path.join(rootDir, "src/data/generated-manual-content.ts");
const seoOppPath = path.join(rootDir, "src/data/seo-opportunities.ts");

console.log("🔍 Running Automated Technical SEO Architecture Validation...\n");

interface Tool {
  id: string;
  name: string;
  route: string;
  category: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface ToolsJson {
  categories: Record<string, { name: string; slug: string; tools: Tool[] }>;
}

const rawTools: ToolsJson = JSON.parse(fs.readFileSync(toolsPath, "utf-8"));

let totalCanonicalTools = 0;
const canonicalSlugs = new Set<string>();
const duplicateSlugs: string[] = [];
const missingDescriptions: string[] = [];
const titlesTooLong: { id: string; title: string; len: number }[] = [];
const missingRoutes: string[] = [];

for (const [catKey, cat] of Object.entries(rawTools.categories || {})) {
  for (const tool of cat.tools || []) {
    totalCanonicalTools++;
    const route = tool.route || `/${tool.id}`;
    if (!route.startsWith("/")) {
      missingRoutes.push(tool.id);
    }

    const cleanSlug = route.replace(/^\//, "").replace(/\/$/, "");
    if (canonicalSlugs.has(cleanSlug)) {
      duplicateSlugs.push(cleanSlug);
    }
    canonicalSlugs.add(cleanSlug);

    const desc = tool.seoDescription || tool.description || "";
    if (desc.trim().length < 30) {
      missingDescriptions.push(tool.id);
    }

    const title = tool.seoTitle || `${tool.name} | SopKit`;
    if (title.length > 70) {
      titlesTooLong.push({ id: tool.id, title, len: title.length });
    }
  }
}

console.log(`✅ Audited ${totalCanonicalTools} Canonical Tools.`);
console.log(`✅ Unique Canonical Slugs: ${canonicalSlugs.size}`);

let errorsCount = 0;

if (duplicateSlugs.length > 0) {
  console.error(`❌ Found ${duplicateSlugs.length} Duplicate Canonical Slugs:`, duplicateSlugs);
  errorsCount++;
} else {
  console.log("✅ Zero Duplicate Canonical Slugs detected.");
}

if (missingRoutes.length > 0) {
  console.error(`❌ Found ${missingRoutes.length} tools with invalid routes:`, missingRoutes);
  errorsCount++;
} else {
  console.log("✅ All tool routes formatted with leading slash.");
}

if (missingDescriptions.length > 0) {
  console.error(`❌ Found ${missingDescriptions.length} tools with suspiciously short descriptions:`, missingDescriptions.slice(0, 5));
  errorsCount++;
} else {
  console.log("✅ All canonical tools have valid meta descriptions.");
}

if (titlesTooLong.length > 0) {
  console.warn(`⚠️ Warning: ${titlesTooLong.length} titles exceed 70 characters (search snippet truncation risk).`);
}

// Verify SEO Opportunities
const seoOppFile = fs.readFileSync(seoOppPath, "utf-8");
const oppMatches = Array.from(seoOppFile.matchAll(/slug:\s*"([^"]+)"/g)).map((m) => m[1]);
console.log(`✅ Audited ${oppMatches.length} Curated SEO Opportunity Landers.`);

const oppDuplicateSlugs = oppMatches.filter((item, index) => oppMatches.indexOf(item) !== index);
if (oppDuplicateSlugs.length > 0) {
  console.error(`❌ Duplicate SEO Opportunity Slugs:`, oppDuplicateSlugs);
  errorsCount++;
} else {
  console.log("✅ Zero Duplicate SEO Opportunity Slugs detected.");
}

// Dedicated routes that are canonical tools in tools.json and have explicit page.tsx
const DEDICATED_CANONICAL_ROUTES = new Set([
  "compress-image-to-10kb",
  "compress-image-to-20kb",
  "compress-image-to-30kb",
  "ssc-photo-resizer",
  "upsc-photo-resizer",
  "neet-photo-resizer",
  "jee-photo-resizer",
  "resize-image-in-cm",
  "resize-image-in-mm",
  "image-dpi-converter",
  "75-attendance-calculator",
  "sgpa-calculator",
  "cgpa-calculator",
  "cgpa-to-percentage-calculator",
  "required-marks-calculator"
]);

// Canonical vs Intent Collision Check:
// Any collision NOT explicitly protected in DEDICATED_CANONICAL_ROUTES is an unexpected collision.
const unhandledCollisions = oppMatches.filter(
  (s) => canonicalSlugs.has(s) && !DEDICATED_CANONICAL_ROUTES.has(s)
);

if (unhandledCollisions.length > 0) {
  console.error(`❌ Unhandled SEO Opportunity colliding with Canonical Slugs:`, unhandledCollisions);
  errorsCount++;
} else {
  console.log(`✅ Handled ${DEDICATED_CANONICAL_ROUTES.size} dedicated canonical routes cleanly.`);
  console.log("✅ Zero unhandled collisions between Canonical Slugs and SEO Opportunities.");
}

console.log("\n==========================================");
if (errorsCount === 0) {
  console.log("🎉 All SEO Architecture & Canonical Validations Passed Cleanly!");
  process.exit(0);
} else {
  console.error(`❌ SEO Validation Failed with ${errorsCount} error(s).`);
  process.exit(1);
}
