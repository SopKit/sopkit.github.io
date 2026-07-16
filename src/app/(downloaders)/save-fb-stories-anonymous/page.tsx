import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookStoryDownloader from "@/components/tools/downloaders/FacebookStoryDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Save Facebook Stories Anonymous",
	description: "Private Save Facebook Stories Anonymous: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/save-fb-stories-anonymous",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/save-fb-stories-anonymous");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookStoryDownloader />
		</ToolLayout>
	);
}
