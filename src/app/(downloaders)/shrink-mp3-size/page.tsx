import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokMP3Converter from "@/components/tools/downloaders/TikTokMP3Converter";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Shrink MP3 Size",
	description: "Private Shrink MP3 Size: privately compress audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/shrink-mp3-size",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/shrink-mp3-size");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokMP3Converter />
		</ToolLayout>
	);
}
