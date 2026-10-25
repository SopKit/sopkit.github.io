// Validates literal page metadata against the site's own bands, and fails
// loudly (non-zero exit, no partial output) when any value is out of band:
//
//   - Every literal `title: "..."` in an `export const metadata` block in
//     src/app/**/page.tsx (and src/app/layout.tsx): at most 60 characters.
//   - Every literal `description: "..."` in those blocks: 100-160 characters.
//   - Every `standalone: true` SEO opportunity in
//     src/data/seo-opportunities.ts: title at most 60 characters and
//     metaDescription 100-160 characters. Standalone opportunities render
//     their title/metaDescription verbatim in the intent page's metadata,
//     so an out-of-band value there reaches search results unchanged.
//
// Scope limits, stated plainly (these are NOT checked here):
//   - Pages that build metadata with generateToolMetadata are skipped:
//     formatSeoTitle/formatSeoDescription clamp and pad those values at
//     render time, so they are in band by construction.
//   - Template literals, variables and ternaries inside metadata blocks are
//     skipped: only double-quoted string literals are checked.
//   - Dynamic generateMetadata functions (blog posts, tool guides, package
//     pages, non-standalone intent pages) build titles/descriptions from
//     data at request time and are covered by review, not by this script.
//   - Non-standalone opportunities use templated intent-page titles and
//     are therefore not checked here.
//   - Utility-shell layouts are excluded: src/app/(user)/layout.tsx (a
//     segment with no pages), src/app/embed/layout.tsx and
//     src/app/embed-tool/layout.tsx (both robots noindex). Their short
//     widget/shell descriptions are intentional, not content metadata.
//
// Run: bun run validate:page-metadata (also wired into `prebuild`, after
// validate-tool-lastmod and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appDir = path.join(rootDir, "src", "app");
const oppPath = path.join(rootDir, "src", "data", "seo-opportunities.ts");

const MAX_TITLE = 60;
const MIN_DESC = 100;
const MAX_DESC = 160;

const failures: string[] = [];
let checkedTitles = 0;
let checkedDescriptions = 0;
let checkedFiles = 0;
let checkedOpportunities = 0;

function checkTitle(source: string, value: string): void {
  checkedTitles += 1;
  if (value.length > MAX_TITLE) {
    failures.push(`${source}: title ${value.length} chars (> ${MAX_TITLE}): ${value}`);
  }
}

function checkDescription(source: string, value: string): void {
  checkedDescriptions += 1;
  if (value.length < MIN_DESC || value.length > MAX_DESC) {
    failures.push(
      `${source}: description ${value.length} chars (outside ${MIN_DESC}-${MAX_DESC}): ${value}`,
    );
  }
}

// Extract the `export const metadata = { ... }` block from a file, if any,
// honouring nested braces. Returns null when the file builds its metadata
// dynamically (no literal block) or via generateToolMetadata (callers of
// that helper are in band by construction and are skipped upstream).
function extractMetadataBlock(source: string): string | null {
  const match = /export const metadata[^=]*=\s*\{/.exec(source);
  if (!match) return null;
  let depth = 0;
  let j = match.index + match[0].length - 1;
  for (; j < source.length; j += 1) {
    if (source[j] === "{") depth += 1;
    else if (source[j] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(match.index + match[0].length - 1, j + 1);
    }
  }
  return null;
}

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name === "page.tsx" || entry.name === "layout.tsx") files.push(full);
  }
  return files;
}

const UTILITY_SHELL_LAYOUTS = new Set([
  "src/app/(user)/layout.tsx",
  "src/app/embed/layout.tsx",
  "src/app/embed-tool/layout.tsx",
]);

for (const file of walk(appDir)) {
  const rel = path.relative(rootDir, file);
  if (UTILITY_SHELL_LAYOUTS.has(rel)) continue;
  const source = fs.readFileSync(file, "utf-8");
  if (source.includes("generateToolMetadata")) continue;
  const block = extractMetadataBlock(source);
  if (!block) continue;
  checkedFiles += 1;
  for (const m of block.matchAll(/\btitle:\s*"([^"]+)"/g)) {
    checkTitle(`${rel} (metadata title)`, m[1]);
  }
  for (const m of block.matchAll(/\bdescription:\s*"([^"]+)"/g)) {
    checkDescription(`${rel} (metadata description)`, m[1]);
  }
}

// Standalone SEO opportunities: split the data file into records on each
// `slug: "..."` opener and check only the standalone ones.
const oppSource = fs.readFileSync(oppPath, "utf-8");
const records = oppSource.split(/\n\s*\{\s*\n?\s*slug:/);
for (const record of records) {
  if (!record.includes("standalone: true")) continue;
  const slugMatch = /^"([^"]+)"/.exec(record.trim());
  const slug = slugMatch ? slugMatch[1] : "unknown";
  const titleMatch = /\btitle:\s*"([^"]+)"/.exec(record);
  const descMatch = /metaDescription:\s*"([^"]+)"/.exec(record);
  checkedOpportunities += 1;
  if (titleMatch) checkTitle(`seo-opportunity ${slug} (title)`, titleMatch[1]);
  if (descMatch) checkDescription(`seo-opportunity ${slug} (metaDescription)`, descMatch[1]);
}

if (failures.length > 0) {
  console.error("validate-page-metadata: FAILED");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `validate-page-metadata: OK (${checkedFiles} literal metadata files, ` +
    `${checkedTitles} titles <= ${MAX_TITLE} chars, ` +
    `${checkedDescriptions} descriptions in ${MIN_DESC}-${MAX_DESC} chars, ` +
    `${checkedOpportunities} standalone opportunities)`,
);
