import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";


export const metadata = {
	title: "CGPA to Percentage Calculator for Indian Universities Free | SopKit",
	description: "Convert your CGPA into percentage using common Indian university formulas like CBSE 9.5x, VTU, Mumbai University, DU, AKTU, and Anna University. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/cgpa-to-percentage-calculator-india",
	},
	openGraph: {
		title: "CGPA to Percentage Calculator for Indian Universities Online Free - No Signup | SopKit",
		description: "Convert your CGPA into percentage using common Indian university formulas like CBSE 9.5x, VTU, Mumbai University, DU, AKTU, and Anna University. No signup, no u",
		url: "https://sopkit.github.io/cgpa-to-percentage-calculator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CGPA to Percentage Calculator for Indian Universities Online Free - Fast & Secure",
		description: "Convert your CGPA into percentage using common Indian university formulas like CBSE 9.5x, VTU, Mumbai University, DU, AKTU, and Anna University. No signup, no u",
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
