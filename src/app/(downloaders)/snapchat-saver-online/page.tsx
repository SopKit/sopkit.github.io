import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SnapchatDownloader from "@/components/tools/downloaders/SnapchatDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Snapchat Saver Online",
	description: "Private Snapchat Saver: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/snapchat-saver-online",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/snapchat-saver-online");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SnapchatDownloader />
		</ToolLayout>
	);
}
