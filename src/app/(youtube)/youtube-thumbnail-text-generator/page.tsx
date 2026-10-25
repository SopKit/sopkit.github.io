import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Thumbnail Text Generator",
	description: "Private YouTube Thumbnail Text: privately generate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-thumbnail-text-generator",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-thumbnail-text-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<ToolLayout breadcrumbs={[]} tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
