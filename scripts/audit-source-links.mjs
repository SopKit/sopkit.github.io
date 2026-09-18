import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

console.log("🔍 Indexing all valid routes from src/app, tools.json, intent landers, and SEO opportunities...");

// 1. Collect all app router routes
const validRoutes = new Set([
  "/",
  "/search",
  "/tools",
  "/packages",
  "/privacy",
  "/terms",
  "/about",
  "/contact",
  "/guides",
  "/embed-tool",
  "/calculators",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
]);

function scanAppRoutes(dir, routePrefix = "") {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_") || entry.name === "api") continue;
      // Route group (e.g. (developer))
      const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      const nextPrefix = isRouteGroup
        ? routePrefix
        : `${routePrefix}/${entry.name}`;
      scanAppRoutes(path.join(dir, entry.name), nextPrefix);
    } else if (entry.name === "page.tsx" || entry.name === "page.js") {
      const normalizedRoute = routePrefix === "" ? "/" : routePrefix;
      validRoutes.add(normalizedRoute);
      validRoutes.add(`${normalizedRoute}/`);
    }
  }
}

scanAppRoutes(path.join(SRC_DIR, "app"));

// 2. Add tools from tools.json
const toolsJsonPath = path.join(SRC_DIR, "constants", "tools.json");
if (fs.existsSync(toolsJsonPath)) {
  const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, "utf8"));
  const toolsList = Array.isArray(toolsData)
    ? toolsData
    : toolsData.tools || [];
  for (const tool of toolsList) {
    if (tool.route) {
      validRoutes.add(tool.route);
      validRoutes.add(`${tool.route}/`);
      const withoutSlash = tool.route.replace(/\/$/, "");
      validRoutes.add(withoutSlash);
    }
  }
}

// 3. Add SEO opportunities and intent data
const seoOppPath = path.join(SRC_DIR, "data", "seo-opportunities.ts");
if (fs.existsSync(seoOppPath)) {
  const content = fs.readFileSync(seoOppPath, "utf8");
  const slugRegex = /slug:\s*["']([^"']+)["']/g;
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    validRoutes.add(`/${match[1]}`);
    validRoutes.add(`/${match[1]}/`);
  }
}

const intentDataPath = path.join(SRC_DIR, "lib", "intent-data.ts");
if (fs.existsSync(intentDataPath)) {
  const content = fs.readFileSync(intentDataPath, "utf8");
  const keyRegex = /["']([a-zA-Z0-9_\-]+)["']:\s*{/g;
  let match;
  while ((match = keyRegex.exec(content)) !== null) {
    validRoutes.add(`/${match[1]}`);
    validRoutes.add(`/${match[1]}/`);
  }
}

// 4. Add static files in public
if (fs.existsSync(PUBLIC_DIR)) {
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  for (const file of publicFiles) {
    validRoutes.add(`/${file}`);
  }
}

console.log(`✅ Identified ${validRoutes.size} valid route variations.`);

// 5. Scan source files for links
console.log("🔍 Scanning source files for internal links...");

const brokenLinks = [];
let totalScanned = 0;

function scanDirForLinks(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git" ||
        entry.name === "out" ||
        entry.name === "dist"
      ) {
        continue;
      }
      scanDirForLinks(fullPath);
    } else if (
      entry.name.endsWith(".tsx") ||
      entry.name.endsWith(".ts") ||
      entry.name.endsWith(".jsx") ||
      entry.name.endsWith(".js")
    ) {
      const relativePath = path.relative(ROOT_DIR, fullPath);

      // Skip route definition files from link auditing
      if (
        relativePath.includes("seo-opportunities.ts") ||
        relativePath.includes("intent-data.ts") ||
        relativePath.includes("tools.json")
      ) {
        continue;
      }

      const content = fs.readFileSync(fullPath, "utf8");

      // Matches href="/..." or toolLink: "/..." or "https://sopkit.space/..."
      const linkRegex = /(?:href|toolLink|url|link|route)["':\s]+["']((?:https:\/\/sopkit\.space)?\/[a-zA-Z0-9_\-\/]+)["']/g;
      let match;
      while ((match = linkRegex.exec(content)) !== null) {
        let target = match[1];
        if (target.startsWith("https://sopkit.space")) {
          target = target.replace("https://sopkit.space", "") || "/";
        }

        // Clean target
        const clean = target.split("#")[0].split("?")[0];
        if (
          !clean ||
          clean === "/" ||
          clean.startsWith("/api") ||
          clean.startsWith("/_") ||
          clean.includes("${") ||
          clean.includes("[")
        ) {
          continue;
        }

        totalScanned++;
        const hasMatch =
          validRoutes.has(clean) ||
          validRoutes.has(`${clean}/`) ||
          validRoutes.has(clean.replace(/\/$/, ""));

        if (!hasMatch) {
          brokenLinks.push({
            file: relativePath,
            link: target,
            clean,
          });
        }
      }
    }
  }
}

scanDirForLinks(SRC_DIR);

console.log(`\n📊 Scanned ${totalScanned} internal link occurrences.`);

if (brokenLinks.length === 0) {
  console.log("🎉 Zero broken internal links found! All links are valid.");
} else {
  console.log(`⚠️ Found ${brokenLinks.length} potential 404 links:\n`);
  const grouped = {};
  for (const b of brokenLinks) {
    if (!grouped[b.clean]) grouped[b.clean] = [];
    grouped[b.clean].push(b.file);
  }

  for (const [link, files] of Object.entries(grouped)) {
    console.log(`❌ 404 Route: ${link}`);
    console.log(`   Referenced in ${files.length} locations:`);
    files.slice(0, 3).forEach((f) => console.log(`     - ${f}`));
    if (files.length > 3) console.log(`     ...and ${files.length - 3} more`);
  }
}
