import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import RedditDownloader from "@/components/tools/downloaders/RedditDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Reddit Media Saver",
	description: "Private Reddit Media Saver: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/reddit-media-saver",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/reddit-media-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RedditDownloader />
		</ToolLayout>
	);
}
