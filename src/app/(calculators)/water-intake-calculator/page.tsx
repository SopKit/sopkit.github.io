import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Daily Water Intake Calculator",
	description: "Enter your weight in kg and daily exercise minutes to get your recommended daily water intake in litres and fluid ounces, adjusted for exercise. Free, no signup.",
	route: "/water-intake-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/water-intake-calculator");

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
