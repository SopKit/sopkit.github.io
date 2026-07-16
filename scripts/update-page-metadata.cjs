/**
 * Bulk-update all tool page.tsx files to use centralized generateToolMetadata().
 *
 * Before: export const metadata = { title: "Free X Online - No Signup | SopKit", ... }
 * After:  import { generateToolMetadata } from "@/lib/seo";
 *         export const metadata = generateToolMetadata({
 *           name: "X",
 *           description: "...",
 *           route: "/tool-slug",
 *           category: "category",
 *         });
 *
 * For company/content pages, we use generateMetadata() instead.
 */

const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(__dirname, "..", "src", "app");

// Tool metadata from tools.json for name/description/route/category lookups
const toolsJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "constants", "tools.json"), "utf8")
);

// Manual SEO content from generated-manual-content.ts
const generatedContentPath = path.join(__dirname, "..", "src", "data", "generated-manual-content.ts");
const generatedContentRaw = fs.readFileSync(generatedContentPath, "utf8");

// Extract seoDescription from each tool entry using regex
// Pattern: "tool-id": { ... seoDescription: `...` }
const seoDescriptionMap = {};
const toolEntryRegex = /"([^"]+)":\s*\{[\s\S]*?seoDescription:\s*`([^`]*)`/g;
let match;
while ((match = toolEntryRegex.exec(generatedContentRaw)) !== null) {
  seoDescriptionMap[match[1]] = match[2].trim();
}

// Build tool lookup by route
const toolByRoute = {};
for (const [cat, data] of Object.entries(toolsJson.categories)) {
  if (data.tools) {
    for (const t of data.tools) {
      toolByRoute[t.route] = { ...t, category: cat };
    }
  }
}

function getToolKeyFromRoute(route) {
  // e.g. /image-compressor → image-compressor
  return route.replace(/^\//, "").replace(/\/$/, "");
}

function updatePageFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Determine the route from file path
  const routeMatch = filePath.match(/\/\([^/]+\)\/([^/]+)\/page\.tsx$/);
  if (!routeMatch) return false;

  const slug = routeMatch[1];
  const groupName = filePath.match(/\/\(([^/]+)\)\//)?.[1] || "";

  // Skip non-tool route groups
  const skipGroups = ["landing", "intent", "content", "company", "user", "seo-hubs", "money", "embed"];
  if (skipGroups.includes(groupName)) return false;

  // Check if metadata already uses generateToolMetadata/generateMetadata
  if (content.includes("generateToolMetadata(") || content.includes("generateMetadata(")) {
    return false;
  }

  // Find the hardcoded metadata block
  const metaMatch = content.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\n\};/);
  if (!metaMatch) return false;

  // Determine route and tool data
  const possibleRoute = `/${slug}`;
  const tool = toolByRoute[possibleRoute];
  
  if (!tool) {
    // Try reverse lookup by id matching slug
    for (const [route, t] of Object.entries(toolByRoute)) {
      if (t.id === slug || route === `/${slug}`) {
        Object.assign(tool || {}, t);
      }
    }
    if (!toolByRoute[possibleRoute]) return false;
  }

  const t = toolByRoute[possibleRoute];
  
  // Check if metadata import already exists
  const hasSeoImport = content.includes('from "@/lib/seo"');
  
  // Build the new metadata block
  const newMetaBlock = `export const metadata = generateToolMetadata({
\tname: "${t.name.replace(/"/g, '\\"')}",
\tdescription: "${(t.seoDescription || t.description || "").replace(/"/g, '\\"')}",
\troute: "${t.route}",
\tcategory: "${t.category}",
});`;

  // Replace the metadata block
  content = content.replace(metaMatch[0], newMetaBlock);

  // Add the import if needed
  if (!hasSeoImport) {
    // Find the last import statement and add after it
    const lastImport = content.lastIndexOf("import ");
    const lastImportEnd = content.indexOf("\n", lastImport);
    if (lastImportEnd > 0) {
      const insertAt = lastImportEnd + 1;
      content = content.slice(0, insertAt) + `import { generateToolMetadata } from "@/lib/seo";\n` + content.slice(insertAt);
    }
  } else {
    // Add generateToolMetadata to existing import from seo
    // Check if it's already in the import
    const seoImportMatch = content.match(/(import\s*\{[^}]*)\}\s*from\s*["']@\/lib\/seo["']/);
    if (seoImportMatch && !seoImportMatch[0].includes("generateToolMetadata")) {
      content = content.replace(
        seoImportMatch[1],
        seoImportMatch[1].trimEnd() + ", generateToolMetadata"
      );
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }
  return false;
}

// Walk through route groups
let updated = 0;
let skipped = 0;
let errors = [];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name === "page.tsx" && dir.includes("(")) {
      try {
        if (updatePageFile(fullPath)) {
          updated++;
          const relPath = path.relative(APP_DIR, fullPath);
          console.log(`✓ ${relPath}`);
        } else {
          skipped++;
        }
      } catch (err) {
        errors.push(`${fullPath}: ${err.message}`);
      }
    }
  }
}

walkDir(APP_DIR);

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors.length}`);
if (errors.length > 0) {
  console.log("Errors:");
  errors.forEach(e => console.log(`  ${e}`));
}
