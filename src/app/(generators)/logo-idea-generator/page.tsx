import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Logo Idea Generator",
	description: "Generate creative logo concepts, typography styles, icon ideas, and color palettes for startups and side projects. Explore branding concepts free in browser.",
	route: "/logo-idea-generator",
	category: "generators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/logo-idea-generator");

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
