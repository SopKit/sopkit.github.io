import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIMusicGeneratorTool from "@/components/tools/generators/AIMusicGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Music Generator",
	description: "Privacy-friendly, 100% client-side ai music generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/ai-music-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-music-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AIMusicGeneratorTool />
		</ToolLayout>
	);
}
