import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import CommaSeparatorTool from "@/components/tools/text/CommaSeparatorTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Comma Separator",
	description: "Private Comma Separator: privately convert text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/comma-separator",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/comma-separator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CommaSeparatorTool />
		</ToolLayout>
	);
}
