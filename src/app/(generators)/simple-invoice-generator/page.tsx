import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Simple Invoice Generator",
	description: "Create clean, itemized invoices with customizable taxes, discounts, and currency symbols. Generate and print professional client bills with zero server storage.",
	route: "/simple-invoice-generator",
	category: "generators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/simple-invoice-generator");

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
