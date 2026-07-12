import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsPath = path.join(__dirname, '..', 'src', 'constants', 'tools.json');

const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
const categories = toolsData.categories || {};
const tools = Object.values(categories).flatMap(cat => cat.tools || []);

console.log(`Total registered tools: ${tools.length}`);

const idMap = new Map();
const routeMap = new Map();

for (const tool of tools) {
  if (idMap.has(tool.id)) {
    console.log(`⚠️ Duplicate ID: ${tool.id} (Category: ${tool.category})`);
  } else {
    idMap.set(tool.id, tool);
  }

  const route = tool.route.toLowerCase().replace(/\/+$/, '');
  if (routeMap.has(route)) {
    console.log(`⚠️ Duplicate Route: ${route} (IDs: ${routeMap.get(route).id} & ${tool.id})`);
  } else {
    routeMap.set(route, tool);
  }
}
