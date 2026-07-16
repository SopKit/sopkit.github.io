import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import M3u8Downloader from "@/components/tools/downloaders/M3u8Downloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "M3u8 Downloader",
	description: "Private M3u8 Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/m3u8-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/m3u8-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<M3u8Downloader />
		</ToolLayout>
	);
}
