import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeEmbedGeneratorTool from "@/components/tools/youtube/YouTubeEmbedGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Embed Code Generator",
	description: "Private YouTube Embed Code: privately generate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-embed-code-generator",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-embed-code-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeEmbedGeneratorTool />
		</ToolLayout>
	);
}
