import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import PromptTemplateGenerator from "@/components/tools/ai/PromptTemplateGenerator";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Prompt Template Generator",
	description: "Build reusable AI prompt templates with {{variables}}, presets for writing, coding, and marketing, live preview, and copy-ready output. Private and free forever.",
	route: "/prompt-template-generator",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/prompt-template-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PromptTemplateGenerator />
		</ToolLayout>
	);
}
