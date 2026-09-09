import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import NegativePromptGenerator from "@/components/tools/ai/NegativePromptGenerator";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Negative Prompt Generator",
	description: "Compose effective negative prompts for Stable Diffusion, Midjourney, and Flux from categorized lists covering artifacts, anatomy, quality, and style terms.",
	route: "/negative-prompt-generator",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/negative-prompt-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<NegativePromptGenerator />
		</ToolLayout>
	);
}
