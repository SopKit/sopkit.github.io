import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokAudioDownloader from "@/components/tools/downloaders/TikTokAudioDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "MP3 From Tiktok",
	description: "Private MP3 From Tiktok: privately download audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/mp3-from-tiktok",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/mp3-from-tiktok");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokAudioDownloader />
		</ToolLayout>
	);
}
