import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LineSorterTool from "@/components/tools/text/LineSorterTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Line Sorter",
	description: "Private Line Sorter: privately process text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/line-sorter",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/line-sorter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LineSorterTool />
		</ToolLayout>
	);
}
