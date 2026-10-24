import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Date Difference Calculator",
	description: "Pick any two dates to see the gap in years, months and days, plus total days, weeks and hours between them, for age, tenure and deadline checks.",
	route: "/date-difference-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/date-difference-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
