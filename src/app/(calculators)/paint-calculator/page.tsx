import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Paint Calculator",
	description: "Private Paint Calculator: privately calculate numbers entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
