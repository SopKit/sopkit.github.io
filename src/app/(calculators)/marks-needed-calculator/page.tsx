import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";


export const metadata = {
	title: "Free Exam Marks Needed Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Exam Marks Needed Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "exam marks needed calculator, free online tool, no signup, exam marks needed calculator online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/marks-needed-calculator",
	},
	openGraph: {
		title: "Free Exam Marks Needed Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Exam Marks Needed Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/marks-needed-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Exam Marks Needed Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Exam Marks Needed Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/marks-needed-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AcademicGradesCalculator defaultTab="req-marks" />
		</ToolLayout>
	);
}
