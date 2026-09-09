import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import LlmOutputCleaner from "@/components/tools/ai/LlmOutputCleaner";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "LLM Output Cleaner",
	description: "Strip markdown code fences, chat prefixes, and stray artifacts from AI output. Extract clean JSON, markdown, or plain text in one click, entirely offline.",
	route: "/llm-output-cleaner",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/llm-output-cleaner");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LlmOutputCleaner />
		</ToolLayout>
	);
}
