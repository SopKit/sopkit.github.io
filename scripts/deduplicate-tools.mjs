import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsPath = path.join(__dirname, '..', 'src', 'constants', 'tools.json');

const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

console.log('🧹 Globally deduplicating tools in tools.json...');

const globalSeen = new Map();

// First pass: find and merge duplicates
for (const [catKey, category] of Object.entries(toolsData.categories)) {
  const tools = category.tools || [];
  for (const tool of tools) {
    if (globalSeen.has(tool.id)) {
      const existing = globalSeen.get(tool.id);
      console.log(`Global Merge duplicate tool: ${tool.id} (Categories: ${existing.category} & ${catKey})`);

      // Merge extraSlugs
      const combinedSlugs = new Set([
        ...(existing.extraSlugs || []),
        ...(tool.extraSlugs || [])
      ]);
      if (combinedSlugs.size > 0) {
        existing.extraSlugs = Array.from(combinedSlugs);
      }

      // Merge faqs
      const combinedFaqs = [
        ...(existing.faqs || []),
        ...(tool.faqs || [])
      ];
      const uniqueFaqs = [];
      const seenFaqs = new Set();
      for (const faq of combinedFaqs) {
        if (!seenFaqs.has(faq.question)) {
          seenFaqs.add(faq.question);
          uniqueFaqs.push(faq);
        }
      }
      if (uniqueFaqs.length > 0) {
        existing.faqs = uniqueFaqs;
      }

      // Keep best fields
      if (!existing.article && tool.article) existing.article = tool.article;
      if (tool.popular) existing.popular = true;
      if (tool.description && tool.description.length > existing.description.length) {
        existing.description = tool.description;
      }
    } else {
      globalSeen.set(tool.id, tool);
    }
  }
}

// Second pass: rebuild clean categories list
const cleanCategories = {};
for (const [catKey, category] of Object.entries(toolsData.categories)) {
  const cleanTools = [];
  const categoryTools = category.tools || [];

  for (const tool of categoryTools) {
    // Only keep if this is the instance stored in globalSeen map
    // (This guarantees exactly one global instance of the tool)
    const storedTool = globalSeen.get(tool.id);
    if (storedTool && storedTool.category === catKey) {
      cleanTools.push(storedTool);
    } else if (storedTool && !cleanTools.some(t => t.id === tool.id)) {
      // If the category field matches, or if we want to retain its original position
      // Let's make sure it is in the clean list of the category it is registered to
      if (storedTool.category === catKey) {
        cleanTools.push(storedTool);
      }
    }
  }

  cleanCategories[catKey] = {
    ...category,
    tools: cleanTools
  };
}

toolsData.categories = cleanCategories;

fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2), 'utf8');
console.log('✅ Global Deduplication complete! tools.json updated.');
