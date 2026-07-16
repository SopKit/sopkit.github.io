import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CodeFormatterTool from "@/components/tools/developer/CodeFormatterTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Code Formatter",
	description: "Private Code Formatter: privately format code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/code-formatter",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/code-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CodeFormatterTool />
		</ToolLayout>
	);
}
