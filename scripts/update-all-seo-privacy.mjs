import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsJsonPath = path.join(__dirname, "../src/constants/tools.json");
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, "utf8"));

const updateAllToolsSeo = () => {
	let updatedCount = 0;
	if (toolsData.categories) {
		Object.keys(toolsData.categories).forEach((catKey) => {
			const category = toolsData.categories[catKey];
			if (category && category.tools) {
				category.tools.forEach((tool) => {
					const baseName = tool.name;

					// Programmatically define privacy-focused descriptions targeted for Generative Engine Optimization (GEO) & SEO
					tool.seoDescription = `Privacy-friendly, 100% client-side ${baseName} online. Run secure local processing in your browser with zero file uploads and no data selling. Fast, safe, and free forever.`;
					// Keyword-permutation extraSlugs are no longer generated here: the
					// alias pages they fed were doorway pages and have been removed.
					updatedCount++;
				});
			}
		});
	}
	
	fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 2), "utf8");
	console.log(`Successfully updated SEO metadata & privacy keywords for ${updatedCount} tools across all categories!`);
};

updateAllToolsSeo();
