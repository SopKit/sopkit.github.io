import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokAudioDownloader from "@/components/tools/downloaders/TikTokAudioDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Free MP3 Extractor",
	description: "Private Free MP3 Extractor: privately download audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/free-mp3-extractor",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/free-mp3-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokAudioDownloader />
		</ToolLayout>
	);
}
