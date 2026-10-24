import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Fuel Cost Calculator",
	description: "Enter trip distance, your vehicle's fuel economy and the fuel price per litre to see how many litres you'll need and the estimated total trip cost.",
	route: "/fuel-cost-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/fuel-cost-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="fuel-cost-calculator" />
		</ToolLayout>
	);
}
