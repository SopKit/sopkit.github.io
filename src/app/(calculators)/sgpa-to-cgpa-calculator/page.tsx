import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AcademicGradesCalculator from "@/components/tools/calculators/AcademicGradesCalculator";


export const metadata = {
	title: "SGPA to CGPA Calculator Online Free | SopKit",
	description: "Calculate your cumulative GPA (CGPA) from semester-wise SGPA values. Supports credit-weighted and simple average methods. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/sgpa-to-cgpa-calculator",
	},
	openGraph: {
		title: "SGPA to CGPA Calculator Online Free - No Signup | SopKit",
		description: "Calculate your cumulative GPA (CGPA) from semester-wise SGPA values. Supports credit-weighted and simple average methods. No signup, no uploads, 100% private br",
		url: "https://sopkit.github.io/sgpa-to-cgpa-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SGPA to CGPA Calculator Online Free - Fast & Secure",
		description: "Calculate your cumulative GPA (CGPA) from semester-wise SGPA values. Supports credit-weighted and simple average methods. No signup, no uploads, 100% private br",
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
		<ToolLayout tool={tool}>
			<AcademicGradesCalculator defaultTab="cgpa" />
		</ToolLayout>
	);
}
