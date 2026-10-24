import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import TaxCalculator from "@/components/tools/calculators/TaxCalculator";

export const metadata = generateToolMetadata({
	name: "Income Tax Calculator",
	description: "Enter salary income and deductions (80C, 80D, HRA) to compare income tax under the new and old regimes, with slab-wise tax, the 87A rebate and 4% cess. Runs in your browser, no signup.",
	route: "/income-tax-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/income-tax-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TaxCalculator />
		</ToolLayout>
	);
}
