import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIMusicGeneratorTool from "@/components/tools/generators/AIMusicGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Music Generator",
	description: "Private AI Music: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
