import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Mortgage Calculator",
	description: "Enter the home price, down payment, interest rate and loan term to see your monthly principal-and-interest payment, plus total interest and total paid. Free, no signup.",
	route: "/mortgage-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/mortgage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="mortgage-calculator" />
		</ToolLayout>
	);
}
