import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IzleseneDownloader from "@/components/tools/downloaders/IzleseneDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Izlesene Video Downloader",
	description: "Private Izlesene Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/izlesene-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/izlesene-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IzleseneDownloader />
		</ToolLayout>
	);
}
