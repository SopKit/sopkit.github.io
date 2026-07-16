import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TextRepeaterTool from "@/components/tools/text/TextRepeaterTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Text Repeater",
	description: "Private Text Repeater: privately process text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/text-repeater",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/text-repeater");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextRepeaterTool />
		</ToolLayout>
	);
}
