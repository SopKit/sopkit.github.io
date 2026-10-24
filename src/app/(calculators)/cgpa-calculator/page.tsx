import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "CGPA Calculator",
	description: "Enter your SGPA for each semester to calculate your overall CGPA instantly, with room to add or remove semesters as your results come in, free in your browser.",
	route: "/cgpa-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/cgpa-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa" />
		</ToolLayout>
	);
}
