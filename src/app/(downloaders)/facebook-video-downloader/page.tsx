import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookDownloader from "@/components/tools/downloaders/FacebookDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Facebook Video Downloader",
	description: "Private Facebook Video Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/facebook-video-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/facebook-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookDownloader />
		</ToolLayout>
	);
}
