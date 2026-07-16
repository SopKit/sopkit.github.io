import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import LineSorterTool from "@/components/tools/text/LineSorterTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Random Word Generator",
	description: "Private Random Word: privately generate text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/random-word-generator",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/random-word-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LineSorterTool />
		</ToolLayout>
	);
}
