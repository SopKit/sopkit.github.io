import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramStoryDownloader from "@/components/tools/downloaders/InstagramStoryDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Instagram Story Downloader",
	description: "Private Instagram Story Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/instagram-story-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-story-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramStoryDownloader />
		</ToolLayout>
	);
}
