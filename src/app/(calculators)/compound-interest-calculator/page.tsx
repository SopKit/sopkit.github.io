import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Compound Interest Calculator",
	description: "Enter your starting amount, annual rate, time period and regular contributions to see the future value and total interest earned. Free compound interest calculator, no signup.",
	route: "/compound-interest-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/compound-interest-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="compound-interest-calculator" />
		</ToolLayout>
	);
}
