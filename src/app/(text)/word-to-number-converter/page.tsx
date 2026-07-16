import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordCounterTool from "@/components/tools/text/WordCounterTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Word to Number Converter",
	description: "Private Word to Number Converter: privately convert text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/word-to-number-converter",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/word-to-number-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WordCounterTool />
		</ToolLayout>
	);
}
