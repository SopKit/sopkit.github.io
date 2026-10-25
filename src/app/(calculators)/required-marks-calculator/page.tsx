import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Required Marks Calculator",
	description: "Enter your internal marks, exam weightage and target percentage to find exactly how many marks you need in your final exam to pass or reach your goal, free with no signup.",
	route: "/required-marks-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/required-marks-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="req-marks" />
		</ToolLayout>
	);
}
