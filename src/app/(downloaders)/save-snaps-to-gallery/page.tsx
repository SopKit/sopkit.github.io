import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SnapchatDownloader from "@/components/tools/downloaders/SnapchatDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Save Snaps To Gallery",
	description: "Private Save Snaps To Gallery: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/save-snaps-to-gallery",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/save-snaps-to-gallery");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SnapchatDownloader />
		</ToolLayout>
	);
}
