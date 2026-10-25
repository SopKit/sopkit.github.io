import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Freelance Rate Calculator",
	description: "Enter an annual income goal, business expenses and billable hours to work out the hourly and daily freelance rate you need to charge. Free, no signup.",
	route: "/freelance-rate-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/freelance-rate-calculator");

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
