import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Protein Intake Calculator",
	description: "Enter your weight in kg and get a daily protein target range for an active lifestyle and for muscle building, calculated instantly in your browser, free with no signup.",
	route: "/protein-intake-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/protein-intake-calculator");

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
