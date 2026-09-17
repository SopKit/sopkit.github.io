import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcAppDir = path.resolve(__dirname, "../src/app");

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(srcAppDir);
let changedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("https://sopkit.space")) continue;

  let modified = false;

  // If file doesn't already import SITE_URL or SITE_CONFIG, add import
  const hasSiteUrlImport = content.includes("SITE_URL");

  // Replace "https://sopkit.space" exactly
  // Case 1: "https://sopkit.space" as a standalone string
  // Case 2: "https://sopkit.space/..." in template or string literals
  // Examples:
  // canonical: "https://sopkit.space/emi-calculator" -> canonical: `${SITE_URL}/emi-calculator`
  // url: "https://sopkit.space/emi-calculator" -> url: `${SITE_URL}/emi-calculator`
  // "https://sopkit.space" -> SITE_URL
  // "https://sopkit.space/" -> `${SITE_URL}/`

  // Replace exact string "https://sopkit.space"
  const newContent = content.replace(/"https:\/\/sopkit\.space([^"]*)"/g, (match, p1) => {
    modified = true;
    if (!p1 || p1 === "") {
      return `SITE_URL`;
    }
    return `\`\${SITE_URL}${p1}\``;
  }).replace(/'https:\/\/sopkit\.space([^']*)'/g, (match, p1) => {
    modified = true;
    if (!p1 || p1 === "") {
      return `SITE_URL`;
    }
    return `\`\${SITE_URL}${p1}\``;
  });

  if (modified) {
    let finalContent = newContent;
    if (!hasSiteUrlImport) {
      // Add import at top
      finalContent = `import { SITE_URL } from "@/constants/config";\n` + finalContent;
    }
    fs.writeFileSync(file, finalContent, "utf8");
    changedCount++;
    console.log(`Updated: ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`\n✅ Swept and replaced hardcoded URLs in ${changedCount} files.`);
