import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import StoryIdeaGenerator from "@/components/tools/generators/StoryIdeaGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Story Idea Generator",
	description: "Generate creative plot outlines, character concepts, and writing prompts across multiple fiction genres. Free writing inspiration tool.",
	route: "/story-idea-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/story-idea-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<StoryIdeaGenerator />
		</ToolLayout>
	);
}
