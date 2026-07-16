/**
 * Update description field in existing generateToolMetadata() calls
 * to use the privacy-first seoDescription from generated-manual-content.
 */

const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(__dirname, "..", "src", "app");

// Load manual seoDescriptions
const generatedContent = fs.readFileSync(
  path.join(__dirname, "..", "src", "data", "generated-manual-content.ts"), "utf8"
);

// Extract tool-id → seoDescription
const seoDescMap = {};
const entryRegex = /"([^"]+)":\s*\{[\s\S]*?seoDescription:\s*`([^`]*)`/g;
let m;
while ((m = entryRegex.exec(generatedContent)) !== null) {
  seoDescMap[m[1]] = m[2].trim();
}

// Load tools.json for id → route mapping
const toolsJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "constants", "tools.json"), "utf8")
);

const routeToId = {};
for (const cat of Object.values(toolsJson.categories)) {
  if (cat.tools) {
    for (const t of cat.tools) {
      routeToId[t.route] = t.id;
    }
  }
}

function updateDescription(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Match existing generateToolMetadata call
  const callMatch = content.match(/export\s+const\s+metadata\s*=\s*generateToolMetadata\(\{([\s\S]*?)\}\);/);
  if (!callMatch) return false;

  const block = callMatch[1];

  // Extract the route
  const routeMatch = block.match(/route:\s*"([^"]+)"/);
  if (!routeMatch) return false;

  const route = routeMatch[1];
  const toolId = routeToId[route];
  if (!toolId) return false;

  const manualDesc = seoDescMap[toolId];
  if (!manualDesc) return false;

  // Escape the description for embedding in a string
  const escapedDesc = manualDesc.replace(/"/g, '\\"').replace(/\n/g, " ");

  // Replace the description field
  const newBlock = block.replace(
    /description:\s*"[^"]*"/,
    `description: "${escapedDesc}"`
  );

  content = content.replace(block, newBlock);

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }
  return false;
}

let updated = 0;
let skipped = 0;

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name === "page.tsx") {
      try {
        if (updateDescription(fullPath)) {
          updated++;
          console.log(`✓ ${path.relative(APP_DIR, fullPath)}`);
        } else {
          skipped++;
        }
      } catch (err) {
        console.error(`✗ ${fullPath}: ${err.message}`);
      }
    }
  }
}

walkDir(APP_DIR);
console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
