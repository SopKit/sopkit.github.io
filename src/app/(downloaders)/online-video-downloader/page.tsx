import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import OnlineVideoDownloader from "@/components/tools/downloaders/OnlineVideoDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Online Video Downloader",
	description: "Private Online Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/online-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/online-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<OnlineVideoDownloader />
		</ToolLayout>
	);
}
