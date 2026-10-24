import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "ROI Calculator",
	description: "Enter your initial investment, final value and holding period to see net gain, total ROI and annualized ROI for any investment. Free, no signup.",
	route: "/roi-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/roi-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="roi-calculator" />
		</ToolLayout>
	);
}
