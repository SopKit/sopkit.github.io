import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AllDownloaders from "@/components/tools/downloaders/AllDownloaders";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Downloaders",
	description: "Private Downloaders: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/downloaders",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/downloaders");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AllDownloaders />
		</ToolLayout>
	);
}
