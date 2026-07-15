import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";

export const metadata = {
	title: "Free CGPA to Percentage Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free CGPA to Percentage Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "cgpa-to-percentage-calculator, CGPA to Percentage Calculator, convert cgpa to percentage, cgpa to percent CBSE, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/cgpa-to-percentage-calculator",
	},
	openGraph: {
		title: "Free CGPA to Percentage Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free CGPA to Percentage Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/cgpa-to-percentage-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CGPA to Percentage Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free CGPA to Percentage Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/cgpa-to-percentage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa-pct" />
		</ToolLayout>
	);
}
