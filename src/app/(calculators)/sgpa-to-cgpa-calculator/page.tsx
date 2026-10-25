import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "SGPA to CGPA Calculator",
	description: "Enter your semester-wise SGPA values to calculate your cumulative CGPA as their average, calculated instantly in your browser, free with no signup.",
	route: "/sgpa-to-cgpa-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/sgpa-to-cgpa-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa" />
		</ToolLayout>
	);
}
