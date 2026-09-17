import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIImageGeneratorTool from "@/components/tools/generators/AIImageGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Image Generator",
	description: "Create AI-generated images from text prompts online. Fast browser-based interface powered by Pollinations.ai with customizable art styles, aspect ratios, and instant downloads.",
	route: "/ai-image-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-image-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AIImageGeneratorTool />
		</ToolLayout>
	);
}
