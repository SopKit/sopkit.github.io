import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Rent Affordability Calculator",
	description: "Enter monthly income and existing debts to see conservative, moderate and stretched rent budgets based on the 25%, 30% and 40% of income rules.",
	route: "/rent-affordability-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/rent-affordability-calculator");

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
