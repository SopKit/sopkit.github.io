import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AiPromptImprover from "@/components/tools/ai/AiPromptImprover";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Prompt Improver",
	description: "Score any AI prompt on role, context, constraints, and output format, then rewrite it with proven frameworks like RTF and TAG in one click. Free and 100% browser-based.",
	route: "/ai-prompt-improver",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-prompt-improver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AiPromptImprover />
		</ToolLayout>
	);
}
