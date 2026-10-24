import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Recurring Deposit (RD) Calculator",
	description: "Enter your monthly deposit, interest rate and tenure to project your recurring deposit maturity value, total invested and interest earned, with a year-wise growth table.",
	route: "/rd-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/rd-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
