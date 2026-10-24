import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "EPF Calculator (Employee Provident Fund)",
	description: "Enter your monthly basic salary, current EPF balance, age, hikes and interest rate to project your provident fund corpus at retirement, with contributions and interest year by year.",
	route: "/epf-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/epf-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
