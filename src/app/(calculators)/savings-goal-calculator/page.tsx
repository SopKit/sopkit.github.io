import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Savings Goal Calculator",
	description: "Enter your savings goal, current savings, annual interest rate and months to goal to find the monthly deposit needed to reach it. Free, no signup.",
	route: "/savings-goal-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/savings-goal-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="savings-goal-calculator" />
		</ToolLayout>
	);
}
