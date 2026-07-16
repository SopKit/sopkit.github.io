import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import TaxCalculator from "@/components/tools/calculators/TaxCalculator";

export const metadata = generateToolMetadata({
	name: "Income Tax Calculator",
	description: "Privacy-friendly, 100% client-side income tax calculation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
