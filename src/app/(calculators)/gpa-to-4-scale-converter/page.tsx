import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free GPA to 4.0 Scale Converter Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free GPA to 4.0 Scale Converter online. Quick, accurate browser calculator with no registration.",
	keywords: "gpa to 4.0 scale converter, free online tool, no signup, gpa to 4.0 scale converter online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/gpa-to-4-scale-converter",
	},
	openGraph: {
		title: "Free GPA to 4.0 Scale Converter Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free GPA to 4.0 Scale Converter online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/gpa-to-4-scale-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free GPA to 4.0 Scale Converter Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free GPA to 4.0 Scale Converter online. Quick, accurate browser calculator with no registration.",
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
