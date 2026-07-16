import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SharechatDownloader from "@/components/tools/downloaders/SharechatDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Sharechat Video Downloader",
	description: "Private Sharechat Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/sharechat-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/sharechat-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SharechatDownloader />
		</ToolLayout>
	);
}
