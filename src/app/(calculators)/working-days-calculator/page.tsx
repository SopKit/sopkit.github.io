import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Working Days Calculator",
	description: "Pick a start and end date, exclude Saturdays, Sundays and custom holidays, and get the net business days in the period plus a calendar-day breakdown.",
	route: "/working-days-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/working-days-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
