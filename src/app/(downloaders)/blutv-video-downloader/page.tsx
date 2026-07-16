import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BlutvDownloader from "@/components/tools/downloaders/BlutvDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Blutv Video Downloader",
	description: "Private Blutv Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/blutv-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/blutv-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BlutvDownloader />
		</ToolLayout>
	);
}
