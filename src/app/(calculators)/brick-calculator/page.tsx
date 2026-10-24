import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Brick Calculator",
	description: "Enter your wall length, height and thickness plus your brick size to estimate how many bricks you need, the wall volume, and the mortar volume for the job. Free, no signup.",
	route: "/brick-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/brick-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ConstructionCalculator defaultTab="brick" />
		</ToolLayout>
	);
}
