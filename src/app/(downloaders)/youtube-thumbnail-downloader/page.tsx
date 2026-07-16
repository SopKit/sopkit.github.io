import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import YoutubeThumbnailDownloader from "@/components/tools/downloaders/YoutubeThumbnailDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Youtube Thumbnail Downloader",
	description: "Private Youtube Thumbnail Downloader: privately download YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-thumbnail-downloader",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-thumbnail-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YoutubeThumbnailDownloader />
		</ToolLayout>
	);
}
