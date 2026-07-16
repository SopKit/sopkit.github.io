import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import GaanaDownloader from "@/components/tools/downloaders/GaanaDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Gaana Video Downloader",
	description: "Private Gaana Video Downloader: privately download audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/gaana-video-downloader",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/gaana-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<GaanaDownloader />
		</ToolLayout>
	);
}
