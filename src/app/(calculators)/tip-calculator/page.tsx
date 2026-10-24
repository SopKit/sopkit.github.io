import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Tip Calculator",
	description: "Enter the bill, a tip percentage and how many people are splitting to see the tip, the total bill and what each person pays. Free, no signup.",
	route: "/tip-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/tip-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="tip-calculator" />
		</ToolLayout>
	);
}
