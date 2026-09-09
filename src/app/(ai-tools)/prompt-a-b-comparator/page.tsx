import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import PromptAbComparator from "@/components/tools/ai/PromptAbComparator";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Prompt A/B Comparator",
	description:
		"Compare two AI prompts side by side with word-level diffs, token estimates, and structure scores to see exactly what changed between versions.",
	route: "/prompt-a-b-comparator",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/prompt-a-b-comparator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PromptAbComparator />
		</ToolLayout>
	);
}
