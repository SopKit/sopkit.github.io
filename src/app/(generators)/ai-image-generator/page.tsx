import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIImageGeneratorTool from "@/components/tools/generators/AIImageGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Image Generator",
	description: "Privacy-friendly, 100% client-side ai image generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
