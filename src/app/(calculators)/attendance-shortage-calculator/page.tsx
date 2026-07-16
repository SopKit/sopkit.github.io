import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AttendanceCalculator from "@/components/tools/calculators/AttendanceCalculator";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Attendance Shortage Calculator",
	description: "Private Attendance Shortage Calculator: privately calculate numbers entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/attendance-shortage-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/attendance-shortage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AttendanceCalculator />
		</ToolLayout>
	);
}
