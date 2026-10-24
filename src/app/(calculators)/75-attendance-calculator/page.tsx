import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AttendanceCalculator from "@/components/tools/calculators/AttendanceCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "75% Attendance Calculator",
	description: "Enter classes attended, total classes held and target percentage to see your current attendance, how many classes you can safely miss, and how many to attend to hit it. Free, no signup.",
	route: "/75-attendance-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/75-attendance-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AttendanceCalculator />
		</ToolLayout>
	);
}
