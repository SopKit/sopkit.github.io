import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookStoryDownloader from "@/components/tools/downloaders/FacebookStoryDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Facebook Story Downloader",
	description: "Private Facebook Story Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/facebook-story-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/facebook-story-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookStoryDownloader />
		</ToolLayout>
	);
}
