import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import DouyinDownloader from "@/components/tools/downloaders/DouyinDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Douyin Video Downloader",
	description: "Private Douyin Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/douyin-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/douyin-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DouyinDownloader />
		</ToolLayout>
	);
}
