import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeTitleCapitalizerTool from "@/components/tools/youtube/YouTubeTitleCapitalizerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Youtube Video Title Capitalizer",
	description: "Private Youtube Video Title Capitalizer: privately process YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-title-capitalizer",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-capitalizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeTitleCapitalizerTool />
		</ToolLayout>
	);
}
