import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsJsonPath = path.join(__dirname, "../src/constants/tools.json");
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, "utf8"));

const updatePdfTools = () => {
	let updatedCount = 0;
	// PDF category tools might be nested inside categories.pdf.tools or elsewhere
	// Let's traverse the categories object
	if (toolsData.categories && toolsData.categories.pdf && toolsData.categories.pdf.tools) {
		const pdfTools = toolsData.categories.pdf.tools;
		pdfTools.forEach((tool) => {
			// Update seoDescription to focus on privacy-friendly, 100% client-side, fast, free forever
			const baseName = tool.name;
			tool.seoDescription = `Privacy-friendly, 100% client-side ${baseName} online. Run secure local processing in your browser with zero file uploads. Fast, safe, and free forever.`;
			
			// Build long-tail privacy-centric extra slugs
			const baseSlug = tool.id;
			const newSlugs = [
				`${baseSlug}-no-upload`,
				`privacy-friendly-${baseSlug}`,
				`client-side-${baseSlug}-free`,
				`local-${baseSlug}-offline`
			];
			
			if (!tool.extraSlugs) {
				tool.extraSlugs = [];
			}
			
			// Deduplicate and merge
			tool.extraSlugs = Array.from(new Set([...tool.extraSlugs, ...newSlugs]));
			updatedCount++;
		});
	}
	
	fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 2), "utf8");
	console.log(`Successfully updated SEO metadata & keywords for ${updatedCount} PDF tools in tools.json!`);
};

updatePdfTools();
