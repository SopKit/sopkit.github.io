import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "CGPA to Percentage Calculator for Indian Universities",
	description: "Enter your CGPA to convert it into an equivalent percentage for Indian universities, choosing the conversion factor your institution uses, with 9.5 as the standard default. Free, no signup.",
	route: "/cgpa-to-percentage-calculator-india",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/cgpa-to-percentage-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa-pct" />
		</ToolLayout>
	);
}
