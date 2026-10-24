import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Break-Even Calculator",
	description: "Enter fixed costs, variable cost per unit and selling price per unit to find how many units you must sell to break even and the revenue at that point.",
	route: "/break-even-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/break-even-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="break-even-calculator" />
		</ToolLayout>
	);
}
