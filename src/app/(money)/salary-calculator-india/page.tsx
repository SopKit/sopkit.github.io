import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "Salary Calculator India (CTC to In-Hand) Free | SopKit",
	description: "Calculate your monthly in-hand salary from annual CTC with PF, professional tax, and income tax deductions. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/salary-calculator-india/",
	},
	openGraph: {
		title: "Salary Calculator India (CTC to In-Hand) Online Free - No Signup | SopKit",
		description: "Calculate your monthly in-hand salary from annual CTC with PF, professional tax, and income tax deductions. No signup, no uploads, 100% private browser-based to",
		url: "https://sopkit.github.io/salary-calculator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Salary Calculator India (CTC to In-Hand) Online Free - Fast & Secure",
		description: "Calculate your monthly in-hand salary from annual CTC with PF, professional tax, and income tax deductions. No signup, no uploads, 100% private browser-based to",
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
