import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import NinegagDownloader from "@/components/tools/downloaders/NinegagDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Ninegag Video Downloader",
	description: "Private Ninegag Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ninegag-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ninegag-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<NinegagDownloader />
		</ToolLayout>
	);
}
