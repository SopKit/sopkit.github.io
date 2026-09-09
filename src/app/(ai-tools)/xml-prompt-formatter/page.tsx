import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import XmlPromptFormatter from "@/components/tools/ai/XmlPromptFormatter";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "XML Prompt Formatter for Claude",
	description:
		"Structure prompts with XML tags for Claude models: wrap context, instructions, examples, and thinking sections in tags, then copy the organized result.",
	route: "/xml-prompt-formatter",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/xml-prompt-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<XmlPromptFormatter />
		</ToolLayout>
	);
}
