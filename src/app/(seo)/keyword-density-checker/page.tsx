import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KeywordTool from "@/components/tools/seo/KeywordTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Keyword Density Checker",
	description: "Private Keyword Density Checker: privately validate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/keyword-density-checker",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/keyword-density-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KeywordTool />
		</ToolLayout>
	);
}
