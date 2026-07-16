import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TagsFromTextTool from "@/components/tools/text/TagsFromTextTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Text to Tags Converter",
	description: "Private Text to Tags Converter: privately convert text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/text-to-tags-converter",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-tags-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TagsFromTextTool />
		</ToolLayout>
	);
}
