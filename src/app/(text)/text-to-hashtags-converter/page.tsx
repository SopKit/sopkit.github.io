import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Text to Hashtags Converter",
	description: "Extract trending, high-relevance hashtags from captions, blog posts, and marketing copy for Instagram, TikTok, and X. Boost social reach free in your browser.",
	route: "/text-to-hashtags-converter",
	category: "text",
});

export default function ToolPage() {
	const tool = getToolByRoute("/text-to-hashtags-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<ToolLayout breadcrumbs={[]} tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
