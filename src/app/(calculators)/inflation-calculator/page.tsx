import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Inflation Calculator",
	description: "Enter an amount, an annual inflation rate and a number of years to see the future sum needed to keep pace and what today's money will be worth then.",
	route: "/inflation-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/inflation-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="inflation-calculator" />
		</ToolLayout>
	);
}
