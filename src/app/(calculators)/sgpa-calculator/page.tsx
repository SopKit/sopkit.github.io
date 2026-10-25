import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "SGPA Calculator",
	description: "Enter your course credits and grade points to compute your Semester Grade Point Average instantly, with per-course entries, free in your browser and no signup needed.",
	route: "/sgpa-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/sgpa-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="sgpa" />
		</ToolLayout>
	);
}
