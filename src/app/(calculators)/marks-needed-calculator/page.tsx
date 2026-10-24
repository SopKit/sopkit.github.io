import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Exam Marks Needed Calculator",
	description: "Enter your internal marks, the exam's total marks and your target percentage to find exactly how many marks you still need in the exam to hit your goal.",
	route: "/marks-needed-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/marks-needed-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="req-marks" />
		</ToolLayout>
	);
}
