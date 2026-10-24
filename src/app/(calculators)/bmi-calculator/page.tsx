import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "BMI Calculator",
	description: "Enter your weight and height to calculate your BMI instantly, with a category result from underweight to obese. Free BMI calculator that runs fully in your browser, no signup.",
	route: "/bmi-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/bmi-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="bmi-calculator" />
		</ToolLayout>
	);
}
