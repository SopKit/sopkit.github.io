import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlParserTool from "@/components/tools/built-ins/UrlParserTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "URL Rewriting Tool",
	description: "Private URL Rewriting: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/url-rewriting-tool",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/url-rewriting-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UrlParserTool />
		</ToolLayout>
	);
}
