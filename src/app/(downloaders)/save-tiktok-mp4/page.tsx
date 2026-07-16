import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokDownloader from "@/components/tools/downloaders/TikTokDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Save Tiktok MP4",
	description: "Private Save Tiktok MP4: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/save-tiktok-mp4",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/save-tiktok-mp4");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokDownloader />
		</ToolLayout>
	);
}
