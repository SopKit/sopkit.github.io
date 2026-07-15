import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "Free Salary Calculator India (CTC to In-Hand) Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Salary Calculator India (CTC to In-Hand) online. Quick, accurate browser calculator with no reg...",
	keywords: "salary calculator india (ctc to in-hand), free online tool, no signup, salary calculator india (ctc to in-hand) online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/salary-calculator-india",
	},
	openGraph: {
		title: "Free Salary Calculator India (CTC to In-Hand) Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Salary Calculator India (CTC to In-Hand) online. Quick, accurate browser calculator with no reg...",
		url: "https://sopkit.github.io/salary-calculator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Salary Calculator India (CTC to In-Hand) Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Salary Calculator India (CTC to In-Hand) online. Quick, accurate browser calculator with no reg...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/salary-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FinanceCalculators defaultTab="salary" />
		</ToolLayout>
	);
}
