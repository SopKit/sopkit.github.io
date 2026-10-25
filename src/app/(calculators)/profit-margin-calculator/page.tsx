import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Profit Margin Calculator",
	description: "Enter cost price and selling price to get gross profit, gross profit margin percentage and markup percentage for any product. Free, no signup.",
	route: "/profit-margin-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/profit-margin-calculator");

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
