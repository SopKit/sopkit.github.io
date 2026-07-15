import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";


export const metadata = {
	title: "Free SGPA to CGPA Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free SGPA to CGPA Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "sgpa to cgpa calculator, free online tool, no signup, sgpa to cgpa calculator online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/sgpa-to-cgpa-calculator",
	},
	openGraph: {
		title: "Free SGPA to CGPA Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free SGPA to CGPA Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/sgpa-to-cgpa-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SGPA to CGPA Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free SGPA to CGPA Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/sgpa-to-cgpa-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa" />
		</ToolLayout>
	);
}
