import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";


export const metadata = {
	title: "Free CGPA to Percentage Calculator for Indian Universities Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free CGPA to Percentage Calculator for Indian Universities online. Quick, accurate browser calculato...",
	keywords: "cgpa to percentage calculator for indian universities, free online tool, no signup, cgpa to percentage calculator for indian universities online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/cgpa-to-percentage-calculator-india",
	},
	openGraph: {
		title: "Free CGPA to Percentage Calculator for Indian Universities Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free CGPA to Percentage Calculator for Indian Universities online. Quick, accurate browser calculato...",
		url: "https://sopkit.github.io/cgpa-to-percentage-calculator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CGPA to Percentage Calculator for Indian Universities Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free CGPA to Percentage Calculator for Indian Universities online. Quick, accurate browser calculato...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/cgpa-to-percentage-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa-pct" />
		</ToolLayout>
	);
}
