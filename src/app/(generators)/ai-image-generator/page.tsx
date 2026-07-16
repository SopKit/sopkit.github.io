import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIImageGeneratorTool from "@/components/tools/generators/AIImageGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Image Generator",
	description: "Private AI Image: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
