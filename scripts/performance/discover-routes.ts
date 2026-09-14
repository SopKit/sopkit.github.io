/**
 * @file scripts/performance/discover-routes.ts
 * @description Automated route discovery for CI testing and Lighthouse audits.
 */

import fs from "fs";
import path from "path";

interface ToolEntry {
  id: string;
  name: string;
  category: string;
  path?: string;
  route?: string;
}

export interface DiscoveredRoute {
  pathname: string;
  category: string;
  priority: "p0" | "p1" | "p2";
  type: "static" | "dynamic" | "embed";
}

export function discoverAllRoutes(): DiscoveredRoute[] {
  const routes: DiscoveredRoute[] = [];

  // P0 Core Hubs
  routes.push(
    { pathname: "/", category: "marketing", priority: "p0", type: "static" },
    { pathname: "/tools", category: "directory", priority: "p0", type: "static" },
    { pathname: "/categories", category: "directory", priority: "p0", type: "static" },
    { pathname: "/search", category: "directory", priority: "p0", type: "static" }
  );

  // Load tools registry
  const toolsJsonPath = path.resolve(process.cwd(), "src/constants/tools.json");
  if (fs.existsSync(toolsJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(toolsJsonPath, "utf-8"));
      const categoriesData = data.categories || {};

      for (const [catKey, catObj] of Object.entries<any>(categoriesData)) {
        routes.push({
          pathname: `/${catKey}`,
          category: "category",
          priority: "p1",
          type: "static",
        });

        if (Array.isArray(catObj.tools)) {
          for (const tool of catObj.tools) {
            const toolRoute = tool.route || tool.path || `/${tool.id}`;
            routes.push({
              pathname: toolRoute.startsWith("/") ? toolRoute : `/${toolRoute}`,
              category: "tool",
              priority: "p1",
              type: "dynamic",
            });
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse tools.json:", e);
    }
  }

  // Embed and utility routes
  routes.push({
    pathname: "/embed-tool",
    category: "utility",
    priority: "p2",
    type: "embed",
  });

  return routes;
}

// Direct run check for ESM
const isMain = process.argv[1] && (process.argv[1].endsWith("discover-routes.ts") || process.argv[1].endsWith("discover-routes.js"));
if (isMain) {
  const routes = discoverAllRoutes();
  console.log(`Discovered ${routes.length} public routes.`);
  const outputPath = path.resolve(process.cwd(), "reports/performance/routes.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`Wrote route matrix to ${outputPath}`);
}

