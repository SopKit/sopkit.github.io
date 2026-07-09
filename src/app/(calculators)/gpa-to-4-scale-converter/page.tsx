import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "GPA to 4.0 Scale Converter Online Free | SopKit",
	description: "Convert your Indian percentage or 10-point CGPA into the standard US 4.0 GPA scale for study abroad. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/gpa-to-4-scale-converter",
	},
	openGraph: {
		title: "GPA to 4.0 Scale Converter Online Free - No Signup | SopKit",
		description: "Convert your Indian percentage or 10-point CGPA into the standard US 4.0 GPA scale for study abroad. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/gpa-to-4-scale-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "GPA to 4.0 Scale Converter Online Free - Fast & Secure",
		description: "Convert your Indian percentage or 10-point CGPA into the standard US 4.0 GPA scale for study abroad. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/gpa-to-4-scale-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
