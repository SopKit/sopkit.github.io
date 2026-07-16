import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SoundcloudDownloader from "@/components/tools/downloaders/SoundcloudDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Soundcloud Video Downloader",
	description: "Private Soundcloud Video Downloader: privately download audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/soundcloud-video-downloader",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/soundcloud-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SoundcloudDownloader />
		</ToolLayout>
	);
}
