import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AttendanceCalculator from "@/components/tools/calculators/AttendanceCalculator";


export const metadata = {
	title: "Free Attendance Shortage Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Attendance Shortage Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "attendance shortage calculator, free online tool, no signup, attendance shortage calculator online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/attendance-shortage-calculator",
	},
	openGraph: {
		title: "Free Attendance Shortage Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Attendance Shortage Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/attendance-shortage-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Attendance Shortage Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Attendance Shortage Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/attendance-shortage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AttendanceCalculator />
		</ToolLayout>
	);
}
