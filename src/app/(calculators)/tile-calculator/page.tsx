import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Tile Calculator",
	description: "Enter your floor length and width, tile size and wastage allowance to work out the total area and how many tiles to buy. Free tile calculator, no signup.",
	route: "/tile-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/tile-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ConstructionCalculator defaultTab="tile" />
		</ToolLayout>
	);
}
