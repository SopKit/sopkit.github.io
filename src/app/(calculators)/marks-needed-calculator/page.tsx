import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";


export const metadata = {
	title: "Exam Marks Needed Calculator Online Free | SopKit",
	description: "Find out exactly how many marks you need in your final exam to pass or reach your target grade based on internal scores. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/marks-needed-calculator/",
	},
	openGraph: {
		title: "Exam Marks Needed Calculator Online Free - No Signup | SopKit",
		description: "Find out exactly how many marks you need in your final exam to pass or reach your target grade based on internal scores. No signup, no uploads, 100% private bro",
		url: "https://sopkit.github.io/marks-needed-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Exam Marks Needed Calculator Online Free - Fast & Secure",
		description: "Find out exactly how many marks you need in your final exam to pass or reach your target grade based on internal scores. No signup, no uploads, 100% private bro",
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
