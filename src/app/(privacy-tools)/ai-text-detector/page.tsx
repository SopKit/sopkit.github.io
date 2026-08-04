import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "AI Text Detector",
	description: "Detect AI-generated text with a free browser-based analyzer. Check if content was written by ChatGPT, Claude, or other AI models.",
	route: "/ai-text-detector",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-text-detector");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="ai-text-detector" />
		</ToolLayout>
	);
}
