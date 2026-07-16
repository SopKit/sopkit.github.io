import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TumblrVideoDownloader from "@/components/tools/downloaders/TumblrVideoDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Tumblr Video Downloader",
	description: "Private Tumblr Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/tumblr-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/tumblr-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TumblrVideoDownloader />
		</ToolLayout>
	);
}
