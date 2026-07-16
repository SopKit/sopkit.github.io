import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "SGPA to CGPA Calculator",
	description: "Private SGPA to CGPA Calculator: privately calculate numbers entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
