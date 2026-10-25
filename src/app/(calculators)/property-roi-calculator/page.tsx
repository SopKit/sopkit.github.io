import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Property ROI Calculator",
	description: "Enter the purchase price, monthly rental income and annual expenses to see gross rental yield and net annual ROI, excluding appreciation. Free, no signup.",
	route: "/property-roi-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/property-roi-calculator");

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
