import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ImagePromptExtender from "@/components/tools/ai/ImagePromptExtender";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Image Prompt Extender",
	description: "Extend image prompts with curated style, lighting, camera, mood, and detail modifiers for Midjourney, Stable Diffusion, DALL·E, and Flux.",
	route: "/image-prompt-extender",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/image-prompt-extender");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImagePromptExtender />
		</ToolLayout>
	);
}
