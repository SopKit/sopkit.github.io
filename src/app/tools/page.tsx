import { ToolDirectory } from "@/components/landing/ToolDirectory";
import toolsData from "@/constants/tools.json";
import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants/config";

interface ToolCategory {
	key: string;
	iconKey: string;
	name: string;
	description: string;
	tools: any[];
}

export async function generateMetadata(): Promise<any> {
	return baseGenerateMetadata({
		title: "All Free Online Tools Directory | SopKit",
		description: `Browse all ${SITE_CONFIG.toolCountString} free browser-based online tools for Image, PDF, Video, Audio, SEO, and developer workflows. 100% free, secure, and private.`,
		path: "/tools",
	});
}

export default async function ToolsDirectoryPage() {
	const priorityOrder = [
		"exam-tools",
		"calculators",
		"image",
		"developer",
		"seo",
		"pdf",
		"text",
		"generators",
		"utilities",
		"audio",
		"video",
		"youtube",
		"downloaders",
	];

	const toolCategories = priorityOrder.map((key) => {
		const cat = (toolsData.categories as any)[key];
		if (!cat) return null;
		return {
			key,
			iconKey: cat.icon || key,
			name: cat.name,
			description: cat.description,
			tools: cat.tools || [],
		} as ToolCategory;
	}).filter((c): c is ToolCategory => c !== null);

	return (
		<main className="bg-background min-h-screen relative overflow-hidden">
			{/* Global Decorative Gradients */}
			<div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-cute opacity-20 -z-10" />

			<div className="container mx-auto px-4 max-w-7xl py-12 md:py-20">
				<div className="max-w-3xl mb-16 space-y-4">
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
						All Free Online Tools
					</h1>
					<p className="text-xl text-muted-foreground leading-relaxed">
						Explore our complete collection of {SITE_CONFIG.toolCountString} browser-based tools. 
						All utilities are 100% free, run locally in your web browser for total privacy, and require no account signup.
					</p>
				</div>

				<ToolDirectory categories={toolCategories} lang="en" />
			</div>
		</main>
	);
}
