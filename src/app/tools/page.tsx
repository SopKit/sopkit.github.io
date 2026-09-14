import { ToolDirectory } from "@/components/landing/ToolDirectory";
import toolsData from "@/constants/tools.json";
import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";

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
			{/* Multi-Stop Ambient Aurora Glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-blue-600/15 via-sky-400/10 to-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

			<div className="container mx-auto px-4 max-w-7xl py-12 md:py-20">
				<div className="max-w-3xl mb-12 space-y-4 text-center md:text-left">
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold select-none">
						<span>Complete Sandbox Registry</span>
						<span className="text-primary/40">•</span>
						<span>{SITE_CONFIG.toolCountString} Free Tools</span>
					</div>

					<h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground uppercase leading-[1.1]">
						All Free Online <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">Tools</span>
					</h1>
					<p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
						Explore our complete collection of {SITE_CONFIG.toolCountString} browser-based utilities. 
						Every tool runs locally in your browser for total privacy, zero server uploads, and instant performance.
					</p>
				</div>

				<div className="max-w-4xl mx-auto my-6">
					<AdPlacement placement="after-hero" pageType="category" />
				</div>

				<ToolDirectory tools={toolCategories.flatMap(c => c.tools)} />

				<div className="max-w-4xl mx-auto my-12">
					<AdPlacement placement="footer" pageType="category" />
				</div>
			</div>
		</main>
	);
}
