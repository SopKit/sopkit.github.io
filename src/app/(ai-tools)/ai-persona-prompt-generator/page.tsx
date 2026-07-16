import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AiPersonaPromptGenerator from "@/components/tools/ai/AiPersonaPromptGenerator";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Persona & System Prompt Generator",
	description: "Private AI Persona & System Prompt: privately generate AI prompts entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ai-persona-prompt-generator",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-persona-prompt-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AiPersonaPromptGenerator />
		</ToolLayout>
	);
}
