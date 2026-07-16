import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import MidjourneyPromptBuilder from "@/components/tools/ai/MidjourneyPromptBuilder";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Midjourney Prompt Builder",
	description: "Private Midjourney Prompt Builder: privately process AI prompts entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/midjourney-prompt-builder",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/midjourney-prompt-builder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MidjourneyPromptBuilder />
		</ToolLayout>
	);
}
