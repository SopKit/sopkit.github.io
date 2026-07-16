import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import MxTakaTakDownloader from "@/components/tools/downloaders/MxTakaTakDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Mxtakatak Video Downloader",
	description: "Private Mxtakatak Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/mxtakatak-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/mxtakatak-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MxTakaTakDownloader />
		</ToolLayout>
	);
}
