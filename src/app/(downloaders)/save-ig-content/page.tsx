import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDownloader from "@/components/tools/downloaders/InstagramDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Save Instagram Content",
	description: "Private Save Instagram Content: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/save-ig-content",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/save-ig-content");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDownloader />
		</ToolLayout>
	);
}
