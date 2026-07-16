import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import KeywordTool from "@/components/tools/seo/KeywordTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Advanced Keyword Research",
	description: "Private Advanced Keyword Research: privately process website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/keyword-research-tool",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/keyword-research-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KeywordTool />
		</ToolLayout>
	);
}
