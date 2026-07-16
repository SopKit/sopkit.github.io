import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokMP3Converter from "@/components/tools/downloaders/TikTokMP3Converter";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Modify MP3 File",
	description: "Private Modify MP3 File: privately download audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/modify-mp3-file",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/modify-mp3-file");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokMP3Converter />
		</ToolLayout>
	);
}
