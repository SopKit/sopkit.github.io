import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "CGPA to Percentage Calculator",
	description: "Enter your CGPA and pick a conversion factor to get its equivalent percentage instantly, with the standard 9.5 factor as the default. Free, no signup, and nothing to install.",
	route: "/cgpa-to-percentage-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/cgpa-to-percentage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa-pct" />
		</ToolLayout>
	);
}
