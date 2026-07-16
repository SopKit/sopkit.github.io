import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Tag Extractor",
	description: "Private YouTube Tag Extractor: privately generate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-tag-extractor",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-tag-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
