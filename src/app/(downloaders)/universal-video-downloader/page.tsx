import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import UniversalVideoDownloader from "@/components/tools/downloaders/UniversalVideoDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Universal Video Downloader",
	description: "Private Universal Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/universal-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/universal-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalVideoDownloader />
		</ToolLayout>
	);
}
