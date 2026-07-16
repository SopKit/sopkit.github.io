import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramStoryDownloader from "@/components/tools/downloaders/InstagramStoryDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Instagram Highlights Saver",
	description: "Private Instagram Highlights Saver: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ig-highlights-saver",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ig-highlights-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramStoryDownloader />
		</ToolLayout>
	);
}
