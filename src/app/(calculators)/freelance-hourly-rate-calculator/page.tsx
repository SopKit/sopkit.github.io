import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FreelanceHourlyRateCalculator from "@/components/tools/calculators/FreelanceHourlyRateCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Freelance Hourly Rate Calculator",
	description: "Calculate your target freelance hourly rate, daily rate, and monthly retainers based on desired annual salary, business expenses, taxes, and billable hours.",
	route: "/freelance-hourly-rate-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/freelance-hourly-rate-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FreelanceHourlyRateCalculator />
		</ToolLayout>
	);
}
