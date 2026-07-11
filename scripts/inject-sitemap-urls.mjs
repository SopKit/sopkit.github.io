import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const sitemapPath = "out/sitemap.xml";
const toolsJsonPath = "src/constants/tools.json";

function run() {
  if (!existsSync(sitemapPath)) {
    console.error(`❌ Sitemap file not found at ${sitemapPath}`);
    return;
  }

  let sitemapContent = readFileSync(sitemapPath, "utf8");
  const json = JSON.parse(readFileSync(toolsJsonPath, "utf8"));
  
  const allTools = Object.values(json.categories).flatMap((cat) => cat.tools || []);
  
  // Extract all existing <loc> URLs
  const locRegex = /<loc>(https:\/\/sopkit\.github\.io\/[^<]+)<\/loc>/g;
  const existingUrls = new Set();
  let match;
  while ((match = locRegex.exec(sitemapContent)) !== null) {
    existingUrls.add(match[1].toLowerCase());
  }

  console.log(`🔍 Existing URLs in sitemap: ${existingUrls.size}`);

  let addedCount = 0;
  let newEntries = "";
  
  const nowStr = new Date().toISOString().split("T")[0];

  for (const tool of allTools) {
    if (!tool.route) continue;
    let cleanRoute = tool.route;
    if (!cleanRoute.startsWith("/")) cleanRoute = "/" + cleanRoute;
    if (!cleanRoute.endsWith("/")) cleanRoute = cleanRoute + "/";

    const fullUrl = `https://sopkit.github.io${cleanRoute}`.toLowerCase();
    
    if (!existingUrls.has(fullUrl)) {
      newEntries += `  <url>\n    <loc>https://sopkit.github.io${cleanRoute}</loc>\n    <lastmod>${nowStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.75</priority>\n  </url>\n`;
      addedCount++;
    }
  }

  if (addedCount > 0) {
    // Inject before the closing </urlset> tag
    sitemapContent = sitemapContent.replace("</urlset>", `${newEntries}</urlset>`);
    writeFileSync(sitemapPath, sitemapContent, "utf8");
    console.log(`🎉 Successfully injected ${addedCount} new tool URLs into ${sitemapPath}!`);
  } else {
    console.log("✅ All tools are already present in the sitemap.");
  }
}

run();
