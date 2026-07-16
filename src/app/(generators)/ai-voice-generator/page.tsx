import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIVoiceGeneratorTool from "@/components/tools/generators/AIVoiceGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Voice Generator",
	description: "Private AI Voice: privately convert content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ai-voice-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-voice-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AIVoiceGeneratorTool />
		</ToolLayout>
	);
}
