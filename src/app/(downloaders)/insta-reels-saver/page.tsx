import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramReelDownloader from "@/components/tools/downloaders/InstagramReelDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Insta Reels Saver",
	description: "Private Insta Reels Saver: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/insta-reels-saver",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/insta-reels-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramReelDownloader />
		</ToolLayout>
	);
}
