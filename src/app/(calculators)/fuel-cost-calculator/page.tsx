import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Fuel Cost Calculator",
	description: "Privacy-friendly, 100% client-side fuel cost calculation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
