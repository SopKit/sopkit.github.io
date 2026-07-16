import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TwitterDownloader from "@/components/tools/downloaders/TwitterDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Save Twitter Videos",
	description: "Private Save Twitter Videos: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/save-twitter-videos",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/save-twitter-videos");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TwitterDownloader />
		</ToolLayout>
	);
}
