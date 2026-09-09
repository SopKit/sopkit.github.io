import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'src', 'constants', 'tools.json');

interface ToolItem {
  id: string;
  name: string;
  description: string;
  route: string;
  category: string;
  slug?: string;
  path?: string;
  popular?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  features?: string[];
  faqs?: { question: string; answer: string }[];
}

interface CategoryItem {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  tools: ToolItem[];
}

interface ToolsRegistry {
  categories: Record<string, CategoryItem>;
}

console.log('🔍 Validating SopKit Tools Registry...');

if (!fs.existsSync(toolsJsonPath)) {
  console.error(`❌ Error: ${toolsJsonPath} does not exist!`);
  process.exit(1);
}

const rawData = fs.readFileSync(toolsJsonPath, 'utf8');
let registry: ToolsRegistry;

try {
  registry = JSON.parse(rawData);
} catch (e: any) {
  console.error(`❌ JSON Parse Error in tools.json: ${e.message}`);
  process.exit(1);
}

if (!registry.categories || typeof registry.categories !== 'object') {
  console.error('❌ Invalid tools.json structure: "categories" object missing');
  process.exit(1);
}

const seenIds = new Set<string>();
const seenRoutes = new Set<string>();
let totalTools = 0;
let errors: string[] = [];

for (const [catKey, category] of Object.entries(registry.categories)) {
  if (!category.name || !category.slug) {
    errors.push(`Category "${catKey}" is missing required "name" or "slug"`);
  }

  const tools = category.tools || [];
  for (let idx = 0; idx < tools.length; idx++) {
    const tool = tools[idx];
    totalTools++;

    if (!tool.id || typeof tool.id !== 'string' || tool.id.trim() === '') {
      errors.push(`Tool at index ${idx} in category "${catKey}" is missing a valid "id"`);
    } else if (seenIds.has(tool.id)) {
      errors.push(`Duplicate tool id detected: "${tool.id}" in category "${catKey}"`);
    } else {
      seenIds.add(tool.id);
    }

    if (!tool.name || typeof tool.name !== 'string' || tool.name.trim() === '') {
      errors.push(`Tool "${tool.id || idx}" in category "${catKey}" is missing a non-empty "name"`);
    }

    if (!tool.description || typeof tool.description !== 'string' || tool.description.trim() === '') {
      errors.push(`Tool "${tool.id || idx}" in category "${catKey}" is missing a non-empty "description"`);
    }

    if (!tool.route || typeof tool.route !== 'string' || !tool.route.startsWith('/')) {
      errors.push(`Tool "${tool.id || idx}" in category "${catKey}" has an invalid "route": "${tool.route}" (must start with "/")`);
    } else {
      const normalizedRoute = tool.route.toLowerCase().replace(/\/$/, '');
      if (seenRoutes.has(normalizedRoute)) {
        errors.push(`Duplicate tool route detected: "${tool.route}" for tool "${tool.id}" in category "${catKey}"`);
      } else {
        seenRoutes.add(normalizedRoute);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Registry Validation Failed with ${errors.length} error(s):`);
  errors.slice(0, 20).forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
  if (errors.length > 20) {
    console.error(`  ... and ${errors.length - 20} more errors`);
  }
  process.exit(1);
}

console.log(`✅ Registry Validation Passed! Verified ${totalTools} tools across ${Object.keys(registry.categories).length} categories.`);
console.log(`   - 0 duplicate IDs`);
console.log(`   - 0 duplicate routes`);
console.log(`   - All names and descriptions verified non-empty.`);
