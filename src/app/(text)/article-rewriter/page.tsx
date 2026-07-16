import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import LineSorterTool from "@/components/tools/text/LineSorterTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Article Rewriter",
	description: "Private Article Rewriter: privately process text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/article-rewriter",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/article-rewriter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LineSorterTool />
		</ToolLayout>
	);
}
