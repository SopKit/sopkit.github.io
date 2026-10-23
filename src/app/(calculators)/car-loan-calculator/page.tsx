import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Car Loan Calculator",
	description: "Calculate your car loan EMI online: enter the loan amount, interest rate and tenure to see your monthly EMI, total interest payable and total repayment instantly. Free, no signup.",
	route: "/car-loan-calculator",
	category: "calculators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/car-loan-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="car-loan-calculator" />
		</ToolLayout>
	);
}
