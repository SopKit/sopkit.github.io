import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "AI Image Detector",
	description: "Detect AI-generated images and deepfakes. Analyze image metadata and patterns to identify synthetic media.",
	route: "/ai-image-detector",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-image-detector");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="ai-image-detector" />
		</ToolLayout>
	);
}
