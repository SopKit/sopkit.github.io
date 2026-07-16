import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import RemoveLineBreaksTool from "@/components/tools/text/RemoveLineBreaksTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Remove Line Breaks",
	description: "Private Remove Line Breaks: privately process text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/remove-line-breaks",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/remove-line-breaks");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RemoveLineBreaksTool />
		</ToolLayout>
	);
}
