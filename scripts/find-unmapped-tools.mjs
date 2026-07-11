import { readFileSync } from "fs";

const json = JSON.parse(readFileSync("src/constants/tools.json", "utf8"));
const dispatcherContent = readFileSync("src/components/tools/shared/IntentToolDispatcher.tsx", "utf8");

const allTools = Object.values(json.categories || {}).flatMap(
  (category) => category.tools || []
);

const unmapped = [];
for (const tool of allTools) {
  const registryKey = `"${tool.id}":`;
  if (!dispatcherContent.includes(registryKey)) {
    unmapped.push(tool);
  }
}

console.log(`🔍 Total Tools in JSON: ${allTools.length}`);
console.log(`🔍 Total Unmapped Tools: ${unmapped.length}`);
console.log("\nList of Unmapped Tools:");
unmapped.forEach(t => console.log(`- ${t.id} (${t.name}) -> Category: ${t.category}`));
