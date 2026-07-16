import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeTimestampLinkGeneratorTool from "@/components/tools/youtube/YouTubeTimestampLinkGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Timestamp Link Generator",
	description: "Private YouTube Timestamp Link: privately generate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-timestamp-link-generator",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-timestamp-link-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeTimestampLinkGeneratorTool />
		</ToolLayout>
	);
}
