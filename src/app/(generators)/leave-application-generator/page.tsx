import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LeaveLetterGenerator from "@/components/tools/generators/LeaveLetterGenerator";

export const metadata = {
	title: "Free Leave Application Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Leave Application Generator online. Generate high-quality outputs instantly with no registration required. Try it free now.",
	keywords: "leave-application-generator, Leave Application Generator",
	alternates: {
		canonical: "https://sopkit.github.io/leave-application-generator",
	},
	openGraph: {
		title: "Free Leave Application Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Leave Application Generator online. Generate high-quality outputs instantly with no registration required. Try it free now.",
		url: "https://sopkit.github.io/leave-application-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Leave Application Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Leave Application Generator online. Generate high-quality outputs instantly with no registration required. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/leave-application-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LeaveLetterGenerator />
		</ToolLayout>
	);
}
