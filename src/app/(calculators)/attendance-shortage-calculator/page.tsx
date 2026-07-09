import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AttendanceCalculator from "@/components/tools/calculators/AttendanceCalculator";


export const metadata = {
	title: "Attendance Shortage Calculator Online Free | SopKit",
	description: "Calculate how many classes you need to attend to reach 75% attendance or how many classes you can safely miss. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/attendance-shortage-calculator/",
	},
	openGraph: {
		title: "Attendance Shortage Calculator Online Free - No Signup | SopKit",
		description: "Calculate how many classes you need to attend to reach 75% attendance or how many classes you can safely miss. No signup, no uploads, 100% private browser-based",
		url: "https://sopkit.github.io/attendance-shortage-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Attendance Shortage Calculator Online Free - Fast & Secure",
		description: "Calculate how many classes you need to attend to reach 75% attendance or how many classes you can safely miss. No signup, no uploads, 100% private browser-based",
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
