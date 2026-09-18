import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Salary Calculator India",
	description: "Calculate monthly in-hand take-home salary from annual CTC in India with PF, professional tax, and income tax deductions. 100% private browser calculator.",
	route: "/salary-calculator-india",
	category: "money",
});

export default function ToolPage() {
	const tool = getToolByRoute("/salary-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FinanceCalculators defaultTab="salary" />
		</ToolLayout>
	);
}
