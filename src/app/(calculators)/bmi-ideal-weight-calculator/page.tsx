import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "BMI + Ideal Weight Calculator",
	description: "Enter your weight in kilograms and height in centimetres to get your BMI, its weight category, and an estimated ideal weight from the Devine formula, all on one screen. Free, no signup.",
	route: "/bmi-ideal-weight-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/bmi-ideal-weight-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<ToolLayout breadcrumbs={[]} tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
