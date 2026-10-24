import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Paint Calculator",
	description: "Enter a room's length, width and wall height, plus coats, doors and windows, to work out how much paint you need in litres and gallons before you buy.",
	route: "/paint-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/paint-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ConstructionCalculator defaultTab="paint" />
		</ToolLayout>
	);
}
