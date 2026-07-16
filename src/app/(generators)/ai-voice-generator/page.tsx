import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIVoiceGeneratorTool from "@/components/tools/generators/AIVoiceGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Voice Generator",
	description: "Privacy-friendly, 100% client-side ai voice generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
