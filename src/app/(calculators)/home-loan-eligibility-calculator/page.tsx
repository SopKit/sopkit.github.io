import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Home Loan Eligibility Calculator",
	description: "Enter net monthly salary, existing EMIs, interest rate and tenure to estimate the home loan amount you qualify for, plus the maximum affordable monthly EMI.",
	route: "/home-loan-eligibility-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/home-loan-eligibility-calculator");

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
